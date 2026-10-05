const express = require("express");
const venueController = require("../controllers/venue.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/generate-pass", protect, venueController.generateDatePass);
router.post("/check-in", protect, venueController.verifyCheckIn);

module.exports = router;
