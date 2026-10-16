const express = require("express");
const {
  updateLocation,
  getNearbyUsers,
  getProfile,
  updateProfile,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Routes require the user to be logged in
router.post("/location", protect, updateLocation);
router.get("/nearby", protect, getNearbyUsers);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
