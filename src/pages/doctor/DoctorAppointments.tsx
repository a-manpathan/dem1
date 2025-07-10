import React, { useState, useEffect, useRef } from 'react';
import { Clock, Plus, X, Mic, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MaskGroup from '/src/assets/Mask group.jpg';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
// Removed direct imports for local components/services/assets as they cause resolution errors in this environment.
// These would typically be handled by your project's build system (e.g., Webpack, Next.js)
// For demonstration purposes, we'll use mock implementations or inline content where possible.
// import AddVitalsModal from '@/components/doctor/AddVitalsModal';
// import { toast } from 'sonner';
import translationService from '@/services/translationService';
// import prescriptionService from '@/services/prescriptionService';
// import xrayImage from '@/assets/xray.jpg';
// import ecgImage from '@/assets/ecg.jpg';
// import bloodReportImage from '@/assets/bld_rep.jpg';
// import speechService from '@/services/speechService';
// import { transcriptAnalysisService } from '@/services/transcriptAnalysisService';
// import { useSpeechToText } from '@/hooks/useSpeechToText';


// Mock AddVitalsModal component for demonstration purposes
const AddVitalsModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (vitals: Vitals) => void; initialVitals: Vitals }> = ({ isOpen, onClose, onSave, initialVitals }) => {
  const [temp, setTemp] = useState(initialVitals.temp);
  const [bp, setBp] = useState(initialVitals.bp);
  const [pulse, setPulse] = useState(initialVitals.pulse);
  const [spo2, setSpo2] = useState(initialVitals.spo2);
  const [weight, setWeight] = useState(initialVitals.weight);

  const handleSave = () => {
    onSave({ temp, bp, pulse, spo2, weight });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Vital Signs</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input  value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="e.g., 98.6" />
          <Input  value={bp} onChange={(e) => setBp(e.target.value)} placeholder="e.g., 120/80" />
          <Input value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="e.g., 72" />
          <Input  value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="e.g., 99" />
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 70" />
        </div>
        <Button onClick={handleSave}>Save Vitals</Button>
      </DialogContent>
    </Dialog>
  );
};


// Mock toast for demonstration
const toast = {
  success: (message: string) => console.log('SUCCESS:', message),
  error: (message: string) => console.error('ERROR:', message),
  info: (message: string) => console.info('INFO:', message),
  warning: (message: string) => console.warn('WARNING:', message),
};

// Mock services and hooks
// Using real translationService from import
const mockTranslationService = {
  translateText: async ({ text, targetLanguage, sourceLanguage }: { text: string; targetLanguage: string; sourceLanguage: string }) => {
    console.log(`Mock translating "${text}" from ${sourceLanguage} to ${targetLanguage}`);
    // Simulate API call
    return new Promise<{ translatedText: string }>(resolve => {
      setTimeout(() => {
        const translations: { [key: string]: string } = {
          'hi-IN': 'यह एक अनुवादित पाठ है।',
          'bn-IN': 'এটি একটি অনুবাদিত পাঠ।',
          'te-IN': 'ఇది అనువదించబడిన వచనం.',
          'ta-IN': 'இது ஒரு மொழிபெயர்க்கப்பட்ட உரை.',
          'mr-IN': 'हे एक अनुवादित मजकूर आहे.',
          'gu-IN': 'આ એક અનુવાદિત લખાણ છે.',
          'kn-IN': 'ಇದು ಅನುವಾದಿತ ಪಠ್ಯ.',
          'ml-IN': 'ഇതൊരു విವರ್తనం చేసిన ವಾచకമാണ്.',
          'pa-IN': 'ਇਹ ਇੱਕ ਅਨੁਵਾਦਿਤ ਪਾਠ ਹੈ।',
          'or-IN': 'ଏହା ଏକ ଅନୁବାଦିତ ପାଠ୍ୟ।',
          'as-IN': 'Assamese (অসমীয়া)',
          'ur-IN': 'یہ ایک ترجمہ شدہ متن ہے۔',
          'en-US': text, // If target is English, return original
          'en-GB': text,
          'fr-FR': 'Ceci est un texte traduit.',
          'de-DE': 'Dies ist ein übersetzter Text.',
          'es-ES': 'Este es un texto traducido.',
          'it-IT': 'Italian (Italiano)',
          'zh-CN': 'Chinese (中文)',
          'ja-JP': 'Japanese (日本語)',
          'ko-KR': 'Korean (한국어)',
        };
        resolve({ translatedText: translations[targetLanguage] || `Translated: ${text}` });
      }, 1000);
    });
  }
};

const prescriptionService = {
  generatePrescription: async ({ symptoms, diagnosis, notes, patientInfo }: any) => {
    console.log('Mock generating prescription:', { symptoms, diagnosis, notes, patientInfo });
    return new Promise<{ prescription: string }>(resolve => {
      setTimeout(() => {
        resolve({
          prescription: `
            *** Prescription for ${patientInfo.name} ***

            Date: ${new Date().toLocaleDateString()}
            Age: ${patientInfo.age}, Gender: ${patientInfo.gender}

            Symptoms:
            ${symptoms || 'N/A'}

            Diagnosis:
            ${diagnosis || 'N/A'}

            Medications:
            1. Paracetamol 500mg - 1 tablet, 3 times a day after food for 3 days.
            2. Amoxicillin 250mg - 1 capsule, 2 times a day for 5 days.
            (Detailed dosage and instructions as per doctor's discretion)

            Notes:
            ${notes || 'N/A'}

            Patient's Medical History: ${patientInfo.medicalHistory || 'None'}
            Allergies: ${patientInfo.allergies || 'None'}

            ---
            Dr. Abhinand Choudry
            Endocrinologist
            City Hospital
          `
        });
      }, 2000);
    });
  }
};

const speechService = {
  getFinalTranscript: () => "This is a mock final transcript.",
  detectLanguageFromAudio: async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      const reader = new FileReader();
      
      return new Promise<string>((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64Audio = (reader.result as string).split(',')[1];
            const response = await fetch('http://localhost:8000/api/speech/detect-language', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ audioContent: base64Audio })
            });
            const data = await response.json();
            resolve(data.language || 'en-US');
          } catch (error) {
            console.error('Language detection error:', error);
            resolve('en-US');
          }
        };
        reader.onerror = () => resolve('en-US');
        reader.readAsDataURL(audioBlob);
      });
    } catch (error) {
      console.error('Audio processing error:', error);
      return 'en-US';
    }
  }
};

const transcriptAnalysisService = {
  analyzeTranscript: async (text: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/transcript/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        symptoms: Array.isArray(data.symptoms) ? data.symptoms : [data.symptoms].filter(Boolean),
        diagnosis: data.diagnosis || 'No diagnosis provided',
        notes: data.notes || 'No additional notes'
      };
    } catch (error) {
      console.error('Transcript analysis error:', error);
      throw error;
    }
  }
};

const useSpeechToText = ({ language, continuous, interimResults }: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(1000); // Increased chunk size for better handling
      setIsRecording(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      console.log('Audio blob size:', audioBlob.size, 'bytes');
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          console.log('Base64 audio length:', base64Audio.length);
          
          const response = await fetch('http://localhost:8000/api/speech/transcribe', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ 
              audioContent: base64Audio,
              languageCode: language,
              enableAutomaticPunctuation: true,
              model: 'latest_long' // Changed to latest_long for longer audio
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            const timestamp = new Date().toLocaleTimeString();
            const newText = data.transcript || '';
            if (newText.trim()) {
              setTranscript(prev => prev + `[${timestamp}] ${newText}\n`);
            }
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Transcription failed:', response.status, errorData);
            setError(`Transcription failed: ${errorData.error || response.statusText}`);
          }
        } catch (error) {
          console.error('Transcription error:', error);
          setError(`Transcription error: ${error}`);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('Failed to read audio file');
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Audio processing error:', error);
      setError(`Audio processing error: ${error}`);
    }
  };

  return { isRecording, transcript, error, startRecording, stopRecording };
};

// Placeholder images
const xrayImage = "https://placehold.co/150x100/aabbcc/ffffff?text=X-Ray";
const ecgImage = "https://placehold.co/150x100/ccbbaa/ffffff?text=ECG";
const bloodReportImage = "https://placehold.co/150x100/bbaacc/ffffff?text=Blood+Report";


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
  const [recordingTime, setRecordingTime] = useState(0); // New state for recording timer
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for timer interval

  // Medical record generation states
  const [medicalRecord, setMedicalRecord] = useState({
    symptoms: '',
    diagnosis: '',
    recommendation: '',
    notes: '',
    proceduresPerformed: ''
  });
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);

  // Speech-to-text functionality
  const {
    isRecording,
    transcript: speechTranscript,
    error: speechError,
    startRecording,
    stopRecording,
  } = useSpeechToText({
    language: selectedLanguage,
    continuous: true,
    interimResults: true
  });

  // Update local transcript state when speechTranscript from hook changes
  useEffect(() => {
    setTranscript(speechTranscript);
  }, [speechTranscript]);

  // Effect to manage the recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0); // Reset timer when not recording
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    console.log('Transcript state:', transcript);
    console.log('SpeechTranscript from hook:', speechTranscript);
    console.log('Analyze button disabled:', isAnalyzing || !transcript.trim());
  }, [transcript, speechTranscript, isAnalyzing]);
  // Remove auto-translate effect - translation will be manual only

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

  const handleGenerateMedicalRecord = async () => {
    try {
      if (!transcript.trim()) {
        toast.error('No transcript to analyze');
        return;
      }

      setIsAnalyzing(true);
      toast.info('Generating medical record...');
      
      const analysis = await transcriptAnalysisService.analyzeTranscript(transcript);
      
      const symptoms = Array.isArray(analysis.symptoms) ? analysis.symptoms.join(', ') : analysis.symptoms;
      const recommendation = generateRecommendation(analysis.diagnosis, symptoms);
      const proceduresPerformed = generateProcedures(analysis.diagnosis);
      
      setMedicalRecord({
        symptoms,
        diagnosis: analysis.diagnosis,
        recommendation,
        notes: analysis.notes,
        proceduresPerformed
      });
      
      setSymptoms(symptoms);
      setDiagnosis(analysis.diagnosis);
      setNotes(analysis.notes);
      setShowMedicalRecord(true);
      
      toast.success('Medical record generated successfully!');
    } catch (error: any) {
      console.error('Error generating medical record:', error);
      toast.error('Failed to generate medical record');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRecommendation = (diagnosis: string, symptoms: string): string => {
    const recommendations = [];
    
    if (diagnosis.toLowerCase().includes('cold') || symptoms.toLowerCase().includes('cough')) {
      recommendations.push('Rest and adequate hydration');
      recommendations.push('Warm salt water gargling');
      recommendations.push('Avoid cold beverages');
    }
    
    if (symptoms.toLowerCase().includes('fever')) {
      recommendations.push('Monitor temperature regularly');
      recommendations.push('Take prescribed antipyretics as needed');
    }
    
    if (symptoms.toLowerCase().includes('headache')) {
      recommendations.push('Adequate rest in a quiet environment');
      recommendations.push('Apply cold compress if needed');
    }
    
    recommendations.push('Follow up if symptoms persist or worsen');
    recommendations.push('Complete the prescribed medication course');
    
    return '• ' + recommendations.join('\n• ');
  };

  const generateProcedures = (diagnosis: string): string => {
    const procedures = [];
    
    procedures.push('Physical examination conducted');
    procedures.push('Vital signs recorded');
    
    if (diagnosis.toLowerCase().includes('respiratory') || diagnosis.toLowerCase().includes('cold')) {
      procedures.push('Chest auscultation performed');
      procedures.push('Throat examination conducted');
    }
    
    if (diagnosis.toLowerCase().includes('fever')) {
      procedures.push('Temperature monitoring');
    }
    
    procedures.push('Patient counseling provided');
    procedures.push('Treatment plan explained to patient');
    
    return '• ' + procedures.join('\n• ');
  };

  const handleStartRecordingClick = async () => {
    try {
      if (isRecording) {
        stopRecording();
        toast.success('Recording stopped');
      } else {
        setTranscript('');
        await startRecording();
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

      mediaRecorder.start(1000); // Increased chunk size
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
  };

  const handleTestAPI = async () => {
    try {
      toast.info('Testing API connection...');
      const response = await fetch('http://localhost:8000/api/speech/transcribe', {
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
  {/* Redesigned Prescription Pad content */}
  <div className="flex flex-col h-full">
    <div className="flex gap-4 h-full">
      {/* Left side - Main content */}
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="transcript" className="w-full flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="record">Record</TabsTrigger>
            </TabsList>
            <div className="text-sm text-gray-600">
              Genix AI can auto detect your language and translate it to English.
            </div>
          </div>

          <TabsContent value="transcript" className="flex-1 flex flex-col">
            {/* Content for Transcript tab */}
            <div className="flex flex-col h-full border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mic className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{formatTime(recordingTime)}</span>
                </div>
                <Button
                  onClick={handleStartRecordingClick}
                  className={isRecording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </div>
              <Textarea
                value={transcript + (translation ? '\n\n--- Translation ---\n' + translation : '')}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Transcript with timestamps will appear here...\n\n[00:00:00] Patient says: I have been experiencing headaches for the past week...\n[00:00:15] Doctor asks: Can you describe the intensity of the pain?"
                className="flex-1 min-h-[200px] border-0 focus-visible:ring-0 p-0 resize-none font-mono text-sm"
              />
              <div className="mt-4 flex items-center justify-center">
                <div className="w-24 h-24 flex items-center justify-center ">
                  <img src={MaskGroup} alt="AI Assistant" className="w-12 h-12" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="record" className="flex-1 flex flex-col p-4 bg-white rounded-lg border">
            {/* Content for Record tab - as per new image */}
            {!showMedicalRecord ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                  <img src="/src/assets/Mask group.jpg" alt="AI Assistant" className="w-12 h-12" />
                </div>
                <p className="text-gray-700 text-center mb-6">
                  Use Genix AI to generate medical report of this consultation.
                </p>
                <Button
                  onClick={handleGenerateMedicalRecord}
                  disabled={isAnalyzing || !transcript.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Medical Record'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Symptoms</h3>
                  <p className="text-gray-700">{medicalRecord.symptoms}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
                  <p className="text-gray-700">{medicalRecord.diagnosis}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Recommendation</h3>
                  <p className="text-gray-700 whitespace-pre-line">{medicalRecord.recommendation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Notes</h3>
                  <p className="text-gray-700">{medicalRecord.notes}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">Procedures Performed</h3>
                  <p className="text-gray-700 whitespace-pre-line">{medicalRecord.proceduresPerformed}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side - Translation section */}
      <div className="w-80 flex flex-col">
        <div className="bg-white border rounded-lg p-4 h-full">
          <h3 className="font-semibold text-lg mb-4">Translation Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Language
              </label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectGroup>
                    <SelectLabel>Indian Languages</SelectLabel>
                    <SelectItem value="hi-IN">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="bn-IN">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="te-IN">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="ta-IN">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="mr-IN">Marathi (মराठী)</SelectItem>
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

            <div className="flex items-center justify-center py-2">
              <ArrowLeftRight className="w-5 h-5 text-gray-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Language
              </label>
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
                    <SelectItem value="mr-IN">Marathi (মराठী)</SelectItem>
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
            
            <Button
              onClick={handleManualTranslate}
              disabled={isTranslating || !transcript.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </Button>
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
};

export default DoctorAppointments;
