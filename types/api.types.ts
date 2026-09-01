export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
