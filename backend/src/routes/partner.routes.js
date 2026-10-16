const express = require("express");
const {
  getPartnerCafes,
  joinCafePartner,
  getCafeStats,
  logDateBill,
} = require("../controllers/partner.controller");

const router = express.Router();

router.get("/cafes", getPartnerCafes);
router.post("/join", joinCafePartner);
router.get("/cafe/:identifier", getCafeStats);
router.post("/log-bill", logDateBill);

module.exports = router;
