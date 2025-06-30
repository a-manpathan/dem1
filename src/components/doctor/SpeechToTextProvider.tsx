import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface SpeechToTextContextType {
  isRecording: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  toggleRecording: () => void;
}

const SpeechToTextContext = createContext<SpeechToTextContextType | undefined>(undefined);

export const useSpeechToTextContext = () => {
  const context = useContext(SpeechToTextContext);
  if (!context) {
    throw new Error('useSpeechToTextContext must be used within a SpeechToTextProvider');
  }
  return context;
};

interface SpeechToTextProviderProps {
  children: React.ReactNode;
  language?: string;
  onTranscriptChange?: (transcript: string) => void;
}

export const SpeechToTextProvider: React.FC<SpeechToTextProviderProps> = ({ 
  children, 
  language = 'en-US',
  onTranscriptChange 
}) => {
  const { 
    isRecording, 
    transcript, 
    error, 
    startRecording, 
    stopRecording, 
    toggleRecording 
  } = useSpeechToText({ language });

  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const contextValue = useMemo(() => ({
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    toggleRecording
  }), [isRecording, transcript, error, startRecording, stopRecording, toggleRecording]);

  return (
    <SpeechToTextContext.Provider value={contextValue}>
      {children}
    </SpeechToTextContext.Provider>
  );
};