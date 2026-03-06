"use client";

import { useState, useCallback } from "react";
import CalendarPicker from "./CalendarPicker";
import TimeSlots from "./TimeSlots";
import BookingForm from "./BookingForm";
import Confirmation from "./Confirmation";
import { TimeSlot } from "@/lib/google-calendar";

type SchedulerState = "selecting" | "form" | "confirmed";

interface BookingResult {
  name: string;
  email: string;
  date: string;
  time: string;
  demo?: boolean;
}

export default function Scheduler() {
  const [state, setState] = useState<SchedulerState>("selecting");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const fetchSlots = useCallback(async (date: string) => {
    setLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const res = await fetch(`/api/availability?date=${date}`);
      const data = await res.json();
      if (data.slots) {
        setSlots(data.slots);
      }
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setState("selecting");
    fetchSlots(date);
  }

  function handleSlotSelect(slot: TimeSlot) {
    setSelectedSlot(slot);
    setState("form");
  }

  async function handleBook(data: { name: string; email: string; message?: string }) {
    if (!selectedSlot || !selectedDate) return;

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        name: data.name,
        email: data.email,
        message: data.message,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Booking failed");
    }

    setBookingResult({
      name: data.name,
      email: data.email,
      date: selectedDate,
      time: selectedSlot.display,
      demo: result.demo,
    });
    setState("confirmed");
  }

  function handleReset() {
    setState("selecting");
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setBookingResult(null);
  }

  if (state === "confirmed" && bookingResult) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Confirmation
          name={bookingResult.name}
          email={bookingResult.email}
          date={bookingResult.date}
          time={bookingResult.time}
          demo={bookingResult.demo}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
      <CalendarPicker
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
      />

      {selectedDate && (
        <TimeSlots
          slots={slots}
          loading={loading}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSlotSelect}
        />
      )}

      {state === "form" && selectedSlot && selectedDate && (
        <div className="pt-4 border-t border-gray-100">
          <BookingForm
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onBook={handleBook}
            onBack={() => {
              setSelectedSlot(null);
              setState("selecting");
            }}
          />
        </div>
      )}
    </div>
  );
}
