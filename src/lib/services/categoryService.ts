import api from './api';

/* ---------- Types (SAFE & FLEXIBLE) ---------- */

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface GetCategoriesParams extends PaginationParams {
  simple?: boolean;
}

interface CategoryData {
  categoryName: string;
  description?: string;
  iconType: 'preset' | 'custom';
  iconValue?: string;
  iconFile?: File;
}

interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  meta?: any;
  message?: string;
  error?: string;
}

/* ---------- Service ---------- */

const categoryService = {
  /**
   * Get all categories with pagination
   */
  async getCategories(
    params: GetCategoriesParams = {}
  ): Promise<ServiceResult> {
    try {
      const { page = 1, limit = 10, simple = false } = params;

      const queryParams = new URLSearchParams();

      if (simple) {
        queryParams.append('simple', 'true');
      } else {
        queryParams.append('page', String(page));
        queryParams.append('limit', String(limit));
      }

      const response = await api.get(`/book-categories?${queryParams}`);

      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta
      };
    } catch (error: any) {
      console.error('❌ Get categories error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch categories'
      };
    }
  },

  /**
   * Get single category by ID
   */
  async getCategory(id: number): Promise<ServiceResult> {
    try {
      const response = await api.get(`/book-categories/${id}`);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Get category error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch category'
      };
    }
  },

  /**
   * Create new category
   */
  async createCategory(
    categoryData: CategoryData
  ): Promise<ServiceResult> {
    try {
      const formData = new FormData();

      formData.append('categoryName', categoryData.categoryName);

      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }

      formData.append('iconType', categoryData.iconType);

      if (
        categoryData.iconType === 'preset' &&
        categoryData.iconValue
      ) {
        formData.append('iconValue', categoryData.iconValue);
      }

      if (
        categoryData.iconType === 'custom' &&
        categoryData.iconFile
      ) {
        formData.append('icon', categoryData.iconFile);
      }

      const response = await api.post(
        '/book-categories',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Create category error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to create category'
      };
    }
  },

  /**
   * Update category
   */
  async updateCategory(
    id: number,
    updateData: Partial<CategoryData>
  ): Promise<ServiceResult> {
    try {
      const response = await api.patch(
        `/book-categories/${id}`,
        updateData
      );

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Update category error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update category'
      };
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(id: number): Promise<ServiceResult> {
    try {
      const response = await api.delete(
        `/book-categories/${id}`
      );

      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Delete category error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to delete category'
      };
    }
  },

  /**
   * Search categories
   */
  async searchCategories(
    searchTerm: string,
    pagination: PaginationParams = {}
  ): Promise<ServiceResult> {
    try {
      const { page = 1, limit = 10 } = pagination;

      const response = await api.get(
        '/book-categories/search',
        {
          params: { q: searchTerm, page, limit }
        }
      );

      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta
      };
    } catch (error: any) {
      console.error('❌ Search categories error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to search categories'
      };
    }
  },

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<ServiceResult> {
    try {
      const response = await api.get(
        '/book-categories/stats'
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Get category stats error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to fetch statistics'
      };
    }
  }
};

export default categoryService;
