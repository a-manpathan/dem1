import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, Calendar as CalendarIcon, X, Upload, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import doctorImage from '@/assets/doctor.jpg';
import doctor2Image from '@/assets/doctor2.jpg';
import doctor3Image from '@/assets/doctor3.jpg';
import { FileCode } from 'lucide-react';

const Appointments = () => {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('07:30 AM');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Search and filter states
  const [nameSearch, setNameSearch] = useState('');
  const [abhaPhoneSearch, setAbhaPhoneSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  
  // Original appointments data
  const originalAppointments = [
    {
      id: 1,
      time: '11:00 PM',
      patient: 'shivam Vishwanath',
      profile: 'Male, 34y',
      phone: '5673947103',
      abhaNum: '6090',
      reason: 'Body Ache',
      status: 'Booked',
      type: 'home',
      fullName: 'Karthika Vishwanath',
      gender: 'Female',
      age: '34',
      dob: '24/05/1990',
      abha: '91 7206 1254 4025',
      uhid: '10922110220002',
      bloodGroup: '--',
      maritalStatus: 'Unmarried',
      bookingSlot: '11:00 AM (10 min)',
      bookingTime: '03:00 PM',
      bookingDate: '17/05/2025',
      lastVisit: '11:00 AM (10 min)',
      lastVisitDate: '17 April, 2025',
      slotType: 'In Clinic',
      bookingStatus: 'Booked',
      registrationNum: '12556',
      reasonDetail: 'Fever',
      medicalHistory: ['Alcohol', 'Hepatitis', 'Allergic to pollen']
    },
    {
      id: 2,
      time: '11:00 PM',
      patient: 'Karthik Vishwanath',
      profile: 'Male, 34y',
      phone: '9028491057',
      abhaNum: '70931',
      reason: 'Report Show',
      status: 'Arrived',
      type: 'phone',
      fullName: 'Karthika Vishwanath',
      gender: 'Female',
      age: '34',
      dob: '24/05/1990',
      abha: '91 7206 1254 4025',
      uhid: '10922110220002',
      bloodGroup: '--',
      maritalStatus: 'Unmarried',
      bookingSlot: '11:00 AM (10 min)',
      bookingTime: '03:00 PM',
      bookingDate: '17/05/2025',
      lastVisit: '11:00 AM (10 min)',
      lastVisitDate: '17 April, 2025',
      slotType: 'In Clinic',
      bookingStatus: 'Booked',
      registrationNum: '12556',
      reasonDetail: 'Fever',
      medicalHistory: ['Alcohol', 'Hepatitis', 'Allergic to pollen']
    },
    {
      id: 3,
      time: '11:00 PM',
      patient: 'Mike Anderson',
      profile: 'Male, 34y',
      phone: '1023078392',
      abhaNum: '11901',
      reason: 'Report Show',
      status: 'Cancelled',
      type: 'phone'
    },
    {
      id: 4,
      time: '11:00 PM',
      patient: 'Jake Paul',
      profile: 'Male, 34y',
      phone: '7029473048',
      abhaNum: '3890121',
      reason: 'Rabis Vaccination',
      status: 'Arrived',
      type: 'vaccination'
    },
    {
      id: 5,
      time: '11:00 PM',
      patient: 'Travis Scott',
      profile: 'Male, 34y',
      phone: '1080389407',
      abhaNum: '409032',
      reason: 'Report Show',
      status: 'Completed',
      type: 'clinic'
    },
    {
      id: 6,
      time: '11:00 PM',
      patient: 'Mike Tyson',
      profile: 'Male, 34y',
      phone: '6784059201',
      abhaNum: '10980',
      reason: 'Report Show',
      status: 'Booked',
      type: 'clinic'
    },
    {
      id: 7,
      time: '11:00 PM',
      patient: 'Marshel Mathers',
      profile: 'Male, 34y',
      phone: '7597802010',
      abhaNum: '87090',
      reason: 'Report Show',
      status: 'Completed',
      type: 'clinic'
    }
  ];
  
  // Filtered appointments state
  const [filteredAppointments, setFilteredAppointments] = useState(originalAppointments);
  
  // Effect to filter appointments when search or filter changes
  useEffect(() => {
    let result = [...originalAppointments];
    
    // Filter by name
    if (nameSearch) {
      result = result.filter(appointment => 
        appointment.patient.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    
    // Filter by ABHA or phone
    if (abhaPhoneSearch) {
      result = result.filter(appointment => 
        appointment.phone.includes(abhaPhoneSearch) || 
        appointment.abhaNum.toLowerCase().includes(abhaPhoneSearch.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'upcoming') {
        result = result.filter(appointment => 
          appointment.status === 'Booked' || appointment.status === 'Arrived'
        );
      } else if (statusFilter === 'completed') {
        result = result.filter(appointment => appointment.status === 'Completed');
      } else if (statusFilter === 'cancelled') {
        result = result.filter(appointment => appointment.status === 'Cancelled');
      }
    }
    
    setFilteredAppointments(result);
  }, [nameSearch, abhaPhoneSearch, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'text-blue-600';
      case 'Arrived':
        return 'text-purple-600';
      case 'Cancelled':
        return 'text-red-600';
      case 'Completed':
        return 'text-green-600';
      case 'Sent patient in':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return '🏠';
      case 'phone':
        return '📞';
      case 'vaccination':
        return '💉';
      case 'clinic':
        return '👨‍⚕️';
      default:
        return '📋';
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setPatientDetailsOpen(true);
  };

  // Calendar data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date(2025, 3, 14); // April 14, 2025
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Stats data
  const stats = [
    { title: 'Total Appointments', value: '34', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    { title: 'Upcoming', value: '18', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
    { title: 'Completed', value: '16', color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' }
  ];

  // Create an array of doctor images for the staff list
  const doctorImages = [doctorImage, doctor2Image, doctor3Image, doctor2Image, doctor3Image];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left sidebar */}
      <div className="w-1/4 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Logo and navigation */}
        
        
        {/* Calendar section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-medium">Wednesday</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">12 April, 2023</p>
            </div>
          </div>
          
          {/* Calendar */}
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Sun</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Mon</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tue</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Wed</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Thu</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Fri</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sat</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((day, index) => (
                <div key={index} className={`
                  h-8 w-8 flex items-center justify-center rounded-full text-sm
                  ${day === null ? 'invisible' : ''}
                  ${day === 14 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}
                  ${day === 4 || day === 11 || day === 18 || day === 25 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}
                `}>
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Staff section */}
        <div className="p-4">
          <h3 className="font-medium mb-3">Staff</h3>
          <div className="space-y-3">
            {/* Doctor cards */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center">
              <img src={doctorImage} alt="Doctor" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 className="font-medium">Dr. Abhinand Choudry</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Endocrinologist</p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 flex items-center">
              <img src={doctor2Image} alt="Doctor" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 className="font-medium">Dr. Sarah Johnson</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cardiologist</p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 flex items-center">
              <img src={doctor3Image} alt="Doctor" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 className="font-medium">Dr. Michael Chen</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Neurologist</p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 flex items-center">
              <img src={doctor2Image} alt="Doctor" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 className="font-medium">Dr. Emily Rodriguez</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pediatrician</p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 flex items-center">
              <img src={doctor3Image} alt="Doctor" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h4 className="font-medium">Dr. James Wilson</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dermatologist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="w-3/4 flex flex-col">
        {/* Doctor info and actions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            <img src={doctorImage} alt="Dr. Abhinand Choudry" className="w-12 h-12 rounded-full object-cover mr-4" />
            <div>
              <h2 className="text-lg font-medium">Dr. Abhinand Choudry</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Endocrinologist</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">🏥 City Hospital</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="bg-blue-50 border-blue-100 text-primary hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Set Schedule
            </Button>
            <Button 
              variant="outline"
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download List
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-lg p-4`}>
              <h3 className="text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
        
        {/* Search and filter */}
        <div className="p-4 flex justify-between">
          <div className="flex space-x-2 w-2/3">
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search by Name" 
                className="pl-9 bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search by ABHA/ Phone num" 
                className="pl-9 bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Select defaultValue="upcoming">
              <SelectTrigger className="w-32 bg-white dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </div>
        </div>
        
        {/* Appointments table */}
        <div className="flex-1 p-4 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="pb-2 font-medium">SLOT</th>
                <th className="pb-2 font-medium">NAME</th>
                <th className="pb-2 font-medium">PROFILE</th>
                <th className="pb-2 font-medium">PHONE NUM</th>
                <th className="pb-2 font-medium">ABHA NUM</th>
                <th className="pb-2 font-medium">REASON</th>
                <th className="pb-2 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr 
                  key={appointment.id} 
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <td className="py-3 flex items-center">
                    {getTypeIcon(appointment.type)}
                    <span className="ml-2">{appointment.time}</span>
                  </td>
                  <td className="py-3">{appointment.patient}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{appointment.profile}</td>
                  <td className="py-3">{appointment.phone}</td>
                  <td className="py-3">{appointment.abhaNum}</td>
                  <td className="py-3">{appointment.reason}</td>
                  <td className={`py-3 ${getStatusColor(appointment.status)}`}>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
