const { pool } = require("../config/db");

// 1. Initialize a new Match / Chat Session (State: PENDING_AUDIO)
exports.initializeMatch = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    // Check if user already has an active or pending slot
    const activeSlot = await pool.query(
      `SELECT id FROM chat_sessions 
       WHERE (user_a_id = $1 OR user_b_id = $1) 
       AND status IN ('PENDING_AUDIO', 'LOCKED_ESCROW', 'ACTIVE')`,
      [userId]
    );

    if (activeSlot.rows.length > 0) {
      return res.status(403).json({ message: "Hard concurrency cap reached. You can only maintain one active or pending slot at a time." });
    }

    // Escrow 1 coin
    const escrowAmount = 1;
    
    // Deduct coin from user
    await pool.query("UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2", [escrowAmount, userId]);

    // Create session
    const result = await pool.query(
      `INSERT INTO chat_sessions (user_a_id, user_b_id, status, escrow_amount) 
       VALUES ($1, $2, 'PENDING_AUDIO', $3) RETURNING *`,
      [userId, targetUserId, escrowAmount]
    );

    res.status(201).json({ message: "Match initialized. Pending mutual audio exchange.", session: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Upload Audio Prompt
exports.uploadAudioPrompt = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    // Insert audio exchange record
    const result = await pool.query(
      `INSERT INTO audio_exchanges (chat_session_id, sender_id, audio_url) 
       VALUES ($1, $2, $3) RETURNING *`,
      [sessionId, userId, req.file.path]
    );

    res.status(201).json({ message: "Audio prompt uploaded successfully", exchange: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Approve Audio Prompt & Progressive Reveal Logic
exports.approveAudioPrompt = async (req, res) => {
  try {
    const { exchangeId } = req.body;
    const userId = req.user.id; // User approving the audio received from the other

    // Mark audio as approved
    await pool.query("UPDATE audio_exchanges SET is_approved = TRUE WHERE id = $1", [exchangeId]);

    // Check if BOTH users have approved their respective received audio in this session
    // First, get the session ID for this exchange
    const exchangeRes = await pool.query("SELECT chat_session_id FROM audio_exchanges WHERE id = $1", [exchangeId]);
    const sessionId = exchangeRes.rows[0].chat_session_id;

    const approvals = await pool.query(
      "SELECT is_approved FROM audio_exchanges WHERE chat_session_id = $1 AND is_approved = TRUE", 
      [sessionId]
    );

    if (approvals.rowCount >= 2) {
      // Both have approved! Transition state machine to LOCKED_ESCROW or ACTIVE
      await pool.query(
        "UPDATE chat_sessions SET status = 'ACTIVE', locked_until = NOW() + INTERVAL '24 hours' WHERE id = $1",
        [sessionId]
      );

      // Return Cloudinary URL transformation parameters to the client to unblur the photos!
      // In Cloudinary, a blurred image looks like: /upload/e_blur:1000/v1/... 
      // The client can now strip the `e_blur` flag.
      return res.json({ 
        message: "Mutual approval reached! Photos decrypted and chat is ACTIVE.", 
        status: "ACTIVE",
        media_unlocked: true 
      });
    }

    res.json({ message: "Audio approved. Waiting for mutual approval to unlock photos." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Close Match (Anti-Ghosting / Polite Close)
exports.closeMatch = async (req, res) => {
  try {
    const { sessionId, resolution } = req.body; // resolution: 'POLITE_CLOSE' or 'GHOSTED'
    const userId = req.user.id;

    const sessionRes = await pool.query("SELECT * FROM chat_sessions WHERE id = $1", [sessionId]);
    if (sessionRes.rows.length === 0) return res.status(404).json({ message: "Session not found" });
    
    const session = sessionRes.rows[0];
    if (session.status !== 'ACTIVE') return res.status(400).json({ message: "Can only close ACTIVE matches" });

    // Ensure the requester is part of the session
    if (session.user_a_id !== userId && session.user_b_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (resolution === 'POLITE_CLOSE') {
      // Refund the token to BOTH users
      await pool.query("UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id IN ($2, $3)", [session.escrow_amount, session.user_a_id, session.user_b_id]);
      
      // Update session status
      await pool.query("UPDATE chat_sessions SET status = 'MUTUAL_CLOSE' WHERE id = $1", [sessionId]);

      // Log in escrow ledger
      await pool.query(
        "INSERT INTO escrow_ledger (user_id, chat_session_id, amount, transaction_type) VALUES ($1, $2, $3, 'REFUND'), ($4, $5, $6, 'REFUND')",
        [session.user_a_id, sessionId, session.escrow_amount, session.user_b_id, sessionId, session.escrow_amount]
      );

      res.json({ message: "Match politely closed. Escrow tokens refunded to both users." });
    } else if (resolution === 'GHOSTED') {
      // Logic: If last_message_at > 24 hours ago, the user who didn't message forfeits.
      // For MVP, we will just slash the token (burn it) and close the match.
      await pool.query("UPDATE chat_sessions SET status = 'GHOSTED_FORFEIT' WHERE id = $1", [sessionId]);
      
      // Log slash in ledger
      await pool.query(
        "INSERT INTO escrow_ledger (user_id, chat_session_id, amount, transaction_type) VALUES ($1, $2, $3, 'SLASH'), ($4, $5, $6, 'SLASH')",
        [session.user_a_id, sessionId, session.escrow_amount, session.user_b_id, sessionId, session.escrow_amount]
      );

      res.json({ message: "Match closed due to ghosting. Escrow tokens forfeited/slashed." });
    } else {
      res.status(400).json({ message: "Invalid resolution type" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};