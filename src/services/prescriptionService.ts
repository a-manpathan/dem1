import axios from 'axios';

interface PrescriptionRequest {
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
    medicalHistory?: string;
    allergies?: string;
  };
}

interface PrescriptionResponse {
  prescription: string;
  generatedAt: string;
  disclaimer: string;
}

class PrescriptionService {
  private readonly apiUrl = 'https://backendgen-hgewftfphagrcbg7.southindia-01.azurewebsites.net/api/prescription';
 

  async generatePrescription(request: PrescriptionRequest): Promise<PrescriptionResponse> {
    try {
      if (!request.symptoms && !request.diagnosis && !request.notes) {
        throw new Error('At least one of symptoms, diagnosis, or notes is required');
      }

      console.log('Generating prescription with data:', {
        symptoms: request.symptoms?.substring(0, 100) + '...',
        diagnosis: request.diagnosis?.substring(0, 100) + '...',
        notes: request.notes?.substring(0, 100) + '...',
        patientInfo: request.patientInfo?.name || 'Unknown'
      });

      const response = await axios.post(`${this.apiUrl}/generate`, request, {
        timeout: 60000, // 60 second timeout for AI generation
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.prescription) {
        console.log('Prescription generated successfully');
        return response.data;
      } else {
        throw new Error('Invalid response from prescription service');
      }
    } catch (error) {
      console.error('Prescription generation error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Prescription generation failed: ${error.response.data?.error || error.message}`);
        } else if (error.request) {
          throw new Error('Network error: Unable to reach prescription service');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      } else {
        throw error;
      }
    }
  }

  // Helper method to validate prescription request
  validateRequest(request: PrescriptionRequest): string[] {
    const errors: string[] = [];

    if (!request.symptoms && !request.diagnosis && !request.notes) {
      errors.push('At least one of symptoms, diagnosis, or notes must be provided');
    }

    if (request.symptoms && request.symptoms.trim().length < 5) {
      errors.push('Symptoms must be at least 5 characters long');
    }

    if (request.diagnosis && request.diagnosis.trim().length < 5) {
      errors.push('Diagnosis must be at least 5 characters long');
    }

    return errors;
  }

  // Helper method to format prescription for display
  formatPrescription(prescription: string): string {
    // Add some basic formatting to make the prescription more readable
    return prescription
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/- /g, '• '); // Bullet points
  }
}

export default new PrescriptionService();
