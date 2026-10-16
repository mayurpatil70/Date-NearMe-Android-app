import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider, AuthContext } from "./Context/AuthContext";
import { SocketProvider } from "./Context/SocketContext";

// Import Components
import SplashScreen from "./components/layout/SplashScreen";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Radar from "./components/Map/Radar";
import ChatRoom from "./components/Chat/ChatRoom";
import Wallet from "./components/Wallet/Wallet";
import ResetPassword from "./components/auth/ResetPassword";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-stone-900 font-sans">
        <div className="w-10 h-10 border-3 border-stone-200 border-t-[#711A31] rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-serif font-bold text-stone-500 tracking-wider">Loading Date-NearMe...</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#ffffff",
                  color: "#1c1917",
                  border: "1px solid rgba(231, 229, 228, 0.8)",
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
                  fontWeight: "600",
                  fontSize: "13px",
                  borderRadius: "16px",
                  padding: "10px 16px",
                },
              }}
            />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/radar"
                element={
                  <ProtectedRoute>
                    <Radar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:targetUserId"
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
