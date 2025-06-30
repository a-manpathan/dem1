import { useEffect } from 'react';
import { useSpeechToTextContext } from './SpeechToTextProvider';

interface SpeechToTextInitializerProps {
  isRecording: boolean;
  onTranscriptChange: (transcript: string) => void;
  onToggleRecording: () => void;
}

const SpeechToTextInitializer: React.FC<SpeechToTextInitializerProps> = ({
  isRecording,
  onTranscriptChange,
  onToggleRecording
}) => {
  const { transcript, toggleRecording } = useSpeechToTextContext();

  // Update parent component's transcript state when our transcript changes
  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  // Toggle recording when parent component's isRecording state changes
  useEffect(() => {
    const handleToggle = () => {
      toggleRecording();
      onToggleRecording();
    };

    // This is a custom event we'll dispatch from DoctorAppointments.tsx
    document.addEventListener('toggle-recording', handleToggle);
    
    return () => {
      document.removeEventListener('toggle-recording', handleToggle);
    };
  }, [toggleRecording, onToggleRecording]);

  return null; // This is a non-visual component
};

export default SpeechToTextInitializer;