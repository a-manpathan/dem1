import React, { useState } from 'react';
import { Clock, Plus, X, Mic, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddVitalsModal from '@/components/doctor/AddVitalsModal';
import xrayImage from '@/assets/xray.jpg';
import ecgImage from '@/assets/ecg.jpg';
import bloodReportImage from '@/assets/bld_rep.jpg';

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  
  // Add new state for prescription data
  const [symptoms, setSymptoms] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [diagnosis, setDiagnosis] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [notes, setNotes] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      name: 'George Mathew',
      status: 'Now',
      statusColor: 'text-blue-500',
      action: 'Sent patient in',
      actionColor: 'text-orange-500'
    },
    {
      id: 2,
      name: 'Karthik Vishwanathan',
      status: 'Next',
      statusColor: 'text-gray-500',
      action: 'Arrived',
      actionColor: 'text-purple-500'
    },
    {
      id: 3,
      name: 'Karthik Vishwanathan',
      status: '10:40 AM',
      statusColor: 'text-gray-500',
      action: '',
      actionColor: ''
    },
    {
      id: 4,
      name: 'Karthik Vishwanathan',
      status: '10:50 AM',
      statusColor: 'text-gray-500',
      action: '',
      actionColor: ''
    },
    {
      id: 5,
      name: 'Karthik Vishwanathan',
      status: '11:00 AM',
      statusColor: 'text-gray-500',
      action: '',
      actionColor: ''
    },
    {
      id: 6,
      name: 'Karthik Vishwanathan',
      status: '11:10 AM',
      statusColor: 'text-gray-500',
      action: '',
      actionColor: ''
    },
    {
      id: 7,
      name: 'Karthik Vishwanathan',
      status: '11:20 AM',
      statusColor: 'text-gray-500',
      action: '',
      actionColor: ''
    }
  ];

  // Patient details
  const patientDetails = {
    name: 'George Mathew',
    complaint: 'Chest Pain, Fever, Breathing trouble at night',
    age: '53',
    gender: 'Female',
    dob: '26.04.1990',
    abhaNum: '91 7206 1254 4025',
    insurance: 'Star Health',
    lastAppointment: {
      date: '12 April, 2025',
      type: 'Follow up'
    },
    activeConditions: [
      'Hypertension',
      'Asthma',
      'Dermatitis'
    ],
    allergies: ['Latex', 'Penicillin', 'Peanuts'],
    vitalSigns: {
      temp: '98.5',
      bp: '125/75',
      pulse: '52',
      spo2: '98%',
      weight: '75'
    },
    medications: [
      { name: 'Lisinopril', dosage: '20mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' },
      { name: 'Metformin', dosage: '500mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' },
      { name: 'Atorvastatin', dosage: '20mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' }
    ],
    immunization: [
      { date: '01/05/2021', vaccine: 'Influenza (3years and up)', status: 'administered' }
    ],
    appointmentHistory: [
      { date: '12 Apr 2025', type: 'Follow up' },
      { date: '27 Feb 2025', type: 'Asthma' }
    ]
  };

  // Doctor details
  const doctorDetails = {
    name: 'Dr. Abhinand Choudry',
    specialty: 'Endocrinologist',
    hospital: 'City Hospital'
  };

  const handlePatientSelect = (appointment) => {
    setSelectedPatient(appointment);
  };

  const handleSaveVitals = (vitals) => {
    // Here you would update the patient's vital signs
    console.log('Saving vitals:', vitals);
    setIsVitalsModalOpen(false);
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would implement actual recording functionality here
  };
  
  const handleAutoDetectLanguage = () => {
    // In a real app, you would implement language detection here
    console.log('Auto-detecting language...');
  };
  
  const handleGeneratePrescription = () => {
    // In a real app, you would generate a prescription based on the entered data
    console.log('Generating prescription...');
  };

  // Sample medical history data
  const medicalHistoryData = [
    {
      date: '20 April, 2024',
      isLastVisit: true,
      vitals: {
        temp: '98.5°F',
        bp: '125/75',
        pulseRate: '52 bpm',
        spo2: '98%',
        weight: '75Kg'
      },
      symptoms: 'Head ache, Breathing trouble at night',
      diagnosis: 'Lorem ipsum dolor\nLorem ipsum dolor',
      medications: [
        { name: 'Dolo 500, 500mg', dosage: '1-0-1', instructions: 'After meals', duration: '3weeks' },
        { name: 'Doxyspan LB Tablet, 100mg', dosage: '1-1-1', instructions: 'After meals', duration: '3weeks' }
      ],
      reports: [
        { type: 'Blood test', imageUrl: bloodReportImage },
        { type: 'X-ray', imageUrl: xrayImage }
      ]
    },
    {
      date: '20 April, 2024',
      vitals: {
        temp: '98.5°F',
        bp: '125/75',
        pulseRate: '52 bpm',
        spo2: '98%',
        weight: '75Kg'
      },
      symptoms: 'Head ache, Breathing trouble at night',
      diagnosis: 'Lorem ipsum dolor\nLorem ipsum dolor',
      medications: [
        { name: 'Dolo 500, 500mg', dosage: '1-0-1', instructions: 'After meals', duration: '3weeks' },
        { name: 'Doxyspan LB Tablet, 100mg', dosage: '1-1-1', instructions: 'After meals', duration: '3weeks' }
      ],
      reports: [
        { type: 'ECG', imageUrl: ecgImage },
        { type: 'Blood test', imageUrl: bloodReportImage }
      ]
    },
    {
      date: '20 April, 2024',
      vitals: {
        temp: '98.5°F',
        bp: '125/75',
        pulseRate: '52 bpm',
        spo2: '98%',
        weight: '75Kg'
      },
      symptoms: 'Head ache, Breathing trouble at night',
      diagnosis: 'Lorem ipsum dolor\nLorem ipsum dolor',
      medications: [
        { name: 'Dolo 500, 500mg', dosage: '1-0-1', instructions: 'After meals', duration: '3weeks' },
        { name: 'Doxyspan LB Tablet, 100mg', dosage: '1-1-1', instructions: 'After meals', duration: '3weeks' }
      ],
      reports: [
        { type: 'Blood test', imageUrl: bloodReportImage },
        { type: 'Urine test', imageUrl: '/reports/urine-test.png' }
      ]
    },
    {
      date: '20 April, 2024',
      vitals: {
        temp: '98.5°F',
        bp: '125/75',
        pulseRate: '52 bpm',
        spo2: '98%',
        weight: '75Kg'
      },
      symptoms: 'Head ache, Breathing trouble at night',
      diagnosis: 'Lorem ipsum dolor\nLorem ipsum dolor',
      medications: [
        { name: 'Dolo 500, 500mg', dosage: '1-0-1', instructions: 'After meals', duration: '3weeks' },
        { name: 'Doxyspan LB Tablet, 100mg', dosage: '1-1-1', instructions: 'After meals', duration: '3weeks' }
      ],
      reports: [
        { type: 'Blood test', imageUrl: bloodReportImage },
        { type: 'Urine test', imageUrl: '/reports/urine-test.png' }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content with appointments list and patient details */}
      <div className="flex-1 flex">
        {/* Left sidebar with appointments list */}
        <div className="w-64 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="font-medium">Appointments</h2>
            <p className="text-sm text-gray-500">34 Upcoming, 8 Completed</p>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-5rem)]">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedPatient?.id === appointment.id ? 'bg-blue-50' : ''}`}
                onClick={() => handlePatientSelect(appointment)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">{appointment.name}</div>
                  <div className={`text-sm ${appointment.statusColor}`}>
                    {appointment.status === 'Now' && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    )}
                    {appointment.status}
                  </div>
                </div>
                {appointment.action && (
                  <div className={`text-sm ${appointment.actionColor}`}>
                    {appointment.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content area with patient details */}
        <div className="flex-1 flex flex-col">
          {/* Doctor info header - always visible */}
          <div className="bg-white p-4 border-b flex justify-end items-center">
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <div className="font-medium">{doctorDetails.name}</div>
                <div className="text-sm text-gray-500">{doctorDetails.specialty}</div>
                <div className="text-sm text-gray-500 flex items-center justify-end">
                  <Clock className="w-3 h-3 mr-1" />
                  {doctorDetails.hospital}
                </div>
              </div>
              <Avatar className="w-12 h-12">
                <AvatarImage src="/doctor-avatar.jpg" alt="Doctor" />
                <AvatarFallback>{doctorDetails.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Tab content area */}
          <div className="p-6 flex-1 overflow-auto">
            <Tabs defaultValue="home" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-transparent p-0 border-b w-full justify-start h-auto mb-6">
                <TabsTrigger 
                  value="home" 
                  className="px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-none data-[state=active]:rounded-t-md"
                >
                  Home
                </TabsTrigger>
                <TabsTrigger 
                  value="patientOverview" 
                  className="px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-none data-[state=active]:rounded-t-md"
                >
                  Patient Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="prescriptionPad" 
                  className="px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-none data-[state=active]:rounded-t-md"
                >
                  Prescription Pad
                </TabsTrigger>
                <TabsTrigger 
                  value="medicalHistory" 
                  className="px-4 py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-none data-[state=active]:rounded-t-md"
                >
                  Medical History
                </TabsTrigger>
              </TabsList>
              
              {/* Home Tab Content */}
              <TabsContent value="home">
                <div className="flex mb-4">
                  <div className="mr-4">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="text-sm text-gray-500 mr-2">Now</span>
                      <span>Follow up</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-medium">{patientDetails.name}</h2>
                  <p className="text-gray-600">{patientDetails.complaint}</p>
                  
                  <div className="flex mt-2">
                    <div className="mr-4">{patientDetails.age} yo</div>
                    <div>{patientDetails.gender}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Last Appointment */}
                  <div className="bg-white rounded-md p-4 shadow-sm">
                    <h3 className="font-medium mb-2">Last Appointment</h3>
                    <div className="flex justify-between items-center">
                      <div>{patientDetails.lastAppointment.date}</div>
                      <div className="flex items-center text-blue-500">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {patientDetails.lastAppointment.type}
                      </div>
                    </div>
                  </div>

                  {/* Active Conditions */}
                  <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Active Conditions</h3>
                      <span className="text-gray-500">{patientDetails.activeConditions.length}</span>
                    </div>
                    <div className="space-y-2">
                      {patientDetails.activeConditions.map((condition, index) => (
                        <div key={index} className="py-2 border-b last:border-0">
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" className="text-blue-500 border-blue-500">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Schedule
                  </Button>
                  <Button variant="outline" className="text-blue-500 border-blue-500">
                    Download List
                  </Button>
                </div>
              </TabsContent>
              
              {/* Patient Overview Tab Content */}
              <TabsContent value="patientOverview">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left column - Patient info */}
                  <div className="col-span-1">
                    <div className="bg-white rounded-md p-4 shadow-sm mb-4">
                      <h3 className="font-medium mb-2">{patientDetails.name}</h3>
                      <div className="text-sm">
                        <p className="text-gray-600 mb-2">{patientDetails.complaint}</p>
                        <p className="mb-1">{patientDetails.age} yo &nbsp; {patientDetails.gender}</p>
                        <p className="mb-1">DOB: {patientDetails.dob}</p>
                        <p className="mb-1">Abha num: {patientDetails.abhaNum}</p>
                        <p className="mb-1">Insurance: {patientDetails.insurance}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-md p-4 shadow-sm">
                      <h3 className="font-medium mb-2">Appointment History</h3>
                      <div className="space-y-2">
                        {patientDetails.appointmentHistory.map((appointment, index) => (
                          <div key={index} className="flex items-center py-2 border-b last:border-0">
                            <div className="mr-2">{appointment.date}</div>
                            <div className="flex items-center text-blue-500">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              <span>{appointment.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle and right columns - Medical details */}
                  <div className="col-span-2">
                    {/* Vital Signs */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Vital Signs</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-500 h-8 px-2"
                          onClick={() => setIsVitalsModalOpen(true)}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Vitals
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">Temp</div>
                          <div className="text-lg font-medium">{patientDetails.vitalSigns.temp} <span className="text-xs align-top">°F</span></div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">BP</div>
                          <div className="text-lg font-medium">{patientDetails.vitalSigns.bp}</div>
                          <div className="text-xs text-gray-500">Lower than normal</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">Pulse rate</div>
                          <div className="text-lg font-medium">{patientDetails.vitalSigns.pulse} <span className="text-xs">BPM</span></div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">SpO₂</div>
                          <div className="text-lg font-medium">{patientDetails.vitalSigns.spo2}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">Weight</div>
                          <div className="text-lg font-medium">{patientDetails.vitalSigns.weight} <span className="text-xs">kg</span></div>
                          <div className="text-xs text-gray-500">+5 kg</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chief Complaint */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <h3 className="font-medium mb-2">Chief Complaint</h3>
                      <p className="text-gray-600">No chief complaint on file</p>
                    </div>
                    
                    {/* Allergies and Intolerance */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <h3 className="font-medium mb-2">Allergies and Intolerance</h3>
                      <div className="flex flex-wrap gap-2">
                        {patientDetails.allergies.map((allergy, index) => (
                          <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Active Conditions */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <h3 className="font-medium mb-2">Active Conditions</h3>
                      <div className="flex flex-wrap gap-2">
                        {patientDetails.activeConditions.map((condition, index) => (
                          <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Current Medication */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Current medication <span className="text-gray-500 text-sm ml-2">{patientDetails.medications.length}</span></h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <tbody>
                            {patientDetails.medications.map((med, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 pr-4">{med.name}</td>
                                <td className="py-3 pr-4">{med.dosage}</td>
                                <td className="py-3 pr-4">{med.doctor}</td>
                                <td className="py-3">{med.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Immunization */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <h3 className="font-medium mb-2">Immunization</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <tbody>
                            {patientDetails.immunization.map((imm, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-3 pr-4">{imm.date}</td>
                                <td className="py-3 pr-4">{imm.vaccine}</td>
                                <td className="py-3">{imm.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Surgical Procedures */}
                    <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                      <h3 className="font-medium mb-2">Surgical Procedures</h3>
                      <p className="text-gray-600">—</p>
                    </div>
                    
                    {/* Family History */}
                    <div className="bg-white rounded-md p-4 shadow-sm">
                      <h3 className="font-medium mb-2">Family History</h3>
                      <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Prescription Pad Tab Content */}
              <TabsContent value="prescriptionPad">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left column - Prescription input */}
                  <div>
                    {/* Symptoms */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Symptoms</h3>
                        <div className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">?</div>
                      </div>
                      <Textarea 
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                    
                    {/* Diagnosis */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Diagnosis</h3>
                        <div className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">?</div>
                      </div>
                      <Textarea 
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                    
                    {/* Notes */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Notes</h3>
                        <div className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">?</div>
                      </div>
                      <Textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-24"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleGeneratePrescription}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Generate Prescription
                    </Button>
                  </div>
                  
                  {/* Right column - Voice input */}
                  <div>
                    <div className="mb-4">
                      <h3 className="mb-2">Choose a language</h3>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="english">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="English" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="hindi">Hindi</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <ArrowLeftRight className="w-5 h-5 text-gray-500" />
                        
                        <Select defaultValue="english">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="English" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="hindi">Hindi</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-6">
                      <Button 
                        onClick={handleStartRecording}
                        className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleAutoDetectLanguage}
                        className="flex-1"
                      >
                        Auto detect language
                      </Button>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm text-gray-600 mb-1">Symptoms</h3>
                      <div className="border rounded-md p-2 mb-4">
                        <h4 className="text-xs text-gray-500 mb-1">Transcript</h4>
                        <Textarea 
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder=""
                          className="min-h-24 border-0 focus-visible:ring-0 p-0"
                        />
                      </div>
                      
                      <div className="border rounded-md p-2 relative">
                        <h4 className="text-xs text-gray-500 mb-1">Translation</h4>
                        <Textarea 
                          value={translation}
                          onChange={(e) => setTranslation(e.target.value)}
                          placeholder=""
                          className="min-h-24 border-0 focus-visible:ring-0 p-0"
                        />
                        
                        {/* Globe icon in bottom right */}
                        <div className="absolute bottom-2 right-2 bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-blue-500">
                            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" strokeWidth="2" />
                            <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Medical History Tab Content */}
              <TabsContent value="medicalHistory">
                <div className="grid grid-cols-4 gap-4">
                  {medicalHistoryData.map((visit, index) => (
                    <div key={index} className="bg-white rounded-md shadow-sm p-4">
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{visit.date}</div>
                          {visit.isLastVisit && <div className="text-xs text-gray-500">(Last visit)</div>}
                        </div>
                      </div>
                      
                      {/* Vitals */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Vitals</h3>
                        <div className="text-xs space-y-1 text-gray-700">
                          <div>Temp : {visit.vitals.temp}</div>
                          <div>BP : {visit.vitals.bp}</div>
                          <div>Pulse rate : {visit.vitals.pulseRate}</div>
                          <div>SPO2 : {visit.vitals.spo2}</div>
                          <div>weight : {visit.vitals.weight}</div>
                        </div>
                      </div>
                      
                      {/* Symptoms */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Symptoms</h3>
                        <p className="text-xs text-gray-700">{visit.symptoms}</p>
                      </div>
                      
                      {/* Diagnosis */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Diagnosis</h3>
                        <div className="text-xs text-gray-700 whitespace-pre-line">
                          {visit.diagnosis}
                        </div>
                      </div>
                      
                      {/* Medication */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Medication</h3>
                        <div className="space-y-3">
                          {visit.medications.map((med, medIndex) => (
                            <div key={medIndex} className="text-xs text-gray-700">
                              <div>{med.name}</div>
                              <div className="flex justify-between mt-1">
                                <span>{med.dosage}</span>
                                <span>{med.instructions}</span>
                                <span>{med.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Reports */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Reports</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {visit.reports.map((report, reportIndex) => (
                            <div key={reportIndex} className="text-center">
                              <div className="bg-gray-100 rounded-md p-2 mb-1 relative">
                                <img 
                                  src={report.imageUrl} 
                                  alt={report.type} 
                                  className="w-full h-16 object-cover"
                                />
                                <button className="absolute top-1 right-1 bg-white rounded-full p-1">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                              <div className="text-xs">{report.type}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Additional medical images section at the bottom */}
                <div className="mt-8">
                  <h2 className="text-lg font-medium mb-4">Additional Medical Images</h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white rounded-md shadow-sm p-4">
                      <div className="mb-2">
                        <img 
                          src={xrayImage} 
                          alt="X-ray" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <h3 className="font-medium">Chest X-ray</h3>
                      <p className="text-sm text-gray-500">20 April, 2024</p>
                    </div>
                    
                    <div className="bg-white rounded-md shadow-sm p-4">
                      <div className="mb-2">
                        <img 
                          src={ecgImage} 
                          alt="ECG" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <h3 className="font-medium">ECG Report</h3>
                      <p className="text-sm text-gray-500">20 April, 2024</p>
                    </div>
                    
                    <div className="bg-white rounded-md shadow-sm p-4">
                      <div className="mb-2">
                        <img 
                          src={bloodReportImage} 
                          alt="Blood Report" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <h3 className="font-medium">Blood Test Report</h3>
                      <p className="text-sm text-gray-500">20 April, 2024</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add Vitals Modal */}
      <AddVitalsModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        onSave={handleSaveVitals}
        initialVitals={{
          temp: patientDetails.vitalSigns.temp,
          bp: patientDetails.vitalSigns.bp,
          pulse: patientDetails.vitalSigns.pulse,
          spo2: patientDetails.vitalSigns.spo2.replace('%', ''),
          weight: patientDetails.vitalSigns.weight
        }}
      />
    </div>
  );
};

export default DoctorAppointments;













