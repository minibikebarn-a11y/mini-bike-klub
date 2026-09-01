// api/newsletter.js
//
// Vercel Serverless Function — captures newsletter signups.
//
// Required: RESEND_API_KEY
// Optional: RESEND_AUDIENCE_ID — if you create a Resend Audience (Resend
//   dashboard → Audiences), subscribers get added there so you can send
//   campaigns later. Without it, this just emails ORDER_ADMIN_EMAIL for each
//   signup so nothing is lost — set that up as a stopgap and add the
//   Audience when you're ready to actually send newsletters.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { RESEND_API_KEY, RESEND_AUDIENCE_ID, ORDER_FROM_EMAIL, ORDER_ADMIN_EMAIL } = process.env;
  const { email } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: "Email service not configured" });
  }

  try {
    if (RESEND_AUDIENCE_ID) {
      const resp = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Resend Audience API error ${resp.status}: ${text}`);
      }
    } else if (ORDER_FROM_EMAIL && ORDER_ADMIN_EMAIL) {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: ORDER_FROM_EMAIL,
          to: ORDER_ADMIN_EMAIL,
          subject: "New newsletter signup — Mini Bike Klub",
          html: `<p>New subscriber: ${escapeHtml(email)}</p>`,
        }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Resend API error ${resp.status}: ${text}`);
      }
    } else {
      console.error("Neither RESEND_AUDIENCE_ID nor ORDER_FROM_EMAIL/ORDER_ADMIN_EMAIL configured");
      return res.status(500).json({ error: "Email service not fully configured" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return res.status(502).json({ error: "Failed to process signup" });
  }
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (s) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[s]));
}