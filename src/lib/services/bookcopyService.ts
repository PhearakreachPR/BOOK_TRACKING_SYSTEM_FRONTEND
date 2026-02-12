import type {
  BookCopy,
  CreateBookCopyDto,
  UpdateBookCopyDto,
  BulkCreateCopiesDto,
  ApiResponse,
  CopyStats,
  CopyStatus
} from '../types/book.type';

const API_URL = 'http://localhost:3000';

class BookCopyService {
  /**
   * Build full API URL
   */
  private buildUrl(endpoint: string): string {
    return `${API_URL}${endpoint}`;
  }

  /**
   * Shared request handler (non-breaking, safe)
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`;
      try {
        const error = await response.json();
        message = error?.message || message;
      } catch {
        // keep default message if response is not JSON
      }
      throw new Error(message);
    }

    // Handle empty responses safely
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // =======================
  // Public API
  // =======================

  async getAllCopies(page = 1, limit = 10): Promise<ApiResponse<BookCopy[]>> {
    return this.request<ApiResponse<BookCopy[]>>(
      `/book-copies?page=${page}&limit=${limit}`
    );
  }

  async getCopyById(id: number): Promise<ApiResponse<BookCopy>> {
    return this.request<ApiResponse<BookCopy>>(`/book-copies/${id}`);
  }

  async getCopyByBarcode(barcode: string): Promise<ApiResponse<BookCopy>> {
    const encoded = encodeURIComponent(barcode);
    return this.request<ApiResponse<BookCopy>>(`/book-copies/barcode/${encoded}`);
  }

  async getCopiesByBookId(
    bookId: number,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<BookCopy[]>> {
    return this.request<ApiResponse<BookCopy[]>>(
      `/book-copies/book/${bookId}?page=${page}&limit=${limit}`
    );
  }

  async getAvailableCopies(page = 1, limit = 10): Promise<ApiResponse<BookCopy[]>> {
    return this.request<ApiResponse<BookCopy[]>>(
      `/book-copies/available?page=${page}&limit=${limit}`
    );
  }

  async searchCopies(
    searchTerm: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<BookCopy[]>> {
    const encoded = encodeURIComponent(searchTerm);
    return this.request<ApiResponse<BookCopy[]>>(
      `/book-copies/search?q=${encoded}&page=${page}&limit=${limit}`
    );
  }

  async createCopy(data: CreateBookCopyDto): Promise<ApiResponse<BookCopy>> {
    return this.request<ApiResponse<BookCopy>>('/book-copies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createMultipleCopies(data: {
    book_id: number;
    quantity: number;
    call_number?: string;
    status?: CopyStatus;
    acquisition_date?: Date | string;
    notes?: string;
    }): Promise<ApiResponse<BookCopy[]>> {
    return this.request<ApiResponse<BookCopy[]>>('/book-copies/multiple', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    }

  async bulkCreateCopies(data: BulkCreateCopiesDto): Promise<ApiResponse<BookCopy[]>> {
    // Safely map missing fields to defaults (non-breaking)
    const payload = {
      book_id: data.book_id,
      copies: data.copies.map(copy => ({
        barcode: copy.barcode,
        call_number: copy.call_number || undefined,
        status: copy.status || 'available',
        acquisition_date: copy.acquisition_date || undefined,
        notes: copy.notes || undefined
      }))
    };

    return this.request<ApiResponse<BookCopy[]>>('/book-copies/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateCopy(id: number, data: UpdateBookCopyDto): Promise<ApiResponse<BookCopy>> {
    return this.request<ApiResponse<BookCopy>>(`/book-copies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateCopyStatus(id: number, status: CopyStatus): Promise<ApiResponse<BookCopy>> {
    return this.request<ApiResponse<BookCopy>>(`/book-copies/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteCopy(
    id: number
  ): Promise<ApiResponse<{ id: number; barcode: string; book: string }>> {
    return this.request<ApiResponse<{ id: number; barcode: string; book: string }>>(
      `/book-copies/${id}`,
      { method: 'DELETE' }
    );
  }

  async getCopyStats(): Promise<ApiResponse<CopyStats>> {
    return this.request<ApiResponse<CopyStats>>('/book-copies/stats');
  }
}

export const bookcopyService = new BookCopyService();
