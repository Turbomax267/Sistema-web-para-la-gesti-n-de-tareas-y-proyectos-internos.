import { ApiSuccessResponse } from '../interfaces/api.interface';

export async function mockResponse<T>(message: string, data: T): Promise<ApiSuccessResponse<T>> {
  await new Promise((resolve) => setTimeout(resolve, 220));

  return {
    success: true,
    message,
    data,
  };
}
