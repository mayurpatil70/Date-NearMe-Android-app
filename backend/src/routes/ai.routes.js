const express = require("express");
const aiController = require("../controllers/ai.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/wingman/:sessionId", protect, aiController.getWingmanSuggestion);

module.exports = router;
