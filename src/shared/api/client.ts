/**
 * API Client
 * Firebase Functions 엔드포인트 호출
 */

const BASE_URL = 'https://asia-northeast3-carivdealer.cloudfunctions.net';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Client
 */
export const apiClient = {
  /**
   * POST 요청
   */
  async post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.error || 'API request failed', response.status, error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  },

  /**
   * 파일 업로드 (multipart/form-data)
   */
  async upload<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.error || 'Upload failed', response.status, error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  },
};
