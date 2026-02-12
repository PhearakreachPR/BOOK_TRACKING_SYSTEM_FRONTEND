export enum BookStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REFERENCE = 'reference',
  ARCHIVED = 'archived'
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  status: BookStatus;
  category_id?: number;
  category?: BookCategory;
  copies?: BookCopy[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BookCategory {
  category_id: number;
  categoryName: string;
  description?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn?: string;
  status?: BookStatus;
  category_id?: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  status?: BookStatus;
  category_id?: number;
}

// Book Copy Types
export enum CopyStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  MAINTENANCE = 'maintenance',
  LOST = 'lost',
  DAMAGED = 'damaged'
}

export interface BookCopy {
  id: number;
  barcode: string;
  call_number?: string;
  status: CopyStatus;
  acquisition_date?: Date;
  notes?: string;
  book_id: number;
  book?: Book;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookCopyDto {
  barcode: string;
  call_number?: string;
  status?: CopyStatus;
  acquisition_date?: Date;
  notes?: string;
  book_id: number;
}

export interface UpdateBookCopyDto {
  barcode?: string;
  call_number?: string;
  status?: CopyStatus;
  acquisition_date?: Date;
  notes?: string;
  book_id?: number;
}

export interface BulkCreateCopiesDto {
  book_id: number;
  copies: Array<{
    barcode: string;
    call_number?: string;
    status?: CopyStatus;
    acquisition_date?: Date;
    notes?: string;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BookStats {
  totalBooks: number;
  activeBooks: number;
  inactiveBooks: number;
  referenceBooks: number;
  archivedBooks: number;
}

export interface CopyStats {
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  maintenanceCopies: number;
  lostCopies: number;
  damagedCopies: number;
}