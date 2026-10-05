const { pool } = require("../config/db");

// AI Wingman: Suggests an icebreaker if the conversation is stagnant
exports.getWingmanSuggestion = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        // 1. Verify session exists and is ACTIVE
        const sessionRes = await pool.query(
            "SELECT * FROM chat_sessions WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2)",
            [sessionId, userId]
        );

        if (sessionRes.rows.length === 0) {
            return res.status(404).json({ message: "Session not found or unauthorized." });
        }

        const session = sessionRes.rows[0];

        if (session.status !== 'ACTIVE') {
            return res.status(400).json({ message: "AI Wingman is only available in ACTIVE chats." });
        }

        // 2. Telemetry Check
        // In a real production app, a cron job checks if last_message_at is > 6 hours.
        // Here, the user can manually trigger the Wingman for a spark.

        // 3. Vector Match Context (Mocking the LLM generation for MVP)
        // In reality, this would query your `user_values` pgvector embeddings and pass them to an LLM.
        const suggestions = [
            "What's your most controversial food opinion?",
            "If we were to skip small talk, what's a rabbit hole you've gone down recently?",
            "Truth or dare: share the last song you listened to on repeat.",
            "I noticed we both matched on the 'weekend coffee' vibe. Cold brew or hot latte?"
        ];

        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

        res.json({
            message: "AI Wingman sparked an idea!",
            suggestion: randomSuggestion,
            isEphemeral: true // Frontend should display this as a temporary ghost message
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
