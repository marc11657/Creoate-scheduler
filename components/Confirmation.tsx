"use client";

interface ConfirmationProps {
  name: string;
  email: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  meetLink?: string;
  summary: string;
  demo?: boolean;
  onReset: () => void;
}

function buildGoogleCalendarUrl(props: ConfirmationProps): string {
  const start = props.startTime.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const end = props.endTime.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: props.summary,
    dates: `${start}/${end}`,
    details: `Interview scheduled via Creoate\n\nCandidate: Marc\nInterviewer: ${props.name} (${props.email})`,
  });
  if (props.meetLink) {
    params.set("location", props.meetLink);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(props: ConfirmationProps): string {
  const start = props.startTime.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const end = props.endTime.replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${props.summary}`,
    `DESCRIPTION:Interview scheduled via Creoate`,
    props.meetLink ? `LOCATION:${props.meetLink}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

function downloadIcs(props: ConfirmationProps) {
  const content = buildIcsContent(props);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "interview.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Confirmation(props: ConfirmationProps) {
  const { name, email, date, time, meetLink, demo, onReset } = props;

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
          <span className="text-sm font-medium text-gray-800">{time} (45 min)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm font-medium text-gray-800">{email}</span>
        </div>
        {meetLink && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Google Meet</span>
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Join meeting
            </a>
          </div>
        )}
      </div>

      {demo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-xs text-amber-700">
            <strong>Demo mode:</strong> No real calendar event was created. Connect Google Calendar credentials to enable live bookings.
          </p>
        </div>
      )}

      {/* Add to calendar buttons */}
      {!demo && (
        <div className="flex gap-3 justify-center mb-6">
          <a
            href={buildGoogleCalendarUrl(props)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
            </svg>
            Add to Google Calendar
          </a>
          <button
            onClick={() => downloadIcs(props)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Download .ics
          </button>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-6">
        Add this event to your calendar using the buttons above.
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
