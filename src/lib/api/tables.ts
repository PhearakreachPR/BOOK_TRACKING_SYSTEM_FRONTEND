import { apiClient, type ApiResponse } from './api';

export interface ReadingTable {
  id: string;
  tableCode: string;
  qrCode: string;
  tableNumber?: string;
  capacity?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableDto {
  tableCode: string;
  qrCode?: string;
  tableNumber?: string;
  capacity?: number;
  description?: string;
}

export interface UpdateTableDto {
  tableCode?: string;
  tableNumber?: string;
  capacity?: number;
  description?: string;
}

export const tablesApi = {
  getAll: async (): Promise<ApiResponse<ReadingTable[]>> => {
    return await apiClient.get<ReadingTable[]>('/reading-tables');
  },

  getById: async (id: string): Promise<ApiResponse<ReadingTable>> => {
    return await apiClient.get<ReadingTable>(`/reading-tables/${id}`);
  },

  create: async (data: CreateTableDto): Promise<ApiResponse<ReadingTable>> => {
    return await apiClient.post<ReadingTable>('/reading-tables', data);
  },

  update: async (id: string, data: UpdateTableDto): Promise<ApiResponse<ReadingTable>> => {
    return await apiClient.patch<ReadingTable>(`/reading-tables/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<void>(`/reading-tables/${id}`);
  },

  getQRImage: async (id: string): Promise<ApiResponse<{ id: string; qrCode: string }>> => {
    return await apiClient.get(`/reading-tables/${id}/qr-image`);
  },

  getQRDownloadUrl: (id: string): string => {
    return `${apiClient.baseUrl}/reading-tables/${id}/qr-download`;
  },
};