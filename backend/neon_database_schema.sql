-- ==============================================================================
-- Date-NearMe - Comprehensive Production SQL Schema for Neon.tech (PostgreSQL)
-- Compatible with Neon Serverless Postgres, PgBouncer, and NodeJS pg driver
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom ENUM Types (if not already created)
DO $$ BEGIN
    CREATE TYPE chat_status AS ENUM (
        'PENDING_AUDIO',
        'LOCKED_ESCROW',
        'ACTIVE',
        'MUTUAL_CLOSE',
        'GHOSTED_FORFEIT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. USERS TABLE: Core User Database & Indian Dating Profile Vitals
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication & Identity
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    display_name VARCHAR(100),
    gender VARCHAR(20) DEFAULT 'Male',
    firebase_uid VARCHAR(255),
    
    -- Wallet & Trust System (Single-slot escrow, ₹199 Lifetime model)
    wallet_balance INTEGER DEFAULT 0,
    trust_score INTEGER DEFAULT 50,
    emotional_readiness VARCHAR(100),
    
    -- Viral Affiliate & Cafe Referral Program (₹30 / 30% payout)
    affiliate_code VARCHAR(50) UNIQUE,
    referred_by VARCHAR(50),
    affiliate_balance NUMERIC(10, 2) DEFAULT 0.00,
    total_referrals INTEGER DEFAULT 0,
    upi_id VARCHAR(100),
    
    -- Indian Socio-Cultural & Lifestyle Dealbreakers
    diet VARCHAR(50) DEFAULT 'Pure Veg',
    relationship_intent VARCHAR(100) DEFAULT 'Dating for Marriage (1-2 Years)',
    family_dynamic VARCHAR(100) DEFAULT 'Planning to live independently',
    mother_tongue VARCHAR(50) DEFAULT 'Hindi',
    work_domain VARCHAR(100),
    
    -- Women's First Shield & Safety Verifications
    is_shield_verified BOOLEAN DEFAULT FALSE,
    is_work_verified BOOLEAN DEFAULT FALSE,
    
    -- Password Recovery
    reset_password_token VARCHAR(255),
    reset_password_expire TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning fast lookups on Neon
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_affiliate_code ON users(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);

-- ==============================================================================
-- 4. CAFE PARTNERS TABLE: Curated Partner Cafes with Table QR Standees
-- ==============================================================================
CREATE TABLE IF NOT EXISTS cafe_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    discount_offer VARCHAR(255) DEFAULT '10% off bill for Date-NearMe couples',
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    qr_code_token VARCHAR(100) UNIQUE NOT NULL,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00,
    total_couples_hosted INTEGER DEFAULT 0,
    total_revenue_recorded NUMERIC(12, 2) DEFAULT 0.00,
    commission_owed NUMERIC(12, 2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cafe_partners_qr ON cafe_partners(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_cafe_partners_city ON cafe_partners(city);

-- ==============================================================================
-- 5. AFFILIATE CONVERSIONS TABLE: Audit Trail for ₹30 Referral Rewards
-- ==============================================================================
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_code VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    reward_amount NUMERIC(10, 2) DEFAULT 30.00,
    status VARCHAR(50) DEFAULT 'earned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_code ON affiliate_conversions(affiliate_code);

-- ==============================================================================
-- 6. TRANSACTIONS TABLE: Razorpay ₹199 Lifetime Access Orders & Invoices
-- ==============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(255),
    amount INTEGER NOT NULL,
    coins_granted INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- ==============================================================================
-- 7. CHAT SESSIONS & ANTI-GHOSTING ESCROW
-- ==============================================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status chat_status DEFAULT 'PENDING_AUDIO',
    escrow_amount INTEGER NOT NULL DEFAULT 1,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_users ON chat_sessions(user_a_id, user_b_id);

CREATE TABLE IF NOT EXISTS audio_exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    audio_url VARCHAR(500) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(50), -- 'ESCROW_LOCK', 'REFUND', 'SLASH'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 8. 24-HOUR EPHEMERAL STORIES & VENUE CHECK-INS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE TABLE IF NOT EXISTS venue_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_id VARCHAR(100) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 9. AUTOMATIC TRIGGER FOR updated_at TIMESTAMP
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- 10. REAL-TIME CHAT MESSAGES & OFFLINE NOTIFICATIONS QUEUE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100),
    sender_id VARCHAR(100) NOT NULL,
    receiver_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_delivered BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver ON chat_messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

CREATE TABLE IF NOT EXISTS offline_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    sender_id VARCHAR(100) NOT NULL,
    sender_name VARCHAR(150),
    sender_avatar VARCHAR(500),
    message_preview VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_offline_notifications_user ON offline_notifications(user_id, is_read);
