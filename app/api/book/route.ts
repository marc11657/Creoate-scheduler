import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/google-calendar";

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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking." },
      { status: 500 }
    );
  }
}
