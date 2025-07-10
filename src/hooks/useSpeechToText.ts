// useSpeechToText.ts
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

  useEffect(() => {
    const checkRecordingState = () => {
      const serviceIsRecording = speechService.isCurrentlyRecording();
      if (serviceIsRecording !== isRecording) {
        setIsRecording(serviceIsRecording);
        if (!serviceIsRecording) {
          const finalTranscript = speechService.getFinalTranscript();
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
        }
      }
    };

    const interval = setInterval(checkRecordingState, 100);
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript(''); // Clear previous transcript
      await speechService.startRecording({
        language: options.language || 'en-US',
        continuous: options.continuous || true,
        interimResults: options.interimResults || true,
        onResult: (text) => {
          console.log('SpeechService onResult:', text);
          setTranscript(text);
        },
        onError: (err) => {
          setError(`Speech recognition error: ${err}`);
          setIsRecording(false);
        },
        onEnd: () => {
          console.log('SpeechService onEnd');
          const finalTranscript = speechService.getFinalTranscript();
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
          setIsRecording(false);
        }
      });
    } catch (err) {
      setError(`Failed to start recording: ${err}`);
      setIsRecording(false);
    }
  }, [options]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording in hook');
    speechService.stopRecording();
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