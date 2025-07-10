import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User,
  Phone,
  Home,
  Video,
  Syringe,
  FileText,
  Ambulance,
  HeartPulse,
  CalendarCheck
} from "lucide-react";

interface ConsultationOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CustomConsultationTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CustomConsultationTypeSelect: React.FC<CustomConsultationTypeSelectProps> = ({
  value,
  onValueChange,
}) => {
  const consultationOptions: ConsultationOption[] = [
    { value: "in-clinic", label: "In Clinic", icon: <User className="h-5 w-5 text-blue-600" /> },
    { value: "telephone", label: "Telephone Consultation", icon: <Phone className="h-5 w-5 text-green-600" /> },
    { value: "home-visit", label: "Home Visit", icon: <Home className="h-5 w-5 text-red-600" /> },
    { value: "video-conference", label: "Video Conference", icon: <Video className="h-5 w-5 text-purple-600" /> },
    { value: "vaccination", label: "Vaccination", icon: <Syringe className="h-5 w-5 text-yellow-600" /> },
    { value: "show-report", label: "Show Report", icon: <FileText className="h-5 w-5 text-gray-600" /> },
    { value: "emergency", label: "Emergency", icon: <Ambulance className="h-5 w-5 text-red-700" /> },
    { value: "long-term-condition", label: "Long Term Condition", icon: <HeartPulse className="h-5 w-5 text-pink-600" /> },
    { value: "routine-appointment", label: "Routine Appointment", icon: <CalendarCheck className="h-5 w-5 text-teal-600" /> },
  ];

  // Helper function to get the display label from the value
  const getConsultationTypeLabel = (val: string) => {
    const option = consultationOptions.find(opt => opt.value === val);
    return option ? option.label : "Consultation Type";
  };

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px] flex items-center gap-2 text-gray-700 border border-gray-300 bg-white">
        {/* Display the selected value or a placeholder */}
        <SelectValue placeholder="Consultation Type">
          {getConsultationTypeLabel(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="p-0 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        {consultationOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center">
              {/* Text first */}
              <span className="text-gray-800 text-sm mr-2">{option.label}</span>
              {/* Icon second */}
              <div className="flex-shrink-0">
                {option.icon}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomConsultationTypeSelect;