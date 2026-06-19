import apiClient from './axios';
import { ApiSuccessResponse } from '../interfaces/api.interface';
import { HistorialItem } from '../interfaces/historial.interface';
import { Tarea, TareaFilters, TareaPayload, TareaEstado } from '../interfaces/tarea.interface';

export async function fetchTareas(filters?: Partial<TareaFilters>) {
  const cleanParams = Object.fromEntries(
    Object.entries(filters || {}).filter(([, value]) => value !== undefined && value !== ''),
  );
  const { data } = await apiClient.get<ApiSuccessResponse<Tarea[]>>('/tareas', { params: cleanParams });
  return data;
}

export async function createTarea(payload: TareaPayload) {
  const { data } = await apiClient.post<ApiSuccessResponse<Tarea>>('/tareas', payload);
  return data;
}

export async function updateTarea(id: number, payload: TareaPayload) {
  const { data } = await apiClient.put<ApiSuccessResponse<Tarea>>(`/tareas/${id}`, payload);
  return data;
}

export async function patchEstadoTarea(id: number, estado: TareaEstado) {
  const { data } = await apiClient.patch<ApiSuccessResponse<Tarea>>(`/tareas/${id}/estado`, { estado });
  return data;
}

export async function removeTarea(id: number) {
  const { data } = await apiClient.delete<ApiSuccessResponse<Record<string, never>>>(`/tareas/${id}`);
  return data;
}

export async function fetchHistorialTarea(id: number) {
  const { data } = await apiClient.get<ApiSuccessResponse<HistorialItem[]>>(`/tareas/${id}/historial`);
  return data;
}

