import api from './api';
import { authStore } from '$lib/stores/authStore';
import { get } from 'svelte/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:3000',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Refresh using COOKIE (no headers)
//         await axios.get(
//           `${API_URL}/authentication/refresh`,
//           { withCredentials: true }
//         );

//         // Retry the original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         authStore.logout();
//         window.location.href = '/auth';
//       }
//     }

//     return Promise.reject(error);
//   }
// );


const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const response = await api.post('/authentication/register', userData);
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  /**
   * Login user
   */
  async login(email, password, rememberMe = false) {
    try {
      const response = await api.post('/authentication/log-in', {
        email,
        password,
        rememberMe,
      });

      if (response.data?.user && response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        // Save tokens and user data
        authStore.login(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );

        return {
          success: true,
          user: response.data.user,
        };
      }

      return {
        success: false,
        error: 'Invalid response from server',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/authentication/log-out');
      // localStorage.removeItem('accessToken');
      authStore.logout();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server request fails
      authStore.logout();
      return { success: true };
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/authentication/me');
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user information',
      };
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken() {
    try {
      const response = await api.get('/authentication/refresh');
      localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data?.accessToken) {
        // authStore.setToken(response.data.accessToken);
        return {
          success: true,
          token: response.data.accessToken,
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false };
    }
  },

  /**
   * Change password (for authenticated users)
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/authentication/change-password', {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || 'Password changed successfully',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password',
      };
    }
  },

  /**
   * Request password reset (Forgot Password - Token method)
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/authentication/forgot-password', {
        email,
      });

      return {
        success: true,
        message: response.data.message || 'Password reset link sent to your email',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send password reset link',
      };
    }
  },

  /**
   * Reset password using token
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/authentication/reset-password', {
        token,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || 'Password reset successfully',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password',
      };
    }
  },

  /**
   * Request password reset OTP (Alternative method)
   */
  async requestResetOtp(email) {
    try {
      const response = await api.post('/authentication/request-reset-otp', {
        email,
      });

      return {
        success: true,
        message: response.data.message || 'OTP sent to your email',
      };
    } catch (error) {
      console.error('Request reset OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send OTP',
      };
    }
  },

  /**
   * Verify OTP and reset password
   */
  async verifyResetOtp(email, otp, newPassword) {
    try {
      const response = await api.post('/authentication/verify-reset-otp', {
        email,
        otp,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message || 'Password reset successfully',
      };
    } catch (error) {
      console.error('Verify reset OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid OTP or failed to reset password',
      };
    }
  },

  /**
   * Confirm email address
   */
  async confirmEmail(token) {
    try {
      const response = await api.post('/email-confirmation/confirm', {
        token,
      });

      return {
        success: true,
        message: response.data.message || 'Email confirmed successfully',
        email: response.data.email,
      };
    } catch (error) {
      console.error('Email confirmation error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to confirm email',
      };
    }
  },

  /**
   * Resend email confirmation
   */
  async resendConfirmationEmail() {
    try {
      const response = await api.post('/email-confirmation/resend-confirmation-link');

      return {
        success: true,
        message: response.data.message || 'Confirmation email sent',
      };
    } catch (error) {
      console.error('Resend confirmation error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resend confirmation email',
      };
    }
  },

  /**
   * Update user profile
   */
async updateProfile(userId, profileData) {
  try {
    const response = await api.patch(`/users/${userId}`, {
      name: profileData.name,
      phoneNumber: profileData.phoneNumber,
    });

    return {
      success: true,
      user: response.data,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile',
    };
  }
},

  /**
   * Get user by ID
   */
  async uploadAvatar(userId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        avatar: response.data,
      };
    } catch (error) {
      console.error('Upload avatar error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload avatar',
      };
    }
  },

  async deleteAvatar(userId) {
    try {
      await api.delete(`/users/${userId}/avatar`);
      return {
        success: true,
        message: 'Avatar deleted successfully',
      };
    } catch (error) {
      console.error('Delete avatar error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete avatar',
      };
    }
  },
};

export default authService;