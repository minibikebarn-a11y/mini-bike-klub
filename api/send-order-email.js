// api/send-order-email.js
//
// Vercel Serverless Function — sends the customer order-confirmation email
// and the admin new-order notification email via Resend, per spec section 33.
//
// Required environment variables (set in Vercel → Project → Settings →
// Environment Variables — never commit these or paste them into a chat):
//   RESEND_API_KEY     Your Resend API key (starts with re_...)
//   ORDER_FROM_EMAIL    A sender address on a domain you've verified in Resend,
//                        e.g. orders@minibikeklub.com — Resend will reject sends
//                        from unverified domains.
//   ORDER_ADMIN_EMAIL   Where new-order notifications should land.
//
// IMPORTANT — not yet done here (see spec section 45):
// This function trusts the totals/items the browser sends. Before relying on
// this for real payments, add server-side re-validation: look up each item's
// real price from MBK_PRODUCTS-equivalent data here, recompute subtotal/
// shipping/free-shipping eligibility, and reject the request if the client's
// numbers don't match. Right now it only checks that required fields exist.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { RESEND_API_KEY, ORDER_FROM_EMAIL, ORDER_ADMIN_EMAIL } = process.env;
  if (!RESEND_API_KEY || !ORDER_FROM_EMAIL || !ORDER_ADMIN_EMAIL) {
    console.error("Missing Resend environment variables");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const { orderNumber, items, subtotal, shipping, total, paymentMethod, billing } = req.body || {};

  if (!orderNumber || !Array.isArray(items) || items.length === 0 || !billing || !billing.email) {
    return res.status(400).json({ error: "Invalid order payload" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) {
    return res.status(400).json({ error: "Invalid billing email" });
  }

  const money = (n) => "$" + Number(n || 0).toLocaleString("en-US");

  const itemRows = items.map((i) =>
    `<tr><td style="padding:8px 0;">${escapeHtml(i.name)} &times; ${Number(i.quantity) || 1}</td>` +
    `<td style="padding:8px 0;text-align:right;">${money((i.price || 0) * (i.quantity || 1))}</td></tr>`
  ).join("");

  const customerHtml = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <h2 style="letter-spacing:1px;margin-bottom:0;">MINI BIKE KLUB</h2>
      <p style="color:#666;margin-top:4px;">ORDER CONFIRMATION</p>
      <p>Order #${escapeHtml(orderNumber)}</p>
      <table style="width:100%;border-collapse:collapse;">${itemRows}</table>
      <table style="width:100%;margin-top:12px;border-top:1px solid #ccc;padding-top:8px;">
        <tr><td>Subtotal</td><td style="text-align:right;">${money(subtotal)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right;">${Number(shipping) === 0 ? "FREE" : money(shipping)}</td></tr>
        <tr><td><strong>Total</strong></td><td style="text-align:right;"><strong>${money(total)}</strong></td></tr>
      </table>
      <p style="margin-top:20px;">Payment method: ${escapeHtml(paymentMethod)}</p>
      <p>We've received your order and will contact you with next steps for payment and fulfillment.</p>
    </div>`;

  const adminHtml = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#111;">
      <h2 style="margin-bottom:0;">NEW MINI BIKE KLUB ORDER</h2>
      <p style="color:#666;margin-top:4px;">Order #${escapeHtml(orderNumber)}</p>
      <p>
        <strong>${escapeHtml(billing.firstName || "")} ${escapeHtml(billing.lastName || "")}</strong><br>
        ${escapeHtml(billing.email)}<br>
        ${escapeHtml(billing.phone || "")}<br>
        ${escapeHtml(billing.address || "")}, ${escapeHtml(billing.city || "")}, ${escapeHtml(billing.state || "")} ${escapeHtml(billing.zip || "")}, ${escapeHtml(billing.country || "")}
      </p>
      <table style="width:100%;border-collapse:collapse;">${itemRows}</table>
      <p style="margin-top:12px;"><strong>Total: ${money(total)}</strong></p>
      <p>Payment method: ${escapeHtml(paymentMethod)}</p>
      ${billing.orderNote ? `<p>Note: ${escapeHtml(billing.orderNote)}</p>` : ""}
    </div>`;

  try {
    await Promise.all([
      sendEmail({
        apiKey: RESEND_API_KEY,
        from: ORDER_FROM_EMAIL,
        to: billing.email,
        subject: `Mini Bike Klub — Order Confirmation #${orderNumber}`,
        html: customerHtml,
      }),
      sendEmail({
        apiKey: RESEND_API_KEY,
        from: ORDER_FROM_EMAIL,
        to: ORDER_ADMIN_EMAIL,
        subject: `New order #${orderNumber} — ${billing.firstName || ""} ${billing.lastName || ""}`,
        html: adminHtml,
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Resend send failed:", err);
    return res.status(502).json({ error: "Failed to send order emails" });
  }
}

async function sendEmail({ apiKey, from, to, subject, html }) {
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Resend API error ${resp.status}: ${text}`);
  }
  return resp.json();
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (s) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[s]));
}