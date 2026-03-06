"use client";

import { useState } from "react";
import { TimeSlot } from "@/lib/google-calendar";

interface BookingFormProps {
  selectedDate: string;
  selectedSlot: TimeSlot;
  onBook: (data: { name: string; email: string; message?: string }) => Promise<void>;
  onBack: () => void;
}

export default function BookingForm({ selectedDate, selectedSlot, onBook, onBack }: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await onBook({ name: name.trim(), email: email.trim(), message: message.trim() || undefined });
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Selected slot summary */}
      <div className="bg-primary/5 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Your selected time</p>
          <p className="font-semibold text-gray-800">
            {formattedDate} at {selectedSlot.display}
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-primary hover:underline font-medium"
        >
          Change
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah from Creoate"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@creoate.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-400"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Anything I should prepare?"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-800 placeholder:text-gray-400 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-primary text-white rounded-lg font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </button>
      </form>
    </div>
  );
}
