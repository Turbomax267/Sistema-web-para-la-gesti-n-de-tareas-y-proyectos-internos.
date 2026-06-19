import apiClient from './axios';
import { ApiSuccessResponse } from '../interfaces/api.interface';
import { DashboardSummary } from '../interfaces/dashboard.interface';

export async function fetchDashboard() {
  const { data } = await apiClient.get<ApiSuccessResponse<DashboardSummary>>('/dashboard/resumen');
  return data;
}

