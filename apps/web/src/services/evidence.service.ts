import { api } from './api';

export const evidenceService = {
  getUploadUrl: async (sha256: string, mimeType: string, byteLength: number, idempotencyKey: string) => {
    return api.post('/evidence/upload-url', { sha256, mimeType, byteLength, idempotencyKey });
  },
  
  commitEvidence: async (data: any) => {
    return api.post('/evidence/commit', data);
  },
  
  uploadToPresigned: async (url: string, file: File) => {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file to presigned URL');
    }
  },
  
  listByObservation: async (observationId: string) => {
    return api.get(`/evidence/observation/${observationId}`);
  },
  
  getById: async (id: string) => {
    return api.get(`/evidence/${id}`);
  }
};
