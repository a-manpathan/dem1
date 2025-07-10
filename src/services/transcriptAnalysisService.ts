import axios from 'axios';

interface TranscriptAnalysisRequest {
  transcript: string;
}

interface TranscriptAnalysisResponse {
  symptoms: string[];
  diagnosis: string;
  notes: string;
}

class TranscriptAnalysisService {
  private readonly apiUrl = 'http://localhost:8000/api/transcript/analyze';

  async analyzeTranscript(transcript: string): Promise<TranscriptAnalysisResponse> {
    try {
      const response = await axios.post<TranscriptAnalysisResponse>(this.apiUrl, {
        transcript
      });

      return response.data;
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      throw error;
    }
  }
}

export const transcriptAnalysisService = new TranscriptAnalysisService();
