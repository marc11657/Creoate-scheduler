import nodemailer from "nodemailer";

const TIMEZONE = process.env.NEXT_PUBLIC_OWNER_TIMEZONE || "Europe/London";
const OWNER_NAME = process.env.NEXT_PUBLIC_OWNER_NAME || "Marc";

interface EmailDetails {
  to: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  summary: string;
  meetLink?: string;
  message?: string;
}

function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
}

function buildIcsContent(details: EmailDetails): string {
  const start = details.startTime.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const end = details.endTime.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Creoate//Interview Scheduler//EN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${details.summary}`,
    `DESCRIPTION:Interview with ${OWNER_NAME}\\nScheduled via Creoate Interview Scheduler`,
    details.meetLink ? `LOCATION:${details.meetLink}` : "",
    `ORGANIZER;CN=${OWNER_NAME}:mailto:${process.env.SMTP_FROM || process.env.SMTP_USER}`,
    `ATTENDEE;CN=${details.name}:mailto:${details.to}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export async function sendBookingConfirmation(details: EmailDetails): Promise<void> {
  if (!isEmailConfigured()) {
    console.log("SMTP not configured — skipping confirmation email");
    return;
  }

  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const formattedStart = formatDateTime(details.startTime);

  const meetSection = details.meetLink
    ? `<tr>
        <td style="padding:8px 0;color:#6b7280;width:120px">Google Meet</td>
        <td style="padding:8px 0"><a href="${details.meetLink}" style="color:#6366f1;text-decoration:none;font-weight:600">${details.meetLink}</a></td>
      </tr>`
    : "";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto">
      <div style="background:#6366f1;padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">Interview Confirmed</h1>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <p style="color:#374151;font-size:16px;line-height:1.6;margin-top:0">
          Hi ${details.name},
        </p>
        <p style="color:#374151;font-size:16px;line-height:1.6">
          Your interview with <strong>${OWNER_NAME}</strong> has been confirmed.
        </p>
        <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:24px 0">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:8px 0;color:#6b7280;width:120px">When</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${formattedStart}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280">Duration</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">45 minutes</td>
            </tr>
            ${meetSection}
          </table>
        </div>
        ${details.message ? `<p style="color:#6b7280;font-size:14px;font-style:italic">Message: "${details.message}"</p>` : ""}
        <p style="color:#9ca3af;font-size:13px;margin-bottom:0;margin-top:32px;text-align:center">
          Scheduled via Creoate Interview Scheduler
        </p>
      </div>
    </div>
  `;

  const icsContent = buildIcsContent(details);

  await transporter.sendMail({
    from: `"${OWNER_NAME} via Creoate" <${from}>`,
    to: details.to,
    subject: `Interview Confirmed: ${details.summary}`,
    html,
    icalEvent: {
      method: "REQUEST",
      content: icsContent,
    },
  });
}
