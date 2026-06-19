import apiClient from './axios';
import { ApiSuccessResponse } from '../interfaces/api.interface';
import { Proyecto, ProyectoPayload } from '../interfaces/proyecto.interface';

export async function fetchProyectos() {
  const { data } = await apiClient.get<ApiSuccessResponse<Proyecto[]>>('/proyectos');
  return data;
}

export async function createProyecto(payload: ProyectoPayload) {
  const { data } = await apiClient.post<ApiSuccessResponse<Proyecto>>('/proyectos', payload);
  return data;
}

export async function updateProyecto(id: number, payload: ProyectoPayload) {
  const { data } = await apiClient.put<ApiSuccessResponse<Proyecto>>(`/proyectos/${id}`, payload);
  return data;
}

export async function removeProyecto(id: number) {
  const { data } = await apiClient.delete<ApiSuccessResponse<Record<string, never>>>(`/proyectos/${id}`);
  return data;
}

