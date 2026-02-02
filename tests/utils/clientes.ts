import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    });
  }

  async get(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.client.get(endpoint, config);
  }

  async post(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.client.post(endpoint, data, config);
  }

  async put(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.client.put(endpoint, data, config);
  }

  async delete(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.client.delete(endpoint, config);
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = token;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}