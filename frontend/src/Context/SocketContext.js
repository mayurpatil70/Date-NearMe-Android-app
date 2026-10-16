"use client";

import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      const rawUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL ||
        process.env.REACT_APP_SOCKET_URL ||
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
        process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, "") ||
        "http://localhost:5000";

      // Connect to the backend
      const newSocket = io(rawUrl, {
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        // Join personal room to receive direct messages
        newSocket.emit("join", user.id);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
