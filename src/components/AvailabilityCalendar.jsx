import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function AvailabilityCalendar({ availability = [], onChange }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const availSet = new Set(availability);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const toggleDay = (dateStr) => {
    const next = new Set(availSet);
    if (next.has(dateStr)) next.delete(dateStr);
    else next.add(dateStr);
    onChange(Array.from(next).sort());
  };

  const toggleMonth = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const monthDates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      monthDates.push(toDateStr(viewYear, viewMonth, d));
    }
    const allAvailable = monthDates.every(d => availSet.has(d));
    const next = new Set(availSet);
    if (allAvailable) {
      monthDates.forEach(d => next.delete(d));
    } else {
      monthDates.forEach(d => next.add(d));
    }
    onChange(Array.from(next).sort());
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isPast = (d) => toDateStr(viewYear, viewMonth, d) < todayStr;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <div className="text-center">
          <p className="font-semibold text-gray-900">{monthNames[viewMonth]} {viewYear}</p>
          <button
            onClick={toggleMonth}
            className="text-xs text-blue-600 hover:underline mt-0.5"
          >
            Toggle all days
          </button>
        </div>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isAvail = availSet.has(dateStr);
          const past = isPast(day);

          return (
            <button
              key={dateStr}
              onClick={() => !past && toggleDay(dateStr)}
              disabled={past}
              className={`
                aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all
                ${past
                  ? 'text-gray-300 cursor-not-allowed'
                  : isAvail
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
                ${dateStr === todayStr ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-gray-200" />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <span>Past</span>
        </div>
      </div>
    </div>
  );
}
