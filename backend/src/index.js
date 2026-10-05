require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Import Redis Client (It now connects automatically on import)
const redisClient = require("./config/redis");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const walletRoutes = require("./routes/wallet.routes");
const chatRoutes = require("./routes/chat.routes");
const storyRoutes = require("./routes/story.routes");
const paymentRoutes = require("./routes/payment.routes");
const ngrok = require("@ngrok/ngrok");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err, req, res, next) => {
  console.error("Error in routes:", err);

  // Send the 500 response back to the client
  res.status(500).json({ message: "Internal Server Error" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Database Connections & Server Initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to Neon PostgreSQL
    await connectDB();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
