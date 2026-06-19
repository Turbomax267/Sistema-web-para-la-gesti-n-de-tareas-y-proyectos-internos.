import apiClient from './axios';
import { ApiSuccessResponse } from '../interfaces/api.interface';
import { Usuario } from '../interfaces/usuario.interface';

export async function fetchUsuarios() {
  const { data } = await apiClient.get<ApiSuccessResponse<Usuario[]>>('/usuarios');
  return data;
}

