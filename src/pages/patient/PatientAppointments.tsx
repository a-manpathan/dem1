import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, ChevronRight, Search, Star, Hospital, BriefcaseMedical, Brain, HeartPulse, Bone, Eye, User, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper component for the Calendar
const Calendar = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: 2 }, (_, i) => i + 1); // Days from previous month to align '1' to Tuesday

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <ChevronRight className="h-5 w-5 rotate-180 cursor-pointer text-gray-500" />
        <h3 className="font-semibold text-base dark:text-gray-100">Thursday</h3>
        <ChevronRight className="h-5 w-5 cursor-pointer text-gray-500" />
      </div>
      <div className="text-center text-blue-600 font-medium mb-4 text-sm">
        <p>22 April, 2025</p>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
        {emptyDays.map(d => <div key={`empty-${d}`}></div>)}
        {dates.map(date => {
          let className = "cursor-pointer hover:bg-blue-100 rounded-full p-1 aspect-square flex items-center justify-center";
          if ([4, 5, 11, 12, 18, 19, 25, 26].includes(date)) {
              className += " text-gray-300 dark:text-gray-600";
          }
           if (date === 22) {
            className += " bg-blue-600 text-white";
          }
          if (date === 16) {
             className += " text-red-500";
          }
          return <div key={date} className={`${className} dark:text-gray-100`}>{date}</div>;
        })}
      </div>
    </div>
  );
};

import AppointmentHistory from '@/components/patient/AppointmentHistory';

const BookAppointmentPage = () => {
    const [selectedHospital, setSelectedHospital] = useState('City Hospital');
    const [selectedDepartment, setSelectedDepartment] = useState('Endocrinology');
    const [selectedDoctor, setSelectedDoctor] = useState('Dr. Abhinand Choudry');
    const [selectedTime, setSelectedTime] = useState('11:20 AM');
    const [consultationType, setConsultationType] = useState('in-person');
    const [reason, setReason] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [showSummary, setShowSummary] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const hospitals = ["City Hospital", "Royal London Hospital", "Baby Memorial", "Leo Hospital"];
    const departments = [
        { name: "Pediatrics", icon: <BriefcaseMedical /> },
        { name: "OPD", icon: <BriefcaseMedical /> },
        { name: "Traumatology", icon: <Bone /> },
        { name: "Cardiology", icon: <HeartPulse /> },
        { name: "Endocrinology", icon: <Brain /> },
        { name: "Ophthalmology", icon: <Eye /> },
        { name: "Psychology", icon: <Brain /> },
        { name: "Pulmonology", icon: <BriefcaseMedical /> },
    ];
    
    const doctors = [
        { name: "Dr. Abhinand Choudry", specialty: "Endocrinologist", rating: 4.8, avatar: "https://i.pravatar.cc/150?u=dr-abhinand" },
        { name: "Dr. Isabella Martinez", specialty: "Cardiologist", rating: 4.9, avatar: "https://i.pravatar.cc/400?img=59?u=dr-isabella" },
        { name: "Dr. Ben Carter", specialty: "Pediatrician", rating: 4.7, avatar: "https://i.pravatar.cc/150?u=dr-ben" },
        { name: "Dr. Olivia Chen", specialty: "Dermatologist", rating: 4.8, avatar: "https://i.pravatar.cc/150?u=dr-olivia" },
    ];

    const timeSlots = [
        "09:30 AM", "09:40 AM", "09:50 AM", "11:20 AM", "02:00 PM", "02:10 PM",
        "02:20 PM", "07:40 PM", "07:50 PM", "08:00 PM", "08:10 PM", "08:30 PM", "08:40 PM"
    ];


  if (showHistory) {
    return <AppointmentHistory onBackToBooking={() => setShowHistory(false)} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex justify-between items-center">
             <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Book Appointment</h1>
             <div>
                <Button variant="default" className="rounded-full">Book Appointment</Button>
                <Button 
                    variant="ghost" 
                    className="rounded-full text-gray-600"
                    onClick={() => setShowHistory(true)}
                >
                    Appointment History
                </Button>
             </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Unchanged) */}
            <div className="lg:col-span-1 space-y-6">
                {/* Choose Hospital */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg dark:text-gray-100">1. Choose Hospital</h2>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="Location" className="pl-10" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        {hospitals.map(h => (
                            <Button
                                key={h}
                                variant={selectedHospital === h ? 'default' : 'outline'}
                                className={`flex items-center justify-center gap-2 ${selectedHospital !== h && 'bg-gray-100 dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                                onClick={() => setSelectedHospital(h)}
                            >
                                <Hospital className="h-4 w-4" />
                                {h}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Choose Department */}
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg dark:text-gray-100">2. Choose Department</h2>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        {departments.map(d => (
                            <Button
                                key={d.name}
                                variant={selectedDepartment === d.name ? 'default' : 'outline'}
                                className={`flex items-center justify-center gap-2 ${selectedDepartment !== d.name && 'bg-gray-100 dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                                onClick={() => setSelectedDepartment(d.name)}
                            >
                                {React.cloneElement(d.icon, {className: "h-4 w-4"})}
                                {d.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Choose Doctor */}
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg dark:text-gray-100">3. Choose Doctor</h2>
                         <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-3 mt-4">
                        {doctors.map((doc, index) => (
                            <div
                                key={index}
                                className={`flex items-center p-2 rounded-lg cursor-pointer ${selectedDoctor === doc.name ? 'border-2 border-blue-600' : 'border border-gray-200'}`}
                                onClick={() => setSelectedDoctor(doc.name)}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={doc.avatar} alt={doc.name} />
                                    <AvatarFallback>{doc.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <p className="font-semibold text-sm">{doc.name}</p>
                                    <p className="text-xs text-gray-500">{doc.specialty}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-1 text-sm">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span>{doc.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

             {/* Right Column (  Changed as per new image) */}
            <div className="lg:col-span-2 space-y-6">
                {/* Top Section: Doctor Info and Calendar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left side: Doctor Profile */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                         <div className="text-center">
                            <Avatar className="h-24 w-24 mx-auto">
                                <AvatarImage src="https://i.pravatar.cc/150?u=dr-abhinand" alt="Dr. Abhinand Choudry" />
                                <AvatarFallback>AC</AvatarFallback>
                            </Avatar>
                            <div className="mt-4">
                                <h2 className="text-xl font-bold dark:text-gray-100">Dr. Abhinand Choudry</h2>
                                <p className="text-gray-600 text-sm">Endocrinologist</p>
                                <p className="text-blue-600 font-semibold mt-1">Consultation Fee: $150</p>
                            </div>
                        </div>
                        <p className="text-gray-500 mt-4 text-sm text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                    </div>
                    {/* Right side: Calendar and Consultation Type */}
                    <div className="lg:col-span-1 space-y-4">
                         <Calendar />
                        <div>
                             <label className="text-sm font-medium text-gray-700">Consultation Type</label>
                            <Select value={consultationType} onValueChange={setConsultationType}>
                                <SelectTrigger className="w-full mt-1 bg-white">
                                    <SelectValue placeholder="Choose Consultation type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="in-person">In-Person</SelectItem>
                                    <SelectItem value="telehealth">Telehealth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Availability Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                     <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <BriefcaseMedical className="h-5 w-5 text-blue-600" />
                        22nd April Availability
                     </h3>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                        {timeSlots.map(time => (
                            <Button
                                key={time}
                                variant={selectedTime === time ? 'default' : 'outline'}
                                className={`h-9 text-xs ${selectedTime === time ? 'bg-black text-white' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>

                 {/* Reason Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm relative">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                         <BriefcaseMedical className="h-5 w-5 text-blue-600" />
                        Reason
                    </h3>
                    <div className="absolute top-4 right-4 w-[130px]">
                        <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger className="w-full h-9 bg-gray-100 border-gray-100">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="severe">Severe</SelectItem>
                                </SelectContent>
                        </Select>
                    </div>
                    <Textarea 
                        placeholder="Type your reason" 
                        className="min-h-[100px] bg-gray-50 border-gray-200" 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                
                <Button 
                    className="w-full h-12 text-lg" 
                    onClick={() => setShowSummary(true)}
                >
                    Book Appointment
                </Button>
            </div>
        </div>

        {/* Appointment Summary Dialog */}
        <Dialog open={showSummary} onOpenChange={setShowSummary}>
            <DialogContent className="max-w-4xl p-0 bg-gray-100">
                <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg p-8 space-y-8 lg:space-y-0 lg:space-x-8">
                    {/* Doctor Information Card */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4 mb-6">
                            <Avatar className="w-24 h-24 border-2 border-blue-500">
                                <AvatarImage src="https://i.pravatar.cc/150?u=dr-abhinand" alt="Dr. Abhinand Choudry" />
                                <AvatarFallback>AC</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">{selectedDoctor}</h2>
                                <p className="text-gray-600">Endocrinologist</p>
                                <p className="text-gray-600">Experience : 25 years</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Time :</span>
                                <span className="text-gray-800 font-semibold">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Date :</span>
                                <span className="text-gray-800 font-semibold">Thursday, April 22, 2025</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Type :</span>
                                <span className="flex items-center text-gray-800 font-semibold">
                                    <User className="w-5 h-5 mr-1 text-blue-500" />
                                    {consultationType === 'in-person' ? 'In Clinic Consultation' : 'Telehealth Consultation'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Hospital :</span>
                                <span className="flex items-center text-gray-800 font-semibold">
                                    <MapPin className="w-5 h-5 mr-1 text-red-500" />
                                    {selectedHospital} | AUSTIN
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary Card */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Summary</h2>
                        <div className="space-y-4 mb-6 text-gray-700">
                            <div className="flex justify-between items-center">
                                <span>Consultation Fee</span>
                                <span className="font-semibold">$ 100</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>TAX</span>
                                <span className="font-semibold">$ 50</span>
                            </div>
                            <hr className="border-gray-300 my-4" />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span>$ 150</span>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <Button className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                                Pay Now
                            </Button>
                            <Button 
                                variant="outline"
                                className="bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-50 transition duration-300 shadow-sm"
                                onClick={() => setShowSummary(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default BookAppointmentPage;