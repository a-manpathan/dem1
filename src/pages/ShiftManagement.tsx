import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import doctorImage from '@/assets/doctor.jpg';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ShiftManagement = () => {
  const [department, setDepartment] = useState('All Departments');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('12: 00 to 15: 00');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [days, setDays] = useState([]);
  const [editShiftOpen, setEditShiftOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  
  // Sample data for doctors
  const doctors = [
    { id: 1, name: 'Dr. Abhinand Choudry', hours: '38h 30m', shifts: 4, assigned: true },
    { id: 2, name: 'Dr. Sarah Johnson', hours: '32h 15m', shifts: 3, assigned: true },
    { id: 3, name: 'Dr. Michael Chen', hours: '40h 00m', shifts: 0, assigned: false },
    { id: 4, name: 'Dr. Emily Rodriguez', hours: '35h 45m', shifts: 4, assigned: true },
    { id: 5, name: 'Dr. James Wilson', hours: '28h 30m', shifts: 2, assigned: true },
  ];
  
  // Sample data for shifts - update to include actual dates
  const initialShifts = [
    { id: 's1', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's2', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's3', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's4', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's5', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's6', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's7', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's8', doctor: 'Dr. Abhinand Choudry', time: '12:00 to 15:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's9', doctor: 'Dr. Ajay Vs', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's10', doctor: 'Dr. Ajay Vs', time: '12:00 to 15:00', room: 'Room 203', date: new Date().toISOString() },
    { id: 's11', doctor: 'Dr. Karthika Viswanathan', time: '09:00 to 12:00', room: 'Room 203', date: new Date().toISOString() },
  ];
  
  const [shifts, setShifts] = useState(initialShifts);
  
  // Available time slots
  const timeSlots = [
    '09:00 to 12:00',
    '12:00 to 15:00',
    '15:00 to 18:00',
    '18:00 to 21:00'
  ];

  // Available rooms
  const rooms = [
    'Room 201',
    'Room 202',
    'Room 203',
    'Room 204',
    'Room 205'
  ];

  // Generate days of the week based on current week
  useEffect(() => {
    const generateDaysOfWeek = () => {
      const startOfWeek = new Date(currentWeek);
      // Adjust to start from Monday
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const weekDays = [];
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        weekDays.push({
          day: dayNames[i],
          date: date.getDate(),
          fullDate: `${date.getDate()} ${dayNames[i]}`,
          month: date.toLocaleString('default', { month: 'short' }),
          year: date.getFullYear(),
          dateObj: new Date(date)
        });
      }
      
      return weekDays;
    };
    
    setDays(generateDaysOfWeek());
  }, [currentWeek]);

  // Format the current week for display
  const formatWeekDisplay = () => {
    if (days.length === 0) return '';
    
    const startDay = days[0];
    const endDay = days[6];
    
    return `${startDay.date} ${startDay.month} - ${endDay.date} ${endDay.month}, ${startDay.year}`;
  };

  // Handle previous week
  const handlePrevWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  // Handle next week
  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Handle current week
  const handleCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Initialize shifts with proper dates
  useEffect(() => {
    if (days.length > 0) {
      // Assign each shift to a day in the current week
      const updatedShifts = initialShifts.map((shift, index) => {
        // Distribute shifts across the week
        const dayIndex = index % 7;
        return {
          ...shift,
          date: days[dayIndex].dateObj.toISOString()
        };
      });
      setShifts(updatedShifts);
    }
  }, [days]);

  // Handle drag end - update to work with dates
  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    const dayIndex = parseInt(destination.droppableId);
    
    if (dayIndex >= 0 && dayIndex < days.length) {
      // Update the shift with the new date
      const updatedShifts = shifts.map(shift => {
        if (shift.id === result.draggableId) {
          return { 
            ...shift, 
            date: days[dayIndex].dateObj.toISOString() 
          };
        }
        return shift;
      });
      
      setShifts(updatedShifts);
    }
  };

  // Handle click on empty space in calendar
  const handleCalendarCellClick = (dayIndex) => {
    if (days[dayIndex]) {
      const selectedDay = days[dayIndex];
      setSelectedDay(`${selectedDay.date} ${selectedDay.day}, ${selectedDay.month} ${selectedDay.year}`);
      setSelectedDate(selectedDay.dateObj);
      setAddShiftOpen(true);
    }
  };

  // Handle adding a new shift - update to work with dates
  const handleAddShift = () => {
    if (!selectedDoctor || !selectedRoom || !selectedDate) {
      return;
    }
    
    // Generate a new unique ID
    const newId = `s${Date.now()}`;
    
    // Create a new shift with the selected date
    const newShift = {
      id: newId,
      doctor: selectedDoctor,
      time: selectedTimeSlot,
      room: selectedRoom,
      date: selectedDate.toISOString()
    };
    
    // Add the new shift to the shifts array
    setShifts([...shifts, newShift]);
    
    // Reset form fields
    setSelectedDoctor('');
    setSelectedRoom('');
    
    // Close the dialog
    setAddShiftOpen(false);
  };

  // Reset form when dialog closes
  const handleDialogClose = (open) => {
    if (!open) {
      setSelectedDoctor('');
      setSelectedRoom('');
    }
    setAddShiftOpen(open);
  };

  // Add this function to handle clicking on an existing shift
  const handleShiftClick = (e, shift) => {
    e.stopPropagation(); // Prevent the cell click handler from firing
    
    // Set the selected shift
    setSelectedShift(shift);
    
    // Set the form values to the selected shift's values
    setSelectedTimeSlot(shift.time);
    setSelectedDoctor(shift.doctor);
    setSelectedRoom(shift.room);
    
    // Find the day that corresponds to this shift's date
    const shiftDate = new Date(shift.date);
    const day = days.find(d => d.dateObj.toDateString() === shiftDate.toDateString());
    if (day) {
      setSelectedDay(`${day.date} ${day.day}, ${day.month} ${day.year}`);
      setSelectedDate(day.dateObj);
    }
    
    // Close the add shift dialog if it's open
    setAddShiftOpen(false);
    
    // Open the edit shift dialog
    setEditShiftOpen(true);
  };

  // Add this function to handle updating a shift
  const handleUpdateShift = () => {
    if (!selectedDoctor || !selectedRoom || !selectedShift) {
      return;
    }
    
    // Update the selected shift
    const updatedShifts = shifts.map(shift => {
      if (shift.id === selectedShift.id) {
        return {
          ...shift,
          doctor: selectedDoctor,
          time: selectedTimeSlot,
          room: selectedRoom,
          date: selectedDate.toISOString()
        };
      }
      return shift;
    });
    
    setShifts(updatedShifts);
    
    // Reset form fields
    setSelectedDoctor('');
    setSelectedRoom('');
    setSelectedShift(null);
    
    // Close the dialog
    setEditShiftOpen(false);
  };

  // Add this function to handle deleting a shift
  const handleDeleteShift = () => {
    if (!selectedShift) return;
    
    // Filter out the selected shift
    const updatedShifts = shifts.filter(shift => shift.id !== selectedShift.id);
    setShifts(updatedShifts);
    
    // Reset form fields
    setSelectedDoctor('');
    setSelectedRoom('');
    setSelectedShift(null);
    
    // Close the dialog
    setEditShiftOpen(false);
  };

  // Update the reset form function to handle edit dialog too
  const handleEditDialogClose = (open) => {
    if (!open) {
      setSelectedDoctor('');
      setSelectedRoom('');
      setSelectedShift(null);
    }
    setEditShiftOpen(open);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-48 bg-background border-r border-border">
        <div className="py-2">
          <Link to="/staff" className="block py-3 px-4 text-foreground hover:bg-muted">
            Staff Directory
          </Link>
          <div className="py-3 px-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-600 dark:text-blue-400 font-medium">
            Shift Management
          </div>
          <Link to="/attendance" className="block py-3 px-4 text-foreground hover:bg-muted">
            Attendance
          </Link>
          <Link to="/leave-management" className="block py-3 px-4 text-foreground hover:bg-muted">
            Leave Management
          </Link>
        </div>
        
        {/* Week Summary */}
        <div className="mt-8 px-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium dark:text-gray-200">Week Summary</h3>
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          
          {/* Doctor list */}
          <div className="mt-4 space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="flex items-start">
                <img src={doctorImage} alt={doctor.name} className="w-8 h-8 rounded-full mr-2" />
                <div>
                  <p className="text-sm font-medium dark:text-gray-200">{doctor.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{doctor.hours}</p>
                  {doctor.assigned ? (
                    <div className="flex items-center mt-1">
                      <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mr-1">
                        <span className="text-green-500 dark:text-green-400 text-xs">✓</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{doctor.shifts} shifts</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400">Not assigned</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Shift Management</h1>
          
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-40 h-10 border-gray-300 rounded-md">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Week navigation */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevWeek}
                className="h-8 w-8 p-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCurrentWeek}
                className="h-8 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextWeek}
                className="h-8 w-8 p-0 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium dark:text-gray-300">
                {formatWeekDisplay()}
              </div>
            </div>
          </div>
          
          {/* Calendar */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              {/* Days header */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {days.map((day, index) => (
                  <div key={index} className="p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-white dark:bg-gray-800">
                    <div className="text-sm font-medium dark:text-gray-200">{day.date} {day.day}</div>
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 min-h-[500px]">
                {days.map((day, index) => (
                  <Droppable droppableId={index.toString()} key={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`border-r border-gray-200 dark:border-gray-700 last:border-r-0 p-2 relative ${
                          snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800'
                        }`}
                      >
                        {shifts
                          .filter(shift => {
                            // Compare dates to show shifts on the correct day
                            const shiftDate = new Date(shift.date);
                            const dayDate = day.dateObj;
                            return shiftDate.toDateString() === dayDate.toDateString();
                          })
                          .map((shift, shiftIndex) => (
                            <Draggable key={shift.id} draggableId={shift.id} index={shiftIndex}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded p-2 mb-2 cursor-move"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Stop propagation to prevent cell click
                                    handleShiftClick(e, shift);
                                  }}
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium dark:text-gray-200">{shift.doctor}</span>
                                    <button 
                                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the parent's onClick
                                        // You could add a menu here if needed
                                      }}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">{shift.time}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">{shift.room}</div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                        
                        {/* Invisible overlay to capture clicks anywhere in the cell */}
                        <div 
                          className="absolute inset-0 cursor-pointer z-0" 
                          onClick={() => handleCalendarCellClick(index)}
                        ></div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Add Shift Dialog */}
      <Dialog open={addShiftOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Shift</DialogTitle>
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => setAddShiftOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-500 text-sm">DATE</Label>
                <div className="font-medium">{selectedDay}</div>
              </div>
              <div>
                <Label htmlFor="time-slot" className="text-gray-500 text-sm">TIME SLOT</Label>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot, index) => (
                      <SelectItem key={index} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="doctor" className="text-sm mb-1 block">Choose Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type a name" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>{doctor.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="room" className="text-sm mb-1 block">Room Num</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose room num" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room, index) => (
                    <SelectItem key={index} value={room}>{room}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleAddShift}>Add Shift</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={editShiftOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => setEditShiftOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-500 text-sm">DATE</Label>
                <div className="font-medium">{selectedDay}</div>
              </div>
              <div>
                <Label htmlFor="time-slot" className="text-gray-500 text-sm">TIME SLOT</Label>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot, index) => (
                      <SelectItem key={index} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="doctor" className="text-sm mb-1 block">Choose Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type a name" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>{doctor.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="room" className="text-sm mb-1 block">Room Num</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose room num" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room, index) => (
                    <SelectItem key={index} value={room}>{room}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between">
              <Button variant="destructive" onClick={handleDeleteShift}>
                Delete Shift
              </Button>
              <Button onClick={handleUpdateShift}>Update Shift</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftManagement;










