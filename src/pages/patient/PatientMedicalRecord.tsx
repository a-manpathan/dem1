import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed Select, SelectContent, SelectItem, SelectTrigger, SelectValue imports as they are now
// encapsulated within CustomConsultationTypeSelect and not directly used here.
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, ChevronRight, Search, Star, Hospital, BriefcaseMedical, Brain, HeartPulse, Bone, Eye, Droplet, Thermometer, Stethoscope, Heart, FileText, FlaskConical, X, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
// Ensure this path is correct for your project structure
import DateRangePickerPopoverContent from '@/components/patient/CalenderSelectionDialog'; 
// Import the new CustomConsultationTypeSelect component
import CustomConsultationTypeSelect from '@/components/patient/ConsultationType'; // Adjust filename if you kept it as ConsultationType.tsx


const MedicalRecordPage = () => {
    const [selectedRecord, setSelectedRecord] = useState('22/02/2025');
    // State to control the Calendar Popover's open/close status
    const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false); 
    // State to hold the selected date(s) for display in the calendar trigger button
    const [displayDate, setDisplayDate] = useState<Date | undefined>(undefined); 

    // State to store the selected consultation type value (e.g., "in-clinic")
    // Initialize with an empty string or a default value if desired
    const [selectedConsultationType, setSelectedConsultationType] = useState<string>(''); 

    const medicalRecords = [
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "07/04/2025" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "22/02/2025" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "07/01/2025" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "17/11/2024" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "07/04/2024" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "07/04/2024" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "07/04/2024" },
        { disease: "Pneumonia", hospital: "City Hospital", doctor: "Dr. Abhinand Choudry", date: "07/04/2024" },
    ];

    const medications = [
        { name: "Lisinopril, 20mg", dosage: "1-0-1", instructions: "After meals", duration: "3 Days" },
        { name: "Metformin, 500mg", dosage: "1-1-1", instructions: "Before meals", duration: "3 Days" },
        { name: "Atorvastatin, 20mg", dosage: "1-1-1", instructions: "After meals", duration: "3 Days" },
    ];

    // Function to handle dates saved from the calendar popover content
    const handleSaveDates = (janDate: number | null, aprDate: number | null) => {
        console.log('Selected January Date:', janDate);
        console.log('Selected April Date:', aprDate);
        
        if (aprDate) {
            setDisplayDate(new Date(2025, 3, aprDate)); 
        } else if (janDate) {
            setDisplayDate(new Date(2025, 0, janDate)); 
        } else {
            setDisplayDate(undefined); 
        }
        setIsCalendarPopoverOpen(false); // Close the calendar popover after saving
    };

    // This function will now be passed directly to CustomConsultationTypeSelect's onValueChange
    const handleSelectConsultationType = (type: string) => {
        setSelectedConsultationType(type); // Update the state with the selected type
        console.log('Selected Consultation Type:', type);
        // You can add logic here to filter medical records based on consultation type
    };


    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header section can go here if you have one */}

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Medical Record</h1>

                <div className="flex space-x-4 mb-6">
                    <Button variant="outline" className="flex items-center gap-2 text-gray-700">
                        <BriefcaseMedical className="h-4 w-4" /> Hospital
                    </Button>
                    
                    {/* Replaced the old Button and Dialog with your new CustomConsultationTypeSelect */}
                    <CustomConsultationTypeSelect
                        value={selectedConsultationType}
                        onValueChange={handleSelectConsultationType}
                    />

                    {/* Calendar Popover (unchanged from previous step) */}
                    <Popover open={isCalendarPopoverOpen} onOpenChange={setIsCalendarPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-[280px] justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {displayDate ? format(displayDate, "PPP") : <span>Date Range</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <DateRangePickerPopoverContent
                                onSave={handleSaveDates}
                                onClosePopover={() => setIsCalendarPopoverOpen(false)}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="Text Search" className="pl-10" />
                    </div>
                    <Button variant="ghost" className="text-blue-600">Clear all filters</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Medical Record List */}
                    <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
                        <RadioGroup value={selectedRecord} onValueChange={setSelectedRecord}>
                            {medicalRecords.map((record, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer mb-2 ${selectedRecord === record.date ? 'border-2 border-blue-600 bg-blue-50' : 'border border-gray-200'}`}
                                    onClick={() => setSelectedRecord(record.date)}
                                >
                                    <div className="flex items-center">
                                        <RadioGroupItem value={record.date} id={`record-${index}`} className="mr-3" />
                                        <div>
                                            <p className="font-semibold text-sm">{record.disease}</p>
                                            <p className="text-xs text-gray-500 flex items-center">
                                                <Hospital className="h-3 w-3 mr-1" /> {record.hospital}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center">
                                                <BriefcaseMedical className="h-3 w-3 mr-1" /> {record.doctor}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" /> {record.date}
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Middle Column: Details */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Symptoms */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Symptoms</h2>
                            <Textarea
                                placeholder="Head ache, Breathing trouble at night"
                                className="min-h-[60px] bg-gray-50 border-gray-200"
                                value="Head ache, Breathing trouble at night"
                                readOnly
                            />
                        </div>

                        {/* Diagnosis */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Diagnosis</h2>
                            <p className="text-gray-700 text-sm mb-2">Lorem ipsum dolor</p>
                            <p className="text-gray-500 text-xs mb-4">
                                Notes: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <Button variant="outline" className="flex items-center gap-2 text-blue-600 border-blue-200 bg-blue-50">
                                <FileText className="h-4 w-4" /> Download File
                            </Button>
                        </div>

                        {/* Medication */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Medication</h2>
                            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 mb-2">
                                <div>Medication</div>
                                <div>Dosage</div>
                                <div>Duration</div>
                                <div></div>
                            </div>
                            {medications.map((med, index) => (
                                <div key={index} className="grid grid-cols-4 gap-2 text-sm text-gray-800 border-b border-gray-100 py-2">
                                    <div>{med.name}</div>
                                    <div>{med.dosage}</div>
                                    <div>{med.instructions}</div>
                                    <div>{med.duration}</div>
                                </div>
                            ))}
                            <p className="text-gray-500 text-xs mt-4">
                                Notes: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        {/* Surgery */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Surgery</h2>
                            <p className="text-gray-500 text-sm">No previous surgeries</p>
                        </div>
                    </div>

                    {/* Right Column: Vitals, Lab Results, X-ray */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Vitals */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Vitals</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Temperature</p>
                                        <p className="font-semibold">98.5'F</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Droplet className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">SPO2</p>
                                        <p className="font-semibold">98%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HeartPulse className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Blood Pressure</p>
                                        <p className="font-semibold">125/75</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BriefcaseMedical className="h-5 w-5 text-blue-600" /> {/* Placeholder icon */}
                                    <div>
                                        <p className="text-sm text-gray-500">Weight</p>
                                        <p className="font-semibold">75 Kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <Heart className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Pulse Rate</p>
                                        <p className="font-semibold">52 bpm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lab Results */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">Lab Results</h2>
                            <div className="border border-gray-200 rounded-lg p-3 mb-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm">Urine test.pdf</p>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Negative</span>
                                </div>
                                <p className="text-gray-500 text-xs">
                                    Findings <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                            <div className="border border-gray-200 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm">Blood test.pdf</p>
                                    </div>
                                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">Positive</span>
                                </div>
                                <p className="text-gray-500 text-xs">
                                    Findings <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>

                        {/* X-ray */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="font-bold text-lg mb-3">X-ray</h2>
                            <div className="border border-gray-200 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <p className="font-medium text-sm">Lungs.pdf</p>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Negative</span>
                                </div>
                                <p className="text-gray-500 text-xs">
                                    Findings <br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordPage;
