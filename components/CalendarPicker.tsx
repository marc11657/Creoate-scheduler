"use client";

interface CalendarPickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function CalendarPicker({ selectedDate, onSelectDate }: CalendarPickerProps) {
  const days: { date: string; dayName: string; dayNum: number; monthShort: string; isWeekend: boolean; isToday: boolean }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-GB", { weekday: "short" });
    const dayNum = d.getDate();
    const monthShort = d.toLocaleDateString("en-GB", { month: "short" });
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = i === 0;

    days.push({ date: dateStr, dayName, dayNum, monthShort, isWeekend, isToday });
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
        Select a date
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isSelected = selectedDate === day.date;
          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`
                relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200
                ${isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent bg-white hover:border-primary/30 hover:shadow-sm"
                }
                ${day.isWeekend ? "opacity-60" : ""}
              `}
            >
              <span className={`text-[10px] uppercase font-medium ${isSelected ? "text-primary" : "text-gray-400"}`}>
                {day.dayName}
              </span>
              <span className={`text-lg font-semibold mt-0.5 ${isSelected ? "text-primary" : "text-gray-800"}`}>
                {day.dayNum}
              </span>
              <span className={`text-[10px] ${isSelected ? "text-primary/70" : "text-gray-400"}`}>
                {day.monthShort}
              </span>
              {day.isToday && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
