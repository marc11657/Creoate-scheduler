import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const diagnostics: Record<string, unknown> = {};

  // 1. Check env vars are set
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  diagnostics.envVars = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: email ? `${email.slice(0, 10)}...` : "MISSING",
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: rawKey
      ? `starts="${rawKey.slice(0, 30)}..." length=${rawKey.length}`
      : "MISSING",
    GOOGLE_CALENDAR_ID: calendarId || "MISSING",
  };

  // 2. Check private key format
  const key = rawKey?.replace(/\\n/g, "\n");
  diagnostics.keyFormat = {
    hasBeginMarker: key?.includes("-----BEGIN PRIVATE KEY-----") ?? false,
    hasEndMarker: key?.includes("-----END PRIVATE KEY-----") ?? false,
    containsRealNewlines: key?.includes("\n") ?? false,
    lineCount: key?.split("\n").length ?? 0,
  };

  if (!email || !rawKey || !calendarId) {
    return NextResponse.json({ diagnostics, error: "Missing env vars" });
  }

  // 3. Try to authenticate
  try {
    const auth = new google.auth.JWT({
      email,
      key,
      scopes: [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.freebusy",
      ],
    });

    await auth.authorize();
    diagnostics.auth = "SUCCESS";
  } catch (err) {
    diagnostics.auth = `FAILED: ${err instanceof Error ? err.message : String(err)}`;
    return NextResponse.json({ diagnostics });
  }

  // 4. Try free/busy query
  try {
    const auth = new google.auth.JWT({
      email,
      key,
      scopes: [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.freebusy",
      ],
    });
    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: tomorrow.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    diagnostics.freeBusy = {
      calendars: res.data.calendars,
    };
  } catch (err) {
    diagnostics.freeBusy = `FAILED: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({ diagnostics });
}
