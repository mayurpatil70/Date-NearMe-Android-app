const { pool } = require('../config/db');

exports.updateLocation = async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        // In PostgreSQL with PostGIS, we would use ST_SetSRID(ST_MakePoint(longitude, latitude), 4326).
        // Since we are using standard Postgres for now, we can store it in JSON or separate columns if we alter the table.
        // For the MVP, we assume we add a location column of type POINT.
        // await pool.query("UPDATE users SET location = point($1, $2) WHERE id = $3", [longitude, latitude, req.user.id]);
        
        res.json({ message: 'Location update logic placeholder for Postgres' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNearbyUsers = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Placeholder for Postgres Geo queries (using PostGIS ST_DWithin or simple math)
        const result = await pool.query(
            `SELECT id, email, gender, trust_score, wallet_balance 
             FROM users 
             WHERE id != $1 
             LIMIT $2 OFFSET $3`,
            [req.user.id, parseInt(limit), parseInt(skip)]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await req.user;
        res.json({
            id: user.id,
            email: user.email,
            phoneNumber: user.phone_number || user.phoneNumber,
            displayName: user.display_name || user.displayName,
            gender: user.gender,
            walletBalance: user.wallet_balance || user.walletBalance,
            trustScore: user.trust_score || user.trustScore,
            createdAt: user.created_at,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const User = require('../models/user');
        const { phoneNumber, displayName, gender } = req.body;
        const updated = await User.updateProfile(req.user.id, {
            phoneNumber,
            displayName,
            gender
        });
        res.json({
            message: 'Profile updated successfully',
            user: updated
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};