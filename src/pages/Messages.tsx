import React, { useState } from 'react';
import { Search, Paperclip, Phone, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import doctorImage from '@/assets/doctor.jpg';
import doctor2Image from '@/assets/doctor2.jpg';
import doctor3Image from '@/assets/doctor3.jpg';

const Messages = () => {
  const [selectedPatient, setSelectedPatient] = useState({
    name: 'Karthika Vishwanath',
    age: 42,
    gender: 'Female',
    nhs: '990 915 3955',
    dob: '24 June, 1983'
  });
  
  const patients = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    name: 'Karthika Vishwanath',
    age: 42,
    gender: 'Female',
    nhs: '990 915 3955',
    dob: '24 June, 1983',
    avatar: 'https://via.placeholder.com/40'
  }));

  // Create an array of doctor data for messages
  const doctors = [
    { name: 'Dr. Abhinand Choudry', specialty: 'Endocrinologist', image: doctorImage },
    { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', image: doctor2Image },
    { name: 'Dr. Michael Chen', specialty: 'Neurologist', image: doctor3Image }
  ];

  // Randomly select a doctor for this message
  const messageDoctor = doctors[0]; // Default to first doctor

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Left sidebar - Patient list */}
      <div className="w-72 border-r bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Messages</h1>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search by Name/ NHS num" 
              className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="space-y-1">
            {patients.map((patient) => (
              <div 
                key={patient.id}
                className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                onClick={() => setSelectedPatient(patient)}
              >
                <img 
                  src={patient.avatar} 
                  alt={patient.name} 
                  className="w-10 h-10 rounded-full mr-3" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate dark:text-gray-100">{patient.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({patient.age}, {patient.gender})</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <p className="truncate">NHS: {patient.nhs}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <p className="truncate">DOB: {patient.dob}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div className="flex items-center">
            <img 
              src="https://via.placeholder.com/40" 
              alt={selectedPatient.name} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <div className="flex items-center">
                <h2 className="font-medium dark:text-gray-100">{selectedPatient.name}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({selectedPatient.age}y, {selectedPatient.gender})</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                NHS: {selectedPatient.nhs}, DOB: {selectedPatient.dob}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Select defaultValue="you">
              <SelectTrigger className="w-40 bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
                <SelectValue placeholder="Assigned: You" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="you">Assigned: You</SelectItem>
                <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                <SelectItem value="dr-jones">Dr. Jones</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
          <div className="flex justify-end mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-md">
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mb-1">25/04/2025</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 max-w-md">
            <div className="mb-2">
              <p className="font-medium dark:text-gray-100">Dear Karthika Vishwanath (42, Female)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">NHS: 990 915 3955, DOB: 24 June, 1983</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Type a message</p>
            
            <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              <div className="flex items-center">
                <span className="bg-blue-500 text-white p-1 rounded mr-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16H15M12 16V8M7 8H17M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Discharge Summary</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 mb</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-4 flex items-center">
              <img 
                src={doctorImage} 
                alt="Doctor" 
                className="w-10 h-10 rounded-full mr-3" 
              />
              <div>
                <p className="font-medium dark:text-gray-100">Dr. Abhinand Choudry</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Endocrinologist</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">City Hospital</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat input */}
        <div className="border-t p-4 bg-white">
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              Attach
            </Button>
            <Button variant="outline" className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Invitation
            </Button>
            <Button variant="outline" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Invitation
            </Button>
            <div className="flex-1"></div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              Send as text message
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21L5 19.5M5 19.5L9.5 16.5M5 19.5L7.5 12.5M7.5 12.5L10.5 15M7.5 12.5L14 7.5M14 7.5L16.5 9.5M14 7.5L18 3M18 3L21 5M18 3L19.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;






