import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Missing 'date' query parameter" },
      { status: 400 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const requestedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (requestedDate < today) {
    return NextResponse.json(
      { error: "Cannot query past dates." },
      { status: 400 }
    );
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 21);
  if (requestedDate > maxDate) {
    return NextResponse.json(
      { error: "Cannot query more than 21 days ahead." },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date);
    return NextResponse.json({ date, slots, demo: !process.env.GOOGLE_CALENDAR_ID });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching availability:", message, error);
    return NextResponse.json(
      { error: `Failed to fetch availability: ${message}` },
      { status: 500 }
    );
  }
}
