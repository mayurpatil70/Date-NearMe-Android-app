const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Helper function to generate JWT token for authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, gender } = req.body;

    // Check if user already exists
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user 
    const user = await User.create({
      email,
      password,
      gender,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (user && (await User.matchPassword(password, user.password_hash))) {
      res.json({
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Generate token and send password reset email
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save the token and an expiration time (1 hour from now) to the database
    // PostgreSQL timestamp needs to be formatted or we can pass a JS Date object
    const expireDate = new Date(Date.now() + 3600000);
    
    await User.setResetToken(user.email, resetToken, expireDate);

    // Configure Nodemailer to use your Gmail App Password
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // The URL points back to the React frontend route we just created
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "NearMe Password Reset Request",
      text: `You are receiving this because you requested a password reset.\n\n
                   Please click on the following link to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Password reset link sent to registered email" });
  } catch (error) {
    // If sending the email fails, clear the token fields from the database
    if (req.body.email) {
      await User.setResetToken(req.body.email, null, null);
    }
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
};

// Verify token and update to the new password
exports.resetPassword = async (req, res) => {
  try {
    // Find the user by the token provided in the URL, ensuring it hasn't expired
    const user = await User.findByValidResetToken(req.params.token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set the new password and clear the reset tokens
    const updatedUser = await User.updatePassword(user.id, req.body.password);

    res.status(200).json({
      message: "Password updated successfully",
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
