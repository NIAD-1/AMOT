import { api } from './api';

export const observationsService = {
  list: async (filters: Record<string, any> = {}, page = 1, limit = 10) => {
    const query = new URLSearchParams({ ...filters, page: String(page), limit: String(limit) }).toString();
    return api.get(`/observations?${query}`);
  },
  
  getById: async (id: string) => {
    return api.get(`/observations/${id}`);
  },
  
  create: async (data: any) => {
    return api.post('/observations', data);
  },
  
  update: async (id: string, data: any) => {
    return api.patch(`/observations/${id}`, data);
  }
};
