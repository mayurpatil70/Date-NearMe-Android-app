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
      <div className="h-screen w-screen bg-nearme-dark flex items-center justify-center text-white">
        Loading...
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
                style: { background: "#333", color: "#fff" },
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
