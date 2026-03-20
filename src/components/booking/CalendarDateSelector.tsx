import React, { useState, useEffect } from 'react';

interface CalendarDateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  disabled?: boolean;
}

const CalendarDateSelector: React.FC<CalendarDateSelectorProps> = ({
  selectedDate,
  onDateSelect,
  disabled
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate available dates for the next 60 days
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    setAvailableDates(dates);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDate = new Date(firstDayOfMonth);

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Add empty cells for days before the first day of the month
    startDate.setDate(startDate.getDate() - firstDayWeekday);

    const days: (Date | null)[] = [];

    // Add empty cells for previous month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Add all days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate =>
      availableDate.getTime() === date.getTime()
    );
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return selectedDate.getTime() === date.getTime();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      if (direction === 'prev') {
        newMonth.setMonth(prevMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(prevMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="w-full">
      <h3 className="text-lg font-serif text-secondary-900 mb-4">Select Date</h3>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          disabled={disabled}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <h4 className="text-lg font-semibold text-secondary-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>

        <button
          onClick={() => navigateMonth('next')}
          disabled={disabled}
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-secondary-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-10"></div>;
          }

          const available = isDateAvailable(day);
          const selected = isDateSelected(day);
          const today = isToday(day);

          return (
            <button
              key={index}
              onClick={() => available ? onDateSelect(day) : null}
              disabled={disabled || !available}
              className={`
                h-10 w-10 rounded-lg text-sm transition-all duration-200 mx-auto
                ${selected
                  ? 'bg-secondary-600 text-white shadow-md'
                  : available
                    ? today
                      ? 'bg-secondary-100 text-secondary-900 border-2 border-secondary-500 hover:bg-secondary-200'
                      : 'text-secondary-700 hover:bg-secondary-50 hover:border hover:border-secondary-300'
                    : 'text-gray-400 cursor-not-allowed'
                }
                ${available && !disabled ? 'hover:scale-105' : ''}
              `}
            >
              {day.getDate()}
              {today && available && (
                <div className="text-xs absolute mt-6 ml-1">
                  <span className="bg-accent-500 text-white px-1 rounded text-xs">•</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 24-hour notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">24-Hour Advance Booking Required</p>
            <p className="text-xs text-yellow-700 mt-1">
              Bookings must be made at least 24 hours in advance
            </p>
          </div>
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-primary-100 rounded-lg">
          <p className="text-sm text-secondary-700">
            Selected: <span className="font-semibold text-secondary-900">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarDateSelector;