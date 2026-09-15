import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type ContactPayload = {
  name: string;
  email: string;
  phone?: string | null;
  projectType?: string | null;
  budgetRange?: string | null;
  message: string;
};

export async function sendContactNotification(data: ContactPayload) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return { ok: false, skipped: true };
  }

  const notifyTo =
    process.env.NOTIFY_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "josephchimaobi28@gmail.com";

  const fromAddress = "onboarding@resend.dev";

  try {
    const result = await resend.emails.send({
      from: "Joseph Portfolio <" + fromAddress + ">",
      to: notifyTo,
      replyTo: data.email,
      subject: "New inquiry from " + data.name,
      html: buildHtml(data),
    });
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error("Email send failed:", err);
    return { ok: false, error: err };
  }
}

function buildHtml(d: ContactPayload) {
  const rows: string[] = [];

  rows.push(
    "<tr><td style=\"padding:10px 0;color:#888;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;width:140px;\">Name</td><td style=\"padding:10px 0;color:#111;font-size:15px;\">" +
      escape(d.name) +
      "</td></tr>"
  );

  rows.push(
    "<tr><td style=\"padding:10px 0;color:#888;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Email</td><td style=\"padding:10px 0;color:#111;font-size:15px;\"><a href=\"mailto:" +
      escape(d.email) +
      "\" style=\"color:#E87A2D;text-decoration:none;\">" +
      escape(d.email) +
      "</a></td></tr>"
  );

  if (d.phone) {
    rows.push(
      "<tr><td style=\"padding:10px 0;color:#888;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Phone</td><td style=\"padding:10px 0;color:#111;font-size:15px;\">" +
        escape(d.phone) +
        "</td></tr>"
    );
  }

  if (d.projectType) {
    rows.push(
      "<tr><td style=\"padding:10px 0;color:#888;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Project Type</td><td style=\"padding:10px 0;color:#111;font-size:15px;\">" +
        escape(d.projectType) +
        "</td></tr>"
    );
  }

  if (d.budgetRange) {
    rows.push(
      "<tr><td style=\"padding:10px 0;color:#888;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;\">Budget</td><td style=\"padding:10px 0;color:#111;font-size:15px;\">" +
        escape(d.budgetRange) +
        "</td></tr>"
    );
  }

  const messageBlock =
    "<tr><td colspan=\"2\" style=\"padding:24px 0 10px;color:#888;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-top:1px solid #eee;\">Message</td></tr>" +
    "<tr><td colspan=\"2\" style=\"padding:8px 0 24px;color:#111;font-size:15px;line-height:1.6;white-space:pre-wrap;\">" +
    escape(d.message) +
    "</td></tr>";

  const adminLink =
    "<tr><td colspan=\"2\" style=\"padding:24px 0 0;border-top:1px solid #eee;\">" +
    "<a href=\"https://joseph-portfolio-kohl.vercel.app/admin/messages\" style=\"display:inline-block;background:#E87A2D;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;font-size:14px;\">View in Admin</a>" +
    "</td></tr>";

  return (
    "<!DOCTYPE html><html><body style=\"margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;\">" +
    "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f5f5f5;padding:32px 16px;\">" +
    "<tr><td align=\"center\">" +
    "<table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#ffffff;border-radius:16px;padding:40px;max-width:600px;\">" +
    "<tr><td style=\"padding-bottom:24px;border-bottom:1px solid #eee;\">" +
    "<p style=\"margin:0;color:#E87A2D;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;\">New Inquiry</p>" +
    "<h1 style=\"margin:8px 0 0;color:#111;font-size:24px;font-weight:700;\">Someone wants to work with you</h1>" +
    "</td></tr>" +
    "<tr><td style=\"padding-top:24px;\">" +
    "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" +
    rows.join("") +
    messageBlock +
    adminLink +
    "</table>" +
    "</td></tr>" +
    "</table>" +
    "<p style=\"margin:24px 0 0;color:#999;font-size:12px;text-align:center;\">Sent from joseph-portfolio-kohl.vercel.app</p>" +
    "</td></tr></table>" +
    "</body></html>"
  );
}

function escape(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}