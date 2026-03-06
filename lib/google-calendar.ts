import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];

const TIMEZONE = process.env.NEXT_PUBLIC_OWNER_TIMEZONE || "Europe/London";
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
const OWNER_NAME = process.env.NEXT_PUBLIC_OWNER_NAME || "Marc";

function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.GOOGLE_CALENDAR_ID
  );
}

function parsePrivateKey(raw: string): string {
  // Handle all common env var formats:
  // 1. Literal \n (from .env files): replace with real newlines
  // 2. Already has real newlines: leave as-is
  // 3. Wrapped in extra quotes: strip them
  let key = raw.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");

  // If the key still doesn't have proper PEM line breaks, try to reconstruct
  if (!key.includes("\n")) {
    // The key is one long string — split into PEM format
    const base64 = key
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\s/g, "");
    const lines = base64.match(/.{1,64}/g) || [];
    key = [
      "-----BEGIN PRIVATE KEY-----",
      ...lines,
      "-----END PRIVATE KEY-----",
      "",
    ].join("\n");
  }

  return key;
}

function getCalendarClient() {
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!rawKey) throw new Error("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set");

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: parsePrivateKey(rawKey),
    scopes: SCOPES,
  });
  return google.calendar({ version: "v3", auth });
}

export interface TimeSlot {
  start: string;
  end: string;
  display: string;
}

function generateBusinessHourSlots(dateStr: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minute of [0, 30]) {
      const start = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
      const end = new Date(start.getTime() + 30 * 60 * 1000);

      const display = start.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: TIMEZONE,
      });

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        display,
      });
    }
  }
  return slots;
}

function generateDemoSlots(dateStr: string): TimeSlot[] {
  const allSlots = generateBusinessHourSlots(dateStr);
  // Remove some slots randomly to simulate real availability
  const seed = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0);
  return allSlots.filter((_, i) => (i + seed) % 3 !== 0);
}

function isOverlapping(
  slotStart: Date,
  slotEnd: Date,
  busyStart: Date,
  busyEnd: Date
): boolean {
  return slotStart < busyEnd && slotEnd > busyStart;
}

export async function getAvailableSlots(dateStr: string): Promise<TimeSlot[]> {
  if (!isConfigured()) {
    return generateDemoSlots(dateStr);
  }

  const calendar = getCalendarClient();
  const allSlots = generateBusinessHourSlots(dateStr);

  // Use the configured timezone for the query window, not UTC
  const timeMin = `${dateStr}T00:00:00`;
  const nextDay = new Date(`${dateStr}T12:00:00Z`);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split("T")[0];
  const timeMax = `${nextDayStr}T00:00:00`;

  const freeBusyResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: TIMEZONE,
      items: [{ id: CALENDAR_ID }],
    },
  });

  const calendarData = freeBusyResponse.data.calendars?.[CALENDAR_ID];

  // Check for calendar-level errors (e.g. "notFound", no access)
  if (calendarData?.errors && calendarData.errors.length > 0) {
    const reasons = calendarData.errors.map((e) => e.reason).join(", ");
    console.error(`Google Calendar errors for ${CALENDAR_ID}: ${reasons}`);
    throw new Error(`Calendar access error: ${reasons}. Ensure the calendar is shared with the service account.`);
  }

  const busySlots = calendarData?.busy || [];

  return allSlots.filter((slot) => {
    const slotStart = new Date(slot.start);
    const slotEnd = new Date(slot.end);
    return !busySlots.some((busy) =>
      isOverlapping(
        slotStart,
        slotEnd,
        new Date(busy.start!),
        new Date(busy.end!)
      )
    );
  });
}

export interface BookingDetails {
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  message?: string;
}

export interface BookingResult {
  success: boolean;
  eventId?: string;
  summary: string;
  start: string;
  end: string;
  attendeeEmail: string;
  demo?: boolean;
}

export async function createBooking(
  details: BookingDetails
): Promise<BookingResult> {
  const summary = `Interview with ${details.name} — Creoate`;
  const description = [
    `Scheduled via Creoate Interview Scheduler`,
    ``,
    `Candidate: ${OWNER_NAME}`,
    `Interviewer: ${details.name} (${details.email})`,
    details.message ? `\nMessage: ${details.message}` : "",
  ].join("\n");

  if (!isConfigured()) {
    return {
      success: true,
      eventId: `demo-${Date.now()}`,
      summary,
      start: details.startTime,
      end: details.endTime,
      attendeeEmail: details.email,
      demo: true,
    };
  }

  const calendar = getCalendarClient();

  const event = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary,
      description,
      start: {
        dateTime: details.startTime,
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: details.endTime,
        timeZone: TIMEZONE,
      },
      attendees: [{ email: details.email }],
      reminders: {
        useDefault: true,
      },
    },
    sendUpdates: "all",
  });

  return {
    success: true,
    eventId: event.data.id || undefined,
    summary,
    start: details.startTime,
    end: details.endTime,
    attendeeEmail: details.email,
  };
}
