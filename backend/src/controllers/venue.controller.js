const { pool } = require("../config/db");

// Simulate generating a QR code for a venue date
exports.generateDatePass = async (req, res) => {
    try {
        const { venueId, sessionId } = req.body;
        const userId = req.user.id;

        // Verify active session
        const sessionRes = await pool.query(
            "SELECT id FROM chat_sessions WHERE id = $1 AND status = 'ACTIVE' AND (user_a_id = $2 OR user_b_id = $2)",
            [sessionId, userId]
        );

        if (sessionRes.rows.length === 0) {
            return res.status(403).json({ message: "No active date session found." });
        }

        // Generate a mock QR token
        const qrToken = `VENUE-${venueId}-USER-${userId}-SEC-${Date.now()}`;

        res.json({
            message: "Date Pass generated. Show this QR to the venue partner.",
            qrToken
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Venue scans QR code to verify check-in
exports.verifyCheckIn = async (req, res) => {
    try {
        const { qrToken, venueId } = req.body;
        // In a real app, the token would be parsed/decrypted.
        // For MVP, we extract user from token (assuming token is VENUE-{venue}-USER-{user}-SEC-{time})
        const parts = qrToken.split("-");
        if (parts.length < 6 || parts[1] !== venueId) {
            return res.status(400).json({ message: "Invalid Date Pass." });
        }

        const userId = parts[3];

        // Insert check-in record
        const checkinRes = await pool.query(
            "INSERT INTO venue_checkins (user_id, venue_id) VALUES ($1, $2) RETURNING *",
            [userId, venueId]
        );

        // Increase trust score for verified real-world daters
        await pool.query(
            "UPDATE users SET trust_score = trust_score + 10 WHERE id = $1",
            [userId]
        );

        res.json({
            message: "Check-in successful! User trust score increased.",
            checkin: checkinRes.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
