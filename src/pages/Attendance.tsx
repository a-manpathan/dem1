import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

// Dummy data for staff attendance
const staffMembers = [
  { id: 1, name: 'Mary Thomas', color: 'blue' },
  { id: 2, name: 'Jeffrey Anderson', color: 'orange' },
  { id: 3, name: 'Sarah Johnson', color: 'green' },
  { id: 4, name: 'Michael Brown', color: 'purple' },
  { id: 5, name: 'Emma Wilson', color: 'red' }
];

// Dummy attendance data
const initialAttendanceData = [
  { day: 1, staffId: 1 }, // Mary Thomas on 1st
  { day: 1, staffId: 2 }, // Jeffrey Anderson on 1st
  { day: 11, staffId: 1 }, // Mary Thomas on 11th
  { day: 13, staffId: 1 }, // Mary Thomas on 13th
  { day: 17, staffId: 1 }, // Mary Thomas on 17th
  { day: 17, staffId: 3 }, // Sarah Johnson on 17th
  { day: 17, staffId: 4 }, // Michael Brown on 17th
  { day: 17, staffId: 5 }, // Emma Wilson on 17th
  { day: 29, staffId: 1 }, // Mary Thomas on 29th
  { day: 2, staffId: 1 } // Mary Thomas on 2nd (next month)
];

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState(initialAttendanceData);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Get previous month's days to fill in the calendar
  const prevMonthDays = getDaysInMonth(year, month - 1);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`;
  };

  // Handle previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Handle next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter attendance data based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredAttendanceData(attendanceData);
      return;
    }

    const filteredStaffIds = staffMembers
      .filter(staff => staff.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(staff => staff.id);

    const filtered = attendanceData.filter(item => 
      filteredStaffIds.includes(item.staffId)
    );
    
    setFilteredAttendanceData(filtered);
  }, [searchQuery, attendanceData]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows x 7 columns
    
    // Previous month days
    for (let i = 0; i < adjustedFirstDay; i++) {
      const day = prevMonthDays - adjustedFirstDay + i + 1;
      days.push({ day, currentMonth: false, nextMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, nextMonth: false });
    }
    
    // Next month days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, currentMonth: false, nextMonth: true });
    }
    
    return days;
  };

  // Get day of week names
  const getDayNames = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentMonthStart = new Date(year, month, 1);
    const dayOfWeek = currentMonthStart.getDay() || 7; // Convert Sunday (0) to 7
    
    // Get the date for the Monday of the week containing the 1st
    const mondayDate = new Date(currentMonthStart);
    mondayDate.setDate(1 - dayOfWeek + 1);
    
    return days.map((day, index) => {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + index);
      return {
        name: day,
        date: date.getDate(),
        fullName: `${date.getDate()} ${day}`
      };
    });
  };

  // Get staff for a specific day
  const getStaffForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    
    return filteredAttendanceData
      .filter(item => item.day === day)
      .map(item => {
        const staff = staffMembers.find(s => s.id === item.staffId);
        return staff;
      })
      .filter(Boolean);
  };

  const calendarDays = generateCalendarDays();
  const dayNames = getDayNames();

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-48 bg-background border-r border-border">
        <div className="py-2">
          <Link to="/staff" className="block py-3 px-4 text-foreground hover:bg-muted">
            Staff Directory
          </Link>
          <Link to="/shift-management" className="block py-3 px-4 text-foreground hover:bg-muted">
            Shift Management
          </Link>
          <div className="py-3 px-4 bg-blue-50 border-l-4 border-blue-500 text-blue-600 font-medium">
            Attendance
          </div>
          <Link to="/leave-management" className="block py-3 px-4 text-foreground hover:bg-muted">
            Leave Management
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Attendance</h1>
          
          {/* Search and Date Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by Name/ Department" 
                className="pl-10 h-10 border-gray-300 rounded-md" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
              
              <div className="text-sm font-medium px-4 py-2 border border-gray-300 rounded-md">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
              
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {dayNames.map((day, index) => (
                <div key={index} className="p-2 text-center border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium">{day.date} {day.name}</div>
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 grid-rows-6">
              {calendarDays.map((day, index) => {
                const staffForDay = getStaffForDay(day.day, day.currentMonth);
                const hasMoreStaff = staffForDay.length > 3;
                const displayedStaff = hasMoreStaff ? staffForDay.slice(0, 3) : staffForDay;
                
                return (
                  <div 
                    key={index} 
                    className={`min-h-24 p-2 border-r border-b border-gray-200 last:border-r-0 ${
                      !day.currentMonth ? 'bg-gray-50 text-gray-400' : ''
                    }`}
                  >
                    <div className="text-sm font-medium mb-2">{day.day}</div>
                    
                    {/* Staff attendance */}
                    <div className="space-y-1">
                      {displayedStaff.map((staff, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div 
                            className={`w-2 h-2 rounded-full mr-1 bg-${staff?.color}-500`}
                          ></div>
                          <span>{staff?.name}</span>
                        </div>
                      ))}
                      
                      {hasMoreStaff && (
                        <div className="text-xs text-gray-500 mt-1">
                          {staffForDay.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;