import { apiClient } from './client';
import type { ApiResponse } from '../types';

export const reportsApi = {
  summary: (params?: { from?: string; to?: string }) =>
    apiClient.get<ApiResponse<{ extinguishers: number; inspections: number; maintenanceLogs: number }>>(
      '/reporting/summary',
      { params }
    ),
  extinguisherStats: (params?: Record<string, string>) =>
    apiClient.get<ApiResponse<unknown>>('/reporting/extinguishers', { params }),
  inspectionStats: (params?: Record<string, string>) =>
    apiClient.get<ApiResponse<unknown>>('/reporting/inspections', { params }),
  maintenanceStats: (params?: Record<string, string>) =>
    apiClient.get<ApiResponse<unknown>>('/reporting/maintenance', { params })
};
