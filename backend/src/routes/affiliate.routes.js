const express = require("express");
const {
  getAffiliateStats,
  requestPayout,
} = require("../controllers/affiliate.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/stats", protect, getAffiliateStats);
router.post("/withdraw", protect, requestPayout);

module.exports = router;
