import { apiClient } from './client';
import type { ApiResponse, User } from '../types';

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => apiClient.post<ApiResponse<AuthPayload>>('/auth/register', body),

  login: (body: { email: string; password: string }) =>
    apiClient.post<ApiResponse<AuthPayload>>('/auth/login', body),

  logout: () => apiClient.post<ApiResponse<{ message: string }>>('/auth/logout'),

  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<{ message: string; resetToken?: string }> & { message?: string; resetToken?: string }>(
      '/auth/forgot-password',
      { email }
    ),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch<ApiResponse<{ message: string }>>('/auth/change-password', {
      currentPassword,
      newPassword
    }),

  updateProfile: (body: Partial<Pick<User, 'firstName' | 'lastName' | 'phoneNumber'>>) =>
    apiClient.patch<ApiResponse<User>>('/auth/profile', body)
};
