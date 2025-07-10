import React, { useState } from 'react';
// Removed Dialog and DialogContent as they will be handled by Popover
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI Button component is available
import { ChevronLeft, ChevronRight } from "lucide-react"; // For the navigation arrows
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Shadcn UI Popover components
import { CalendarIcon } from "lucide-react"; // For the calendar icon in the trigger
import { format } from "date-fns"; // For formatting the date in the trigger

// Helper function to get the number of days in a month
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

// Helper function to get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

interface CalendarViewProps {
  month: number; // 0-indexed (0 for Jan, 11 for Dec)
  year: number;
  selectedDate?: number | null; // The day of the month that is selected
  onSelectDate: (date: number | null) => void;
  // Optional: For navigating months if needed, though for this specific replica, we'll keep it static
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  month,
  year,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // Day of the week for the 1st of the month
  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'short' });

  // Create an array of dates, including leading empty slots for alignment
  const dates = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  // Hardcoded "disabled" dates for visual replication based on the image
  // In a real application, these would be determined dynamically (e.g., from API)
  const isDateDisabled = (date: number | null, currentMonth: number): boolean => {
    if (date === null) return false;

    if (currentMonth === 0) { // January (0-indexed)
      return [4, 5, 11, 23, 24, 25, 26, 29, 30].includes(date);
    } else if (currentMonth === 3) { // April (3-indexed)
      return [4, 5, 11, 23, 24, 25, 26, 29, 30].includes(date);
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg">
      {/* Month Navigation */}
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <ChevronLeft
          className={`h-5 w-5 text-gray-500 ${onPrevMonth ? 'cursor-pointer hover:text-gray-700' : 'opacity-50 cursor-not-allowed'}`}
          onClick={onPrevMonth}
        />
        <span className="font-semibold text-gray-800 text-lg">
          {monthName}, {year}
        </span>
        <ChevronRight
          className={`h-5 w-5 text-gray-500 ${onNextMonth ? 'cursor-pointer hover:text-gray-700' : 'opacity-50 cursor-not-allowed'}`}
          onClick={onNextMonth}
        />
      </div>

      {/* Days of the week header */}
      <div className="grid grid-cols-7 gap-1 w-full text-center text-sm font-medium text-gray-500 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-7 gap-1 w-full text-center text-sm">
        {dates.map((date, index) => {
          const isDisabled = isDateDisabled(date, month);
          const isCurrentSelected = date === selectedDate;

          return (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center rounded-full
                ${date === null ? 'invisible' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                ${isCurrentSelected && !isDisabled ? 'bg-blue-600 text-white' : ''}
                ${!isCurrentSelected && !isDisabled ? 'hover:bg-blue-50 text-gray-800' : ''}
              `}
              onClick={() => !isDisabled && onSelectDate(date)}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Renamed and refactored to be Popover Content
interface DateRangePickerPopoverContentProps {
  onSave: (janDate: number | null, aprDate: number | null) => void;
  onClosePopover: () => void; // Callback to close the popover
}

const DateRangePickerPopoverContent: React.FC<DateRangePickerPopoverContentProps> = ({
  onSave,
  onClosePopover,
}) => {
  // State for selected dates in each calendar
  const [selectedJanDate, setSelectedJanDate] = useState<number | null>(22); // Default to 22 as in image
  const [selectedAprDate, setSelectedAprDate] = useState<number | null>(22); // Default to 22 as in image

  const handleSave = () => {
    onSave(selectedJanDate, selectedAprDate);
    onClosePopover(); // Close the popover after saving
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-xl border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-around items-start md:items-center gap-6">
        {/* January Calendar */}
        <CalendarView
          month={0} // January (0-indexed)
          year={2025}
          selectedDate={selectedJanDate}
          onSelectDate={setSelectedJanDate}
          // For this replica, we don't enable month navigation to match the static image
          onPrevMonth={() => {}}
          onNextMonth={() => {}}
        />

        {/* April Calendar */}
        <CalendarView
          month={3} // April (3-indexed)
          year={2025}
          selectedDate={selectedAprDate}
          onSelectDate={setSelectedAprDate}
          // For this replica, we don't enable month navigation to match the static image
          onPrevMonth={() => {}}
          onNextMonth={() => {}}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <Button
          className="px-8 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default DateRangePickerPopoverContent;