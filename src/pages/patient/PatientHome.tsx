import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FullscreenToggle } from '@/components/ui/fullscreen-toggle';
import { 
  User, 
  Edit, 
  Thermometer, 
  Heart, 
  Activity, 
  Weight, 
  Droplets,
  MessageCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Clock,
  Eye,
  ChevronRight
} from "lucide-react";
import jokLogo from '@/pages/jok.jpg';

const PatientHome = () => {
  const [activeTab, setActiveTab] = useState('home');

  const patientData = {
    name: "Philip Johnson",
    id: "7023232054",
    age: "42 years, Male",
    address: "88 Somer Street, Los Angeles",
    dateOfBirth: "24/05/1990",
    nhs: "91 7206 1254 4025",
    insurance: "Med right",
    bloodGroup: "--",
    maritalStatus: "Unmarried",
    job: "Teacher",
    allergies: ["Latex", "Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Asthma", "Dermatitis"],
    vitals: {
      temperature: "98.6°F",
      bloodPressure: "120/80 mmHg",
      pulse: "72 bpm",
      spO2: "98%",
      weight: "75 kg (+8kg)",
      lastUpdated: "07/04/2025"
    },
    socialHistory: {
      tobacco: "Not provided",
      drinking: "Not provided",
      recreationalDrug: "Not provided"
    },
    medications: [
      {
        name: "Lisinopril, 20mg",
        frequency: "1-0-1",
        timing: "After meals",
        duration: "3 Days"
      },
      {
        name: "Metformin, 500mg",
        frequency: "1-1-1",
        timing: "Before meals",
        duration: "3 Days"
      },
      {
        name: "Atorvastatin, 20mg",
        frequency: "1-1-1",
        timing: "After meals",
        duration: "3 Days"
      }
    ],
    medicalHistory: [
      {
        type: "Upcoming",
        condition: "Diabetic Check up",
        date: "24 May, 2025",
        location: "City Hospital",
        treatmentType: "Radiotherapy",
        problem: "Urinate often and very hungry from last few days",
        doctor: "Dr. M Wagner",
        priority: "Medium",
        caseNum: "XXXX"
      }
    ],
    pastHistory: [
      {
        condition: "Stomach Pain",
        date: "08 Dec, 2024",
        location: "City Hospital",
        treatmentType: "Radiotherapy"
      },
      {
        condition: "Fever",
        date: "08 Dec, 2024",
        location: "City Hospital",
        treatmentType: "Radiotherapy"
      }
    ]
  };

  const VitalCard = ({ icon: Icon, label, value, color = "text-blue-500" }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className={`p-2 rounded-full bg-white dark:bg-gray-700 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );

  return (
    <div className="flex">
        {/* Patient Info Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 p-6 space-y-6 min-h-screen">
          {/* Patient Avatar and Basic Info */}
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                alt="Patient" 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{patientData.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{patientData.id}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{patientData.age}</p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{patientData.address}</span>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Vital Signs</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">Last updated: {patientData.vitals.lastUpdated}</span>
            </div>
            <div className="space-y-3">
              <VitalCard 
                icon={Thermometer} 
                label="Temperature" 
                value={patientData.vitals.temperature}
                color="text-blue-500"
              />
              <VitalCard 
                icon={Heart} 
                label="Blood Pressure" 
                value={patientData.vitals.bloodPressure}
                color="text-red-500"
              />
              <VitalCard 
                icon={Activity} 
                label="Pulse" 
                value={patientData.vitals.pulse}
                color="text-green-500"
              />
              <VitalCard 
                icon={Droplets} 
                label="SpO2" 
                value={patientData.vitals.spO2}
                color="text-blue-500"
              />
              <VitalCard 
                icon={Weight} 
                label="Weight" 
                value={patientData.vitals.weight}
                color="text-purple-500"
              />
            </div>
          </div>

          {/* Social History */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Social History</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Tobacco User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{patientData.socialHistory.tobacco}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Droplets className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Drinking Habit</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{patientData.socialHistory.drinking}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Recreational Drug User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{patientData.socialHistory.recreationalDrug}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Personal Details & Medical History Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Details */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Details</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Data
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <InfoRow label="DATE OF BIRTH" value={patientData.dateOfBirth} />
                    <InfoRow label="BLOOD GROUP" value={patientData.bloodGroup} />
                    <InfoRow label="ALLERGIES AND INTOLERANCE" value="" />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patientData.allergies.map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs rounded">
                          {allergy}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">ACTIVE CONDITIONS</p>
                      <div className="flex flex-wrap gap-1">
                        {patientData.conditions.map((condition, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <InfoRow label="NHS" value={patientData.nhs} />
                    <InfoRow label="MARITAL STATUS" value={patientData.maritalStatus} />
                    <div className="mt-8">
                      <InfoRow label="IMMUNISATION" value="01/05/2021 Influenza (3years and up)" />
                      <InfoRow label="SURGICAL PROCEDURES" value="No previous surgeries" />
                      <InfoRow label="FAMILY HISTORY" value="Not provided" />
                    </div>
                  </div>
                  <div>
                    <InfoRow label="INSURANCE" value={patientData.insurance} />
                    <InfoRow label="JOB" value={patientData.job} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Medical History</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">Upcoming (4 days from now)</p>
                    {patientData.medicalHistory.map((item, index) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{item.condition}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Problem</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.problem}</p>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>Doctor: {item.doctor}</span>
                                <span>Priority: {item.priority}</span>
                                <span>Case Num: {item.caseNum}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.treatmentType}</p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-2">
                              Cancel Appointment
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Past</p>
                    <div className="space-y-2">
                      {patientData.pastHistory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.condition}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600 dark:text-gray-400">{item.treatmentType}</p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Medications */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current / Last Medication</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face" 
                  alt="Doctor" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">City Hospital</span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Dr. Abhinand Choudry</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Endocrinologist</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message Doctor
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Medication</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Frequency</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Timing</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.medications.map((med, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{med.name}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{med.frequency}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{med.timing}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default PatientHome;