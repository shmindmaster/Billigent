import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface PerformanceApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableRetry: boolean;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

class PerformanceApiService {
  private api: AxiosInstance;
  private config: PerformanceApiConfig;

  constructor(config: Partial<PerformanceApiConfig> = {}) {
    this.config = {
      baseURL: config.baseURL || 'http://localhost:3001',
      timeout: config.timeout || 15000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      enableRetry: config.enableRetry !== false,
    };

    this.api = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for logging and performance monitoring
    this.api.interceptors.request.use(
      (config) => {
        // Add request timestamp for performance tracking
        config.metadata = { startTime: Date.now() };
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for performance monitoring and error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
        
        // Log response time in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
        }
        
        // Add performance metrics to response
        response.data = {
          ...response.data,
          _performance: {
            duration,
            timestamp: new Date().toISOString(),
          },
        };
        
        return response;
      },
      async (error: AxiosError) => {
        const duration = Date.now() - (error.config?.metadata?.startTime || Date.now());
        
        // Log error with performance metrics
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
            status: error.response?.status,
            message: error.message,
            duration,
          });
        }
        
        // Handle retry logic
        if (this.config.enableRetry && this.shouldRetry(error)) {
          return this.retryRequest(error);
        }
        
        return Promise.reject(this.formatError(error, duration));
      }
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('timeout')
    );
  }

  private async retryRequest(error: AxiosError): Promise<AxiosResponse> {
    const config = error.config;
    if (!config) {
      return Promise.reject(error);
    }

    // Add retry attempt to config
    config.retryAttempt = (config.retryAttempt || 0) + 1;
    
    if (config.retryAttempt <= this.config.retryAttempts) {
      // Exponential backoff delay
      const delay = this.config.retryDelay * Math.pow(2, config.retryAttempt - 1);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Retrying request (attempt ${config.retryAttempt}/${this.config.retryAttempts}) in ${delay}ms`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        return await this.api.request(config);
      } catch (retryError) {
        if (config.retryAttempt >= this.config.retryAttempts) {
          return Promise.reject(retryError);
        }
        return this.retryRequest(retryError as AxiosError);
      }
    }
    
    return Promise.reject(error);
  }

  private formatError(error: AxiosError, duration: number): any {
    const baseError = {
      message: error.message,
      status: error.response?.status || 'NETWORK_ERROR',
      duration,
      timestamp: new Date().toISOString(),
      url: error.config?.url,
      method: error.config?.method,
    };

    if (error.response?.data) {
      return {
        ...baseError,
        ...error.response.data,
      };
    }

    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      return {
        ...baseError,
        message: 'Request timeout - the operation took too long to complete',
        type: 'TIMEOUT',
      };
    }

    if (error.code === 'ECONNREFUSED') {
      return {
        ...baseError,
        message: 'Connection refused - the server is not available',
        type: 'CONNECTION_REFUSED',
      };
    }

    if (error.code === 'ENOTFOUND') {
      return {
        ...baseError,
        message: 'Service not found - the requested endpoint does not exist',
        type: 'NOT_FOUND',
      };
    }

    return baseError;
  }

  // Generic request method with performance monitoring
  async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request(config);
      return {
        data: response.data,
        status: response.status,
        message: 'Success',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw this.formatError(error as AxiosError, 0);
    }
  }

  // Health check with timeout
  async healthCheck(): Promise<ApiResponse> {
    return this.request({
      method: 'GET',
      url: '/health',
      timeout: 5000, // Shorter timeout for health checks
    });
  }

  // Ready check with comprehensive monitoring
  async readyCheck(): Promise<ApiResponse> {
    return this.request({
      method: 'GET',
      url: '/ready',
      timeout: 10000, // Longer timeout for ready checks
    });
  }

  // Generic GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request({
      method: 'GET',
      url,
      ...config,
    });
  }

  // Generic POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  // Generic PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  // Generic DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  // Update configuration
  updateConfig(newConfig: Partial<PerformanceApiConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Update axios instance
    this.api.defaults.baseURL = this.config.baseURL;
    this.api.defaults.timeout = this.config.timeout;
  }

  // Get current configuration
  getConfig(): PerformanceApiConfig {
    return { ...this.config };
  }
}

// Create default instance
const performanceApiService = new PerformanceApiService();

export default performanceApiService;
export { PerformanceApiService, type ApiResponse, type PerformanceApiConfig };
