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
      const getSocketUrl = () => {
        if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
        if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
        if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
        if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL.replace(/\/api\/?$/, "");
        if (
          typeof window !== "undefined" &&
          window.location.hostname !== "localhost" &&
          window.location.hostname !== "127.0.0.1"
        ) {
          return "https://date-near-me-android-app-backend.vercel.app";
        }
        return "http://localhost:5000";
      };

      const rawUrl = getSocketUrl();

      // Connect to the backend with resilience
      const newSocket = io(rawUrl, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 2,
        timeout: 5000,
        autoConnect: true,
      });

      newSocket.on("connect_error", () => {
        // Handled silently to avoid noisy uncaught console crashes on serverless deploys
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
