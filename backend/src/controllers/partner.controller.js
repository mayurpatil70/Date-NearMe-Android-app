const { pool } = require("../config/db");

// Get all verified partner cafes
exports.getPartnerCafes = async (req, res) => {
  try {
    const { city } = req.query;
    let query = "SELECT id, name, city, address, discount_offer, qr_code_token, contact_phone, contact_email, total_couples_hosted FROM cafe_partners WHERE is_verified = TRUE";
    const params = [];

    if (city) {
      query += " AND city ILIKE $1";
      params.push(`%${city}%`);
    }

    query += " ORDER BY total_couples_hosted DESC, name ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cafe Owner signs up as a partner
exports.joinCafePartner = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      contactPhone,
      contactEmail,
      discountOffer = "10% off bill for Date-NearMe couples",
    } = req.body;

    if (!name || !city || !contactPhone) {
      return res.status(400).json({ message: "Name, city, and contact phone are required." });
    }

    // Generate unique QR code token for table standees e.g. CAFE_THIRD_WAVE_9182
    const tokenPrefix = "CAFE_" + name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    const qrCodeToken = `${tokenPrefix}_${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await pool.query(
      `INSERT INTO cafe_partners 
        (name, city, address, discount_offer, contact_phone, contact_email, qr_code_token, commission_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 10.0)
       RETURNING *`,
      [name, city, address, discountOffer, contactPhone, contactEmail, qrCodeToken]
    );

    res.status(201).json({
      message: "Cafe Partnership registered successfully! Your custom QR standee is ready.",
      partner: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get stats for a specific cafe partner via their QR token or ID
exports.getCafeStats = async (req, res) => {
  try {
    const { identifier } = req.params;

    const result = await pool.query(
      `SELECT * FROM cafe_partners 
       WHERE qr_code_token = $1 OR id::text = $1`,
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cafe partner not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Log customer date bill spend & compute 10% platform commission
exports.logDateBill = async (req, res) => {
  try {
    const { qrCodeToken, billAmount } = req.body;

    if (!qrCodeToken || !billAmount || isNaN(billAmount)) {
      return res.status(400).json({ message: "Valid qrCodeToken and billAmount are required." });
    }

    const amount = Number(billAmount);
    const commission = (amount * 0.10); // 10% commission

    const updateRes = await pool.query(
      `UPDATE cafe_partners 
       SET total_revenue_recorded = total_revenue_recorded + $1,
           commission_owed = commission_owed + $2,
           total_couples_hosted = total_couples_hosted + 1
       WHERE qr_code_token = $3
       RETURNING *`,
      [amount, commission, qrCodeToken]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: "Invalid cafe partner token." });
    }

    res.json({
      message: "Customer date bill recorded successfully! 10% commission computed.",
      billAmount: amount,
      platformCommission: commission,
      partner: updateRes.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
