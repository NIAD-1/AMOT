import { api } from './api';

export const reportsService = {
  getDashboard: async (filters: Record<string, any> = {}) => {
    const query = new URLSearchParams(filters).toString();
    return api.get(`/reports/dashboard?${query}`);
  },
  
  exportObservationsCsv: async (filters: Record<string, any> = {}) => {
    const query = new URLSearchParams(filters).toString();
    return api.downloadCsv(`/reports/export/observations?${query}`, 'observations.csv');
  },
  
  exportFindingsCsv: async (filters: Record<string, any> = {}) => {
    const query = new URLSearchParams(filters).toString();
    return api.downloadCsv(`/reports/export/findings?${query}`, 'findings.csv');
  },
  
  exportSchedulesCsv: async (filters: Record<string, any> = {}) => {
    const query = new URLSearchParams(filters).toString();
    return api.downloadCsv(`/reports/export/schedules?${query}`, 'schedules.csv');
  },
  
  exportAuditLogsCsv: async (filters: Record<string, any> = {}) => {
    const query = new URLSearchParams(filters).toString();
    return api.downloadCsv(`/reports/export/audit-logs?${query}`, 'audit-logs.csv');
  }
};
