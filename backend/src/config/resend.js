const { Resend } = require('resend');

let resend = null;

if (process.env.RESEND_API_KEY) {
  try {
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (err) {
    console.warn("Resend initialization error:", err.message);
  }
} else {
  console.warn("Resend warning: RESEND_API_KEY is not configured. Email services disabled.");
}

if (!resend) {
  resend = {
    emails: {
      send: async () => {
        console.warn("Email send skipped: RESEND_API_KEY not configured");
        return { error: "RESEND_API_KEY not configured" };
      },
    },
  };
}

module.exports = resend;