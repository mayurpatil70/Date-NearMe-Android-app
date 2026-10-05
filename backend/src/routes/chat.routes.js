const express = require("express");
const chatController = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary"); 

const router = express.Router();

// Sprint 2: Blind Audio & Media Routes
router.post("/initialize", protect, chatController.initializeMatch);
router.post("/audio/upload", protect, upload.single("audio"), chatController.uploadAudioPrompt);
router.post("/audio/approve", protect, chatController.approveAudioPrompt);

// Sprint 3: Escrow & Match Resolution
router.post("/close", protect, chatController.closeMatch);

module.exports = router;
