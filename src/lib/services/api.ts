import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

/* ---------- Config ---------- */

const API_URL: string =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* ---------- Refresh Queue Types ---------- */

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/* ---------- Request Interceptor ---------- */

api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (browser) {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ---------- Response Interceptor ---------- */

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      //  If refresh endpoint itself failed
      if (originalRequest.url?.includes('/authentication/refresh')) {
        console.error(' Refresh token invalid or expired');

        if (browser) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

        isRefreshing = false;
        processQueue(error, null);

        if (typeof window !== 'undefined') {
          goto('/auth');
        }

        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Queue requests during refresh
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        console.log(' Token expired, attempting refresh...');

        if (!browser) {
          throw new Error('Cannot refresh token during SSR');
        }

        //  Refresh token via cookies
        const response = await axios.get(
          `${API_URL}/authentication/refresh`,
          {
            withCredentials: true
          }
        );

        if (response.data?.accessToken) {
          const newAccessToken: string = response.data.accessToken;

          localStorage.setItem('accessToken', newAccessToken);
          console.log(' Token refreshed successfully');

          isRefreshing = false;
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return api(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError: any) {
        console.error(
          ' Token refresh failed:',
          refreshError?.message
        );

        isRefreshing = false;
        processQueue(refreshError, null);

        if (browser) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

        if (typeof window !== 'undefined') {
          goto('/auth');
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      console.warn(' Forbidden access');
      if (typeof window !== 'undefined') {
        goto('/auth');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
