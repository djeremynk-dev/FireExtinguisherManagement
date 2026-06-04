import { apiClient } from './client';
import type { ApiResponse, MaintenanceLog } from '../types';

export const maintenanceApi = {
  list: () => apiClient.get<ApiResponse<MaintenanceLog[]>>('/maintenance'),
  create: (body: {
    extinguisherId: string;
    maintenanceType: string;
    serviceDate: string;
    details: string;
    inspectorId?: string;
    status?: string;
    notes?: string;
  }) => apiClient.post<ApiResponse<MaintenanceLog>>('/maintenance', body),
  update: (id: string, body: Partial<MaintenanceLog>) =>
    apiClient.patch<ApiResponse<MaintenanceLog>>(`/maintenance/${id}`, body),
  remove: (id: string) => apiClient.delete<ApiResponse<unknown>>(`/maintenance/${id}`)
};
