import { getUsuarios } from '../lib/mockData';
import { mockResponse } from './mockHelpers';

export async function fetchUsuarios() {
  return mockResponse('Usuarios obtenidos correctamente', getUsuarios());
}
