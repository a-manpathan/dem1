import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Mic, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import AddVitalsModal from '@/components/doctor/AddVitalsModal';
import { toast } from 'sonner';
import translationService from '@/services/translationService';
import prescriptionService from '@/services/prescriptionService';
import xrayImage from '@/assets/xray.jpg';
import ecgImage from '@/assets/ecg.jpg';
import bloodReportImage from '@/assets/bld_rep.jpg';
import speechService from '@/services/speechService';
import { transcriptAnalysisService } from '@/services/transcriptAnalysisService';
import { useSpeechToText } from '@/hooks/useSpeechToText';

interface Vitals {
  temp: string;
  bp: string;
  pulse: string;
  spo2: string;
  weight: string;
}

interface Medication {
  name: string;
  dosage: string;
  doctor: string;
  date: string;
}

interface Immunization {
  date: string;
  vaccine: string;
  status: string;
}

interface Report {
  type: string;
  imageUrl: string;
}

interface Appointment {
  id: number;
  name: string;
  age: string;
  gender: string;
  status: string;
  statusColor?: string;
  action?: string;
  actionColor?: string;
  complaint: string;
  dob: string;
  abhaNum: string;
}

interface PatientDetails {
  name: string;
  complaint: string;
  age: string;
  gender: string;
  dob: string;
  abhaNum: string;
  insurance: string;
  lastAppointment: {
    date: string;
    type: string;
  };
  activeConditions: string[];
  allergies: string[];
  vitalSigns: Vitals;
  medications: Medication[];
  immunization: Immunization[];
  appointmentHistory: Array<{
    date: string;
    type: string;
  }>;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

interface ApiState extends LoadingState {
  isGenerating: boolean;
}

const DoctorAppointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState<boolean>(false);

  // Add new state for prescription data
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [targetTranslationLanguage, setTargetTranslationLanguage] = useState('en-US');
  const [isTranslating, setIsTranslating] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState('');
  const [isGeneratingPrescription, setIsGeneratingPrescription] = useState(false);
  const [isAutoDetectingLanguage, setIsAutoDetectingLanguage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoDetectTimeout, setAutoDetectTimeout] = useState<NodeJS.Timeout | null>(null);

  // Speech-to-text functionality
  const {
    isRecording,
    transcript: speechTranscript, // Renamed to avoid conflict with local 'transcript' state
    error: speechError,
    startRecording,
    stopRecording,
    // Removed toggleRecording as it's not directly used, handle logic in handleStartRecording
  } = useSpeechToText({
    language: selectedLanguage,
    continuous: true,
    interimResults: true
  });

  // Update local transcript state when speechTranscript from hook changes
  useEffect(() => {
    setTranscript(speechTranscript);
  }, [speechTranscript]);


  // Auto-translate when transcript changes
  useEffect(() => {
    if (transcript && transcript.trim() && targetTranslationLanguage !== selectedLanguage) {
      handleAutoTranslate();
    }
  }, [transcript, targetTranslationLanguage, selectedLanguage]);

  // Show error messages
  useEffect(() => {
    if (speechError) {
      toast.error(`Speech recognition error: ${speechError}`);
    }
  }, [speechError]);

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      name: 'George Mathew',
      age: '53',
      gender: 'Male',
      status: 'Now',
      statusColor: 'text-blue-500',
      action: 'Sent patient in',
      actionColor: 'text-orange-500',
      complaint: 'Chest Pain, Fever',
      dob: '26.04.1970',
      abhaNum: '91 7206 1254 4025'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: '34',
      gender: 'Female',
      status: 'Next',
      statusColor: 'text-gray-500',
      action: 'Arrived',
      actionColor: 'text-purple-500',
      complaint: 'Migraine, Nausea',
      dob: '15.08.1989',
      abhaNum: '91 8302 5647 1298'
    },
    {
      id: 3,
      name: 'Abdul Rahman',
      age: '45',
      gender: 'Male',
      status: '10:40 AM',
      complaint: 'Lower back pain',
      dob: '03.11.1978',
      abhaNum: '91 9456 7823 4561'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      age: '28',
      gender: 'Female',
      status: '10:50 AM',
      complaint: 'Allergic reaction',
      dob: '22.07.1995',
      abhaNum: '91 7789 3456 2109'
    },
    {
      id: 5,
      name: 'Rajesh Kumar',
      age: '62',
      gender: 'Male',
      status: '11:00 AM',
      complaint: 'Blood pressure check',
      dob: '11.03.1961',
      abhaNum: '91 8867 5432 9876'
    },
    {
      id: 6,
      name: 'Liu Wei',
      age: '41',
      gender: 'Female',
      status: '11:10 AM',
      complaint: 'Follow-up diabetes',
      dob: '30.12.1982',
      abhaNum: '91 9923 7865 4321'
    },
    {
      id: 7,
      name: 'Maria Garcia',
      age: '37',
      gender: 'Female',
      status: '11:20 AM',
      complaint: 'Pregnancy check-up',
      dob: '19.05.1986',
      abhaNum: '91 8845 6789 5432'
    }
  ];

  // Mock data for doctor details
  const doctorDetails = {
    name: "Dr. Abhinand Choudry",
    specialty: "Endocrinologist",
    hospital: "City Hospital"
  };

  const handlePatientSelect = (appointment: Appointment) => {
    setSelectedPatient(appointment);
    const selectedPatientDetails: PatientDetails = {
      name: appointment.name,
      complaint: appointment.complaint,
      age: appointment.age,
      gender: appointment.gender,
      dob: appointment.dob,
      abhaNum: appointment.abhaNum,
      insurance: 'Star Health',
      lastAppointment: {
        date: '12 April, 2025',
        type: 'Follow up'
      },
      activeConditions: [
        'Hypertension',
        'Type 2 Diabetes',
        appointment.complaint.includes('Migraine') ? 'Chronic Migraine' : null
      ].filter(Boolean) as string[],
      allergies: ['Latex', 'Penicillin', 'Peanuts'],
      vitalSigns: {
        temp: '98.5',
        bp: '125/75',
        pulse: '72',
        spo2: '98%',
        weight: '75'
      },
      medications: [
        { name: 'Lisinopril', dosage: '20mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' },
        { name: 'Metformin', dosage: '500mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' }
      ],
      immunization: [
        { date: '01/05/2021', vaccine: 'Influenza (3years and up)', status: 'administered' }
      ],
      appointmentHistory: [
        { date: appointment.status, type: appointment.complaint },
        { date: '27 Feb 2025', type: 'Regular check-up' }
      ]
    };
    setPatientDetails(selectedPatientDetails);
    setSymptoms('');
    setDiagnosis('');
    setNotes('');
    setTranscript('');
    setTranslation('');
    setGeneratedPrescription('');
  };

  const handleSaveVitals = (vitals: Vitals) => {
    console.log('Saving vitals:', vitals);
    setIsVitalsModalOpen(false);
  };

  const [apiState, setApiState] = useState<ApiState>({
    isLoading: false,
    isGenerating: false,
    error: null
  });

  const handleError = (error: Error) => {
    console.error('Error:', error);
    toast.error(error.message);
    setApiState(prev => ({ ...prev, error: error.message }));
  };

  const handleTranscription = async () => {
    try {
      if (!transcript.trim()) {
        toast.error('No transcript to analyze');
        return;
      }

      setIsAnalyzing(true);
      toast.info('Analyzing transcript...');
      
      const startTime = Date.now();
      const analysis = await transcriptAnalysisService.analyzeTranscript(transcript);
      const duration = Date.now() - startTime;
      
      setSymptoms(analysis.symptoms.join(', '));
      setDiagnosis(analysis.diagnosis);
      setNotes(analysis.notes);
      
      toast.success(`Analysis complete! (Took ${Math.round(duration/1000)} seconds)`);
    } catch (error: any) {
      console.error('Error analyzing transcript:', error);
      let errorMessage = 'Failed to analyze transcript';
      if (error.response?.data?.details) {
        errorMessage = `Analysis failed: ${error.response.data.details}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      if (isRecording) {
        // Stop recording
        stopRecording(); // Use hook's stopRecording
        toast.success('Recording stopped');
        // Analyze the final transcript
        // handleTranscription(); // Moved to an explicit button click for more control
      } else {
        // Start recording
        startRecording(); // Use hook's startRecording
        toast.success('Recording started - speak now');
      }
    } catch (error: any) {
      console.error('Recording error:', error);
      toast.error(`Failed to toggle recording: ${error.message || error}`);
    }
  };


  const handleAutoDetectLanguage = async () => {
    if (isAutoDetectingLanguage) {
      stopRecording();
      if (autoDetectTimeout) clearTimeout(autoDetectTimeout);
      setIsAutoDetectingLanguage(false);
      toast.success('Language detection stopped');
      return;
    }

    setIsAutoDetectingLanguage(true);
    toast.info('Detecting language - speak clearly for 5 seconds...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      });

      // Try different MIME types based on browser support
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ''; // Let browser choose
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined
      });
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType || 'audio/webm'
        });
        stream.getTracks().forEach(track => track.stop());

        try {
          // Use the speechService method for language detection
          const detectedLanguage = await speechService.detectLanguageFromAudio(audioBlob);

          if (detectedLanguage) {
            console.log('Language detected:', detectedLanguage);
            setSelectedLanguage(detectedLanguage);

            // Get language display name for better user feedback
            const getLanguageDisplayName = (langCode: string) => {
              const languageMap: { [key: string]: string } = {
                'en-US': 'English (US)',
                'en-GB': 'English (UK)',
                'hi-IN': 'Hindi (हिन्दी)',
                'bn-IN': 'Bengali (বাংলা)',
                'te-IN': 'Telugu (తెలుగు)',
                'ta-IN': 'Tamil (தமிழ்)',
                'mr-IN': 'Marathi (मराठी)',
                'gu-IN': 'Gujarati (ગુજરાતી)',
                'kn-IN': 'Kannada (ಕನ್ನಡ)',
                'ml-IN': 'Malayalam (മലയാളം)',
                'pa-IN': 'Punjabi (ਪੰਜਾਬੀ)',
                'or-IN': 'Odia (ଓଡ଼ିଆ)',
                'as-IN': 'Assamese (অসমীয়া)',
                'ur-IN': 'Urdu (اردو)',
                'fr-FR': 'French (Français)',
                'de-DE': 'German (Deutsch)',
                'es-ES': 'Spanish (Español)',
                'it-IT': 'Italian (Italiano)',
                'zh-CN': 'Chinese (中文)',
                'ja-JP': 'Japanese (日本語)',
                'ko-KR': 'Korean (한국어)'
              };
              return languageMap[langCode] || langCode;
            };

            toast.success(`Language detected: ${getLanguageDisplayName(detectedLanguage)}`);

            // Clear any existing transcript
            setTranscript('');

            // Wait a moment for the language to be set, then start recording with the detected language
            setTimeout(async () => {
              try {
                await startRecording();
                toast.info(`Started recording in ${getLanguageDisplayName(detectedLanguage)}`);
              } catch (error) {
                console.error('Error starting recording after language detection:', error);
                toast.error('Failed to start recording with detected language');
              }
            }, 500);
          } else {
            console.log('No language detected, defaulting to English');
            toast.warning('Could not detect language. Defaulting to English.');
            setSelectedLanguage('en-US');

            // Start recording with default language
            setTimeout(async () => {
              try {
                await startRecording();
                toast.info('Started recording in English');
              } catch (error) {
                console.error('Error starting recording with default language:', error);
                toast.error('Failed to start recording');
              }
            }, 500);
          }
        } catch (error) {
          console.error('Language detection error:', error);
          toast.error('Failed to detect language. Using English.');
          setSelectedLanguage('en-US');

          // Start recording with default language
          setTimeout(async () => {
            try {
              await startRecording();
            } catch (error) {
              console.error('Error starting recording after detection failure:', error);
              toast.error('Failed to start recording');
            }
          }, 500);
        } finally {
          setIsAutoDetectingLanguage(false);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error during language detection:', event);
        stream.getTracks().forEach(track => track.stop());
        setIsAutoDetectingLanguage(false);
        toast.error('Recording error during language detection');
      };

      mediaRecorder.start();
      const timeout = setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000); // 5 seconds for better language detection accuracy
      setAutoDetectTimeout(timeout);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setIsAutoDetectingLanguage(false);
      toast.error('Could not access microphone for language detection.');
    }
  };

  const getLanguageDisplayName = (langCode: string) => {
    const languageMap: { [key: string]: string } = {
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'hi-IN': 'Hindi (हिन्दी)',
      'bn-IN': 'Bengali (বাংলা)',
      'te-IN': 'Telugu (తెలుగు)',
      'ta-IN': 'Tamil (தமிழ்)',
      'mr-IN': 'Marathi (मराठी)',
      'gu-IN': 'Gujarati (ગુજરાતી)',
      'kn-IN': 'Kannada (ಕನ್ನಡ)',
      'ml-IN': 'Malayalam (മലയാളം)',
      'pa-IN': 'Punjabi (ਪੰਜਾਬੀ)',
      'or-IN': 'Odia (ଓଡ଼ିଆ)',
      'as-IN': 'Assamese (অসমীয়া)',
      'ur-IN': 'Urdu (اردু)',
      'fr-FR': 'French (Français)',
      'de-DE': 'German (Deutsch)',
      'es-ES': 'Spanish (Español)',
      'it-IT': 'Italian (Italiano)',
      'zh-CN': 'Chinese (中文)',
      'ja-JP': 'Japanese (日本語)',
      'ko-KR': 'Korean (한국어)'
    };
    return languageMap[langCode] || langCode;
  };

  const handleLanguageChange = (language: string) => {
    console.log('Language manually changed to:', language);
    setSelectedLanguage(language);

    toast.info(`Language set to ${getLanguageDisplayName(language)}`);

    // If currently recording, restart with new language
    if (isRecording) {
      stopRecording();
      setTimeout(async () => {
        try {
          await startRecording();
          toast.info(`Switched to ${getLanguageDisplayName(language)} - continue speaking`);
        } catch (error) {
          console.error('Error restarting recording with new language:', error);
          toast.error('Failed to restart recording with new language');
        }
      }, 500);
    }
  };

  const handleGeneratePrescription = async () => {
    try {
      setApiState(prev => ({ ...prev, isGenerating: true, error: null }));
      if (!symptoms.trim() && !diagnosis.trim() && !notes.trim()) {
        toast.warning('Please enter symptoms, diagnosis, or notes before generating a prescription');
        return;
      }

      setIsGeneratingPrescription(true);
      toast.info('Generating prescription using AI...');

      console.log('Generating prescription with data:', {
        symptoms: symptoms.substring(0, 100) + '...',
        diagnosis: diagnosis.substring(0, 100) + '...',
        notes: notes.substring(0, 100) + '...'
      });

      const patientInfo = {
        name: patientDetails!.name,
        age: patientDetails!.age,
        gender: patientDetails!.gender,
        medicalHistory: patientDetails!.activeConditions.join(', '),
        allergies: patientDetails!.allergies.join(', ')
      };

      const result = await prescriptionService.generatePrescription({
        symptoms: symptoms.trim() || undefined,
        diagnosis: diagnosis.trim() || undefined,
        notes: notes.trim() || undefined,
        patientInfo
      });

      setGeneratedPrescription(result.prescription);
      toast.success('Prescription generated successfully!');
      console.log('Prescription generated:', result);

    } catch (error) {
      handleError(error as Error);
    } finally {
      setApiState(prev => ({ ...prev, isGenerating: false }));
      setIsGeneratingPrescription(false);
    }
  };

  const handleCopyTranscriptToSymptoms = () => {
    if (transcript.trim()) {
      setSymptoms(transcript);
      toast.success('Transcript copied to symptoms');
    } else {
      toast.warning('No transcript to copy');
    }
  };

  const handleAutoTranslate = async () => {
    if (!transcript.trim() || isTranslating) return;

    try {
      setIsTranslating(true);

      const result = await translationService.translateText({
        text: transcript,
        targetLanguage: targetTranslationLanguage,
        sourceLanguage: selectedLanguage
      });

      setTranslation(result.translatedText);
      console.log('Translation completed:', result);

    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(`Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleManualTranslate = async () => {
    if (!transcript.trim()) {
      toast.warning('No text to translate');
      return;
    }

    try {
      setIsTranslating(true);
      toast.info('Translating...');

      const result = await translationService.translateText({
        text: transcript,
        targetLanguage: targetTranslationLanguage,
        sourceLanguage: selectedLanguage
      });

      setTranslation(result.translatedText);
      toast.success('Translation completed!');
      console.log('Manual translation completed:', result);

    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(`Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTargetLanguageChange = (language: string) => {
    setTargetTranslationLanguage(language);
    if (transcript.trim() && language !== selectedLanguage) {
      setTimeout(() => handleAutoTranslate(), 100);
    }
  };

  const handleTestAPI = async () => {
    try {
      toast.info('Testing API connection...');
      const response = await fetch('https://backend-demo-8rb3.onrender.com/api/speech/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioContent: 'dGVzdA==',
          languageCode: selectedLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('API connection successful!');
        console.log('API response:', data);
      } else {
        const errorData = await response.json();
        toast.error(`API error: ${errorData.error}`);
        console.error('API error:', errorData);
      }
    } catch (error: any) {
      toast.error(`API test failed: ${error.message}`);
      console.error('API test error:', error);
    }
  };

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
  ];

  useEffect(() => {
    if (!selectedPatient && appointments.length > 0) {
      const firstAppointment = appointments[0];
      setSelectedPatient(firstAppointment);
      const selectedPatientDetails: PatientDetails = {
        name: firstAppointment.name,
        complaint: firstAppointment.complaint,
        age: firstAppointment.age,
        gender: firstAppointment.gender,
        dob: firstAppointment.dob,
        abhaNum: firstAppointment.abhaNum,
        insurance: 'Star Health',
        lastAppointment: {
          date: '12 April, 2025',
          type: 'Follow up'
        },
        activeConditions: [
          'Hypertension',
          'Type 2 Diabetes',
          firstAppointment.complaint.includes('Migraine') ? 'Chronic Migraine' : null
        ].filter(Boolean) as string[],
        allergies: ['Latex', 'Penicillin', 'Peanuts'],
        vitalSigns: {
          temp: '98.5',
          bp: '125/75',
          pulse: '72',
          spo2: '98%',
          weight: '75'
        },
        medications: [
          { name: 'Lisinopril', dosage: '20mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' },
          { name: 'Metformin', dosage: '500mg, once daily, oral', doctor: 'Dr Abhinand', date: '21/04/24' }
        ],
        immunization: [
          { date: '01/05/2021', vaccine: 'Influenza (3years and up)', status: 'administered' }
        ],
        appointmentHistory: [
          { date: firstAppointment.status, type: firstAppointment.complaint },
          { date: '27 Feb 2025', type: 'Regular check-up' }
        ]
      };
      setPatientDetails(selectedPatientDetails);
    }
  }, [selectedPatient, appointments]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex">
        <div className="w-64 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="font-medium">Appointments</h2>
            <p className="text-sm text-gray-500">34 Upcoming, 8 Completed</p>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-5rem)]">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                  ${selectedPatient?.id === appointment.id ? 'bg-blue-50 dark:bg-blue-900' : 'bg-transparent'}
                `}
                onClick={() => handlePatientSelect(appointment)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className={`font-medium ${selectedPatient?.id === appointment.id ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>{appointment.name}</div>
                  <div className={`text-sm ${appointment.statusColor}`}>
                    {appointment.status === 'Now' && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    )}
                    {appointment.status}
                  </div>
                </div>
                {appointment.action && (
                  <div className={`text-sm ${appointment.actionColor} ${selectedPatient?.id === appointment.id ? 'dark:text-orange-300' : ''}`}>
                    {appointment.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
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

          <div className="p-6 flex-1 overflow-auto">
            {patientDetails ? (
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

                <TabsContent value="patientOverview">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="bg-white rounded-md p-4 shadow-sm mb-4">
                        <h3 className="font-medium mb-2">{patientDetails.name}</h3>
                        <div className="text-sm">
                          <p className="text-gray-600 mb-2">{patientDetails.complaint}</p>
                          <p className="mb-1">{patientDetails.age} yo   {patientDetails.gender}</p>
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

                    <div className="col-span-2">
                      <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Vital Signs</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 h-8 px-2"
                            onClick={() => setIsVitalsModalOpen(true)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Vitals
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

                      <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                        <h3 className="font-medium mb-2">Chief Complaint</h3>
                        <p className="text-gray-600">No chief complaint on file</p>
                      </div>

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

                      <div className="bg-white rounded-md p-4 shadow-sm mb-6">
                        <h3 className="font-medium mb-2">Surgical Procedures</h3>
                        <p className="text-gray-600">—</p>
                      </div>

                      <div className="bg-white rounded-md p-4 shadow-sm">
                        <h3 className="font-medium mb-2">Family History</h3>
                        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="prescriptionPad">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
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
                        disabled={isGeneratingPrescription || (!symptoms.trim() && !diagnosis.trim() && !notes.trim())}
                        className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                      >
                        {isGeneratingPrescription ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Generating...
                          </div>
                        ) : (
                          'Generate Prescription'
                        )}
                      </Button>

                      {generatedPrescription && (
                        <div className="mt-6 p-4 border rounded-md bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-lg">Generated Prescription</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedPrescription);
                                  toast.success('Prescription copied to clipboard');
                                }}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded border max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                              {generatedPrescription}
                            </pre>
                          </div>
                          <div className="mt-4 flex justify-end gap-3">
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setGeneratedPrescription('');
                                toast.error('Prescription rejected');
                              }}
                            >
                              Disapprove
                            </Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                toast.success('Prescription approved');
                              }}
                            >
                              Approve
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3>Choose a language</h3>
                          <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Current: {getLanguageDisplayName(selectedLanguage)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Search language..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <SelectGroup>
                                <SelectLabel>Indian Languages</SelectLabel>
                                <SelectItem value="hi-IN">Hindi (हिन्दी)</SelectItem>
                                <SelectItem value="bn-IN">Bengali (বাংলা)</SelectItem>
                                <SelectItem value="te-IN">Telugu (తెలుగు)</SelectItem>
                                <SelectItem value="ta-IN">Tamil (தமிழ்)</SelectItem>
                                <SelectItem value="mr-IN">Marathi (मराठी)</SelectItem>
                                <SelectItem value="gu-IN">Gujarati (ગુજરાતી)</SelectItem>
                                <SelectItem value="kn-IN">Kannada (ಕನ್ನಡ)</SelectItem>
                                <SelectItem value="ml-IN">Malayalam (മലയാളം)</SelectItem>
                                <SelectItem value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                                <SelectItem value="or-IN">Odia (ଓଡ଼ିଆ)</SelectItem>
                                <SelectItem value="as-IN">Assamese (অসমীয়া)</SelectItem>
                                <SelectItem value="ur-IN">Urdu (اردو)</SelectItem>
                                <SelectLabel>Other Languages</SelectLabel>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="en-GB">English (UK)</SelectItem>
                                <SelectItem value="fr-FR">French (Français)</SelectItem>
                                <SelectItem value="de-DE">German (Deutsch)</SelectItem>
                                <SelectItem value="es-ES">Spanish (Español)</SelectItem>
                                <SelectItem value="it-IT">Italian (Italiano)</SelectItem>
                                <SelectItem value="zh-CN">Chinese (中文)</SelectItem>
                                <SelectItem value="ja-JP">Japanese (日本語)</SelectItem>
                                <SelectItem value="ko-KR">Korean (한국어)</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <ArrowLeftRight className="w-5 h-5 text-gray-500" />

                          <Select value={targetTranslationLanguage} onValueChange={handleTargetLanguageChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Translate to" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <SelectGroup>
                                <SelectLabel>Indian Languages</SelectLabel>
                                <SelectItem value="hi-IN">Hindi (हिन्दी)</SelectItem>
                                <SelectItem value="bn-IN">Bengali (বাংলা)</SelectItem>
                                <SelectItem value="te-IN">Telugu (తెలుగు)</SelectItem>
                                <SelectItem value="ta-IN">Tamil (தமிழ்)</SelectItem>
                                <SelectItem value="mr-IN">Marathi (मराठी)</SelectItem>
                                <SelectItem value="gu-IN">Gujarati (ગુજરાતી)</SelectItem>
                                <SelectItem value="kn-IN">Kannada (ಕನ್ನಡ)</SelectItem>
                                <SelectItem value="ml-IN">Malayalam (മലയാളം)</SelectItem>
                                <SelectItem value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                                <SelectItem value="or-IN">Odia (ଓଡ଼ିଆ)</SelectItem>
                                <SelectItem value="as-IN">Assamese (অসমীয়া)</SelectItem>
                                <SelectItem value="ur-IN">Urdu (اردو)</SelectItem>
                                <SelectLabel>Other Languages</SelectLabel>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="en-GB">English (UK)</SelectItem>
                                <SelectItem value="fr-FR">French (Français)</SelectItem>
                                <SelectItem value="de-DE">German (Deutsch)</SelectItem>
                                <SelectItem value="es-ES">Spanish (Español)</SelectItem>
                                <SelectItem value="it-IT">Italian (Italiano)</SelectItem>
                                <SelectItem value="zh-CN">Chinese (中文)</SelectItem>
                                <SelectItem value="ja-JP">Japanese (日本語)</SelectItem>
                                <SelectItem value="ko-KR">Korean (한국어)</SelectItem>
                              </SelectGroup>
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
                          disabled={isRecording && !isAutoDetectingLanguage}
                          title={isRecording && !isAutoDetectingLanguage ? "Stop current recording first" : "Click to detect language from speech"}
                        >
                          {isAutoDetectingLanguage ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                              Detecting...
                            </span>
                          ) : (
                            'Auto Detect Language'
                          )}
                        </Button>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <Button
                          variant="outline"
                          onClick={handleTestAPI}
                          className="text-xs"
                          size="sm"
                        >
                          Test Speech API
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const testData = {
                              symptoms: 'Patient complains of headache and fever for 2 days',
                              diagnosis: 'Viral infection suspected',
                              notes: 'Patient appears tired but alert'
                            };
                            setSymptoms(testData.symptoms);
                            setDiagnosis(testData.diagnosis);
                            setNotes(testData.notes);
                            toast.success('Sample data loaded for testing');
                          }}
                          className="text-xs"
                          size="sm"
                        >
                          Load Test Data
                        </Button>
                        <Button
                          onClick={handleTranscription}
                          disabled={isAnalyzing || !transcript.trim()}
                          className="px-3 py-1 text-sm"
                        >
                          {isAnalyzing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            'Analyze'
                          )}
                        </Button>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-sm text-gray-600">Symptoms</h3>
                          {isRecording && (
                            <div className="flex items-center text-red-500 text-xs">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                              Recording...
                            </div>
                          )}
                        </div>
                        <div className="border rounded-md p-2 mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs text-gray-500">Transcript</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyTranscriptToSymptoms}
                              className="text-xs h-6 px-2"
                              disabled={!transcript.trim()}
                            >
                              Copy to Symptoms
                            </Button>
                          </div>
                          <Textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder={isRecording ? "Listening... speak now" : "Transcript will appear here"}
                            className="min-h-24 border-0 focus-visible:ring-0 p-0"
                          />
                        </div>

                        <div className="border rounded-md p-2 relative">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs text-gray-500">Translation</h4>
                            <div className="flex items-center gap-2">
                              {isTranslating && (
                                <div className="flex items-center text-blue-500 text-xs">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                                  Translating...
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleManualTranslate}
                                className="text-xs h-6 px-2"
                                disabled={!transcript.trim() || isTranslating}
                              >
                                Translate
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={translation}
                            onChange={(e) => setTranslation(e.target.value)}
                            placeholder={
                              isTranslating
                                ? "Translating..."
                                : targetTranslationLanguage === selectedLanguage
                                  ? "Select a different target language to see translation"
                                  : "Translation will appear here"
                            }
                            className="min-h-24 border-0 focus-visible:ring-0 p-0"
                          />

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

                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Symptoms</h3>
                          <p className="text-xs text-gray-700">{visit.symptoms}</p>
                        </div>

                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Diagnosis</h3>
                          <div className="text-xs text-gray-700 whitespace-pre-line">
                            {visit.diagnosis}
                          </div>
                        </div>

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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a patient to view details.
              </div>
            )}
          </div>
        </div>

        {patientDetails && (
          <AddVitalsModal
            isOpen={isVitalsModalOpen}
            onClose={() => setIsVitalsModalOpen(false)}
            onSave={handleSaveVitals}
            initialVitals={{
              temp: patientDetails.vitalSigns.temp,
              bp: patientDetails.vitalSigns.bp,
              pulse: patientDetails.vitalSigns.pulse,
              spo2: patientDetails.vitalSigns.spo2.replace('%', ''),
              weight: patientDetails.vitalSigns.weight,
            }}
          />
        )}
      </div>
    </div>
  );
}; // Added missing semicolon here

export default DoctorAppointments;