import { useState, useCallback, useEffect } from 'react';
import speechService from '../services/speechService';

interface UseSpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync with service recording state
  useEffect(() => {
    const checkRecordingState = () => {
      const serviceIsRecording = speechService.isCurrentlyRecording();
      if (serviceIsRecording !== isRecording) {
        setIsRecording(serviceIsRecording);
      }
    };

    // Check immediately
    checkRecordingState();

    // Set up interval to check recording state
    const interval = setInterval(checkRecordingState, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      await speechService.startRecording({
        language: options.language || 'en-US',
        continuous: options.continuous || true,
        interimResults: options.interimResults || true,
        onResult: (text) => {
          setTranscript(text);
        },
        onError: (err) => {
          setError(`Speech recognition error: ${err}`);
          setIsRecording(false);
        }
      });
      // Don't set isRecording here - let the useEffect sync it
      // setIsRecording(true);
    } catch (err) {
      setError(`Failed to start recording: ${err}`);
      setIsRecording(false);
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    speechService.stopRecording();
    // Don't set isRecording here - let the useEffect sync it
    // setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
    toggleRecording
  };
}