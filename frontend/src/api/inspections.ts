import { apiClient } from './client';
import type { ApiResponse, Inspection } from '../types';

export const inspectionsApi = {
  list: () => apiClient.get<ApiResponse<Inspection[]>>('/inspections'),
  get: (id: string) => apiClient.get<ApiResponse<Inspection>>(`/inspections/${id}`),
  schedule: (body: {
    extinguisherId: string;
    scheduledDate: string;
    scheduledTime: string;
    inspectorId?: string;
    notes?: string;
  }) => apiClient.post<ApiResponse<Inspection>>('/inspections', body),
  update: (id: string, body: Partial<Inspection>) =>
    apiClient.patch<ApiResponse<Inspection>>(`/inspections/${id}`, body),
  remove: (id: string) => apiClient.delete<ApiResponse<unknown>>(`/inspections/${id}`)
};
