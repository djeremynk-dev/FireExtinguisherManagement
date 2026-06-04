import { apiClient } from './client';
import type { ApiResponse, FireExtinguisher } from '../types';

export const extinguishersApi = {
  list: () => apiClient.get<ApiResponse<FireExtinguisher[]>>('/extinguishers'),
  get: (id: string) => apiClient.get<ApiResponse<FireExtinguisher>>(`/extinguishers/${id}`),
  create: (body: Omit<FireExtinguisher, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<FireExtinguisher>>('/extinguishers', body),
  update: (id: string, body: Partial<FireExtinguisher>) =>
    apiClient.patch<ApiResponse<FireExtinguisher>>(`/extinguishers/${id}`, body),
  remove: (id: string) => apiClient.delete<ApiResponse<unknown>>(`/extinguishers/${id}`)
};
