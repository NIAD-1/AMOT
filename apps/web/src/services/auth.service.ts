import { api } from './api';

export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  
  logout: async () => {
    return api.post('/auth/logout');
  },
  
  getMe: async () => {
    return api.get('/auth/me');
  },
  
  register: async (data: any) => {
    return api.post('/auth/register', data);
  }
};
