import api from './api';
import type { AxiosError } from 'axios';

interface User {
  id?: number;
  email?: string;
  role?: string;
  isEmailConfirmed?: boolean;
  [key: string]: any;
}

interface ServiceResult {
  success: boolean;
  error?: string;
}

interface LoginResult extends ServiceResult {
  user?: User;
}

interface GetCurrentUserResult extends ServiceResult {
  user?: User;
}

interface RegisterResult extends ServiceResult {
  data?: {
    user: User;
    accessToken: string;
    refreshToken?: string;
    needsEmailVerification?: boolean;
  };
}

/* ---------- Service ---------- */

const authService = {
  /**
   * Get current authenticated user
   * Called on app initialization
   */
  async getCurrentUser(): Promise<GetCurrentUserResult> {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.log(' No access token found');
        return { success: false, error: 'No token found' };
      }

      console.log(' Validating token with backend...');

      const response = await api.get('/authentication/me');

      console.log(' Token validated, user data received');

      return {
        success: true,
        user: response.data.user
      };
    } catch (error: any) {
      console.error(' Get current user error:', error);

      if ((error as AxiosError)?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to get user'
      };
    }
  },

  /**
   * Login user
   */
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResult> {
    try {
      console.log(' Logging in...', email);

      const response = await api.post('/authentication/log-in', {
        email,
        password,
        rememberMe
      });

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log(' Login successful');

      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error(' Login error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Login failed'
      };
    }
  },

  /**
   * Register new user
   */
  async register(userData: Record<string, any>): Promise<RegisterResult> {
    try {
      console.log(' Registering user...', userData.email);

      const response = await api.post('/authentication/register', userData);

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log(' Registration successful');

      return {
        success: true,
        data: {
          user,
          accessToken,
          refreshToken,
          needsEmailVerification: !user.isEmailConfirmed
        }
      };
    } catch (error: any) {
      console.error(' Registration error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Registration failed'
      };
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<ServiceResult> {
    try {
      console.log(' Logging out...');

      await api.post('/authentication/log-out');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      console.log(' Logout successful');

      return { success: true };
    } catch (error: any) {
      console.error(' Logout error:', error);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return {
        success: false,
        error: error?.message || 'Logout failed'
      };
    }
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ServiceResult> {
    try {
      await api.post('/authentication/change-password', {
        currentPassword,
        newPassword
      });

      return { success: true };
    } catch (error: any) {
      console.error(' Change password error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to change password'
      };
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ServiceResult> {
    try {
      await api.post('/authentication/forgot-password', { email });
      return { success: true };
    } catch (error: any) {
      console.error(' Forgot password error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to send reset email'
      };
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(): Promise<ServiceResult> {
    try {
      await api.post('/email-confirmation/resend-confirmation-link');
      return { success: true };
    } catch (error: any) {
      console.error(' Resend verification error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to send verification email'
      };
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<ServiceResult> {
    try {
      await api.post('/email-confirmation/confirm', { token });
      return { success: true };
    } catch (error: any) {
      console.error(' Email verification error:', error);

      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          'Failed to verify email'
      };
    }
  }
};

export default authService;
