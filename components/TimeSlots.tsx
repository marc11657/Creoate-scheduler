"use client";

import { TimeSlot } from "@/lib/google-calendar";

interface TimeSlotsProps {
  slots: TimeSlot[];
  loading: boolean;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export default function TimeSlots({ slots, loading, selectedSlot, onSelectSlot }: TimeSlotsProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-gray-500 mt-3">Checking availability...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-gray-500 font-medium">No available slots on this day</p>
        <p className="text-sm text-gray-400 mt-1">Try selecting a different date</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
        Available times
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.start === slot.start;
          return (
            <button
              key={slot.start}
              onClick={() => onSelectSlot(slot)}
              className={`
                py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 border-2
                ${isSelected
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-gray-700 border-gray-100 hover:border-primary/40 hover:text-primary"
                }
              `}
            >
              {slot.display}
            </button>
          );
        })}
      </div>
    </div>
  );
}
