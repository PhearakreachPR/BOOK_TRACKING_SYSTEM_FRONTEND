import { apiClient, type ApiResponse } from './api';

export interface Shelf {
  id: string;
  shelfCode: string;
  qrCode: string;
  section?: string;
  rowNumber?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShelfDto {
  shelfCode: string;
  qrCode?: string;
  section?: string;
  rowNumber?: string;
  description?: string;
}

export interface UpdateShelfDto {
  shelfCode?: string;
  section?: string;
  rowNumber?: string;
  description?: string;
}

export const shelvesApi = {
  getAll: async (): Promise<ApiResponse<Shelf[]>> => {
    return await apiClient.get<Shelf[]>('/shelves');
  },

  getById: async (id: string): Promise<ApiResponse<Shelf>> => {
    return await apiClient.get<Shelf>(`/shelves/${id}`);
  },

  create: async (data: CreateShelfDto): Promise<ApiResponse<Shelf>> => {
    return await apiClient.post<Shelf>('/shelves', data);
  },

  update: async (id: string, data: UpdateShelfDto): Promise<ApiResponse<Shelf>> => {
    return await apiClient.patch<Shelf>(`/shelves/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(`/shelves/${id}`);
  },

  getQRImage: async (id: string): Promise<ApiResponse<{ id: string; qrCode: string }>> => {
    return await apiClient.get(`/shelves/${id}/qr-image`);
  },

  getQRDownloadUrl: (id: string): string => {
    return `${apiClient.baseUrl}/shelves/${id}/qr-download`;
  },
};