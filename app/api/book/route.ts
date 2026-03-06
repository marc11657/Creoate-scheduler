import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/google-calendar";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { startTime, endTime, name, email, message } = body;

  if (!startTime || !endTime || !name || !email) {
    return NextResponse.json(
      { error: "Missing required fields: startTime, endTime, name, email." },
      { status: 400 }
    );
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 }
    );
  }

  try {
    const result = await createBooking({
      startTime,
      endTime,
      name,
      email,
      message: message || undefined,
    });

    // Send confirmation email (non-blocking — don't fail the booking if email fails)
    sendBookingConfirmation({
      to: email,
      name,
      date: startTime.split("T")[0],
      startTime,
      endTime,
      summary: result.summary,
      meetLink: result.meetLink,
      message: message || undefined,
    }).catch((err) => console.error("Failed to send confirmation email:", err));

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating booking:", message, error);
    return NextResponse.json(
      { error: `Failed to create booking: ${message}` },
      { status: 500 }
    );
  }
}
