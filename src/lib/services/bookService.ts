import type {
  Book,
  CreateBookDto,
  UpdateBookDto,
  ApiResponse,
  BookStats
} from '../types/book.type';

const API_URL = 'http://localhost:3000';

class BookService {
  /**
   * Build full API URL
   */
  private buildUrl(endpoint: string): string {
    return `${API_URL}${endpoint}`;
  }

  /**
   * Shared request handler
   * Keeps the same behavior as before
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
        // keep default message
      }

      throw new Error(message);
    }

    // Safely handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // =======================
  // Public API (UNCHANGED)
  // =======================

  async getAllBooks(simple = false): Promise<ApiResponse<Book[]>> {
    const query = simple ? '?simple=true' : '';
    return this.request<ApiResponse<Book[]>>(`/books${query}`);
  }

  async getBookById(id: number): Promise<ApiResponse<Book>> {
    return this.request<ApiResponse<Book>>(`/books/${id}`);
  }

  async createBook(data: CreateBookDto): Promise<ApiResponse<Book>> {
    return this.request<ApiResponse<Book>>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBook(
    id: number,
    data: UpdateBookDto
  ): Promise<ApiResponse<Book>> {
    return this.request<ApiResponse<Book>>(`/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBook(id: number): Promise<ApiResponse<{ id: number }>> {
    return this.request<ApiResponse<{ id: number }>>(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  async searchBooks(searchTerm: string): Promise<ApiResponse<Book[]>> {
    const encoded = encodeURIComponent(searchTerm);
    return this.request<ApiResponse<Book[]>>(
      `/books/search?q=${encoded}`
    );
  }

  async getAvailableBooks(): Promise<ApiResponse<Book[]>> {
    return this.request<ApiResponse<Book[]>>('/books/available');
  }

  async getBooksByCategory(
    categoryId: number
  ): Promise<ApiResponse<Book[]>> {
    return this.request<ApiResponse<Book[]>>(
      `/books/category/${categoryId}`
    );
  }

  async getBookStats(): Promise<ApiResponse<BookStats>> {
    return this.request<ApiResponse<BookStats>>('/books/stats');
  }
}

export const bookService = new BookService();
