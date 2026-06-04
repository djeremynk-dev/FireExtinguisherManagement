import { apiClient } from './client';
import type { ApiResponse, User, UserRole } from '../types';

export const usersApi = {
  me: () => apiClient.get<ApiResponse<User>>('/users/me'),
  updateMe: (body: Partial<User>) => apiClient.patch<ApiResponse<User>>('/users/me', body),
  list: (params?: { role?: UserRole; search?: string }) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params }),
  get: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),
  update: (id: string, body: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, body),
  remove: (id: string) => apiClient.delete<ApiResponse<unknown>>(`/users/${id}`)
};
