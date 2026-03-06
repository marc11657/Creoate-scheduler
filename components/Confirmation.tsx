"use client";

interface ConfirmationProps {
  name: string;
  email: string;
  date: string;
  time: string;
  demo?: boolean;
  onReset: () => void;
}

export default function Confirmation({ name, email, date, time, demo, onReset }: ConfirmationProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="text-center animate-fadeIn">
      {/* Checkmark */}
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scaleIn">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re booked!</h2>
      <p className="text-gray-500 mb-8">
        Looking forward to connecting with you, {name}.
      </p>

      {/* Details card */}
      <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Date</span>
          <span className="text-sm font-medium text-gray-800">{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Time</span>
          <span className="text-sm font-medium text-gray-800">{time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Invite sent to</span>
          <span className="text-sm font-medium text-gray-800">{email}</span>
        </div>
      </div>

      {demo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-xs text-amber-700">
            <strong>Demo mode:</strong> No real calendar event was created. Connect Google Calendar credentials to enable live bookings.
          </p>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-6">
        A calendar invitation has been sent to your email.
      </p>

      <button
        onClick={onReset}
        className="text-sm text-primary hover:underline font-medium"
      >
        Book another time
      </button>
    </div>
  );
}
