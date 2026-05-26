// API response wrapper types — what the backend actually returns

export interface ApiError {
  error: string;
  details?: string[];
  status?: number;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface TokenGenerateResponse {
  token: string;
  reviewUrl: string;
  expiresAt: string;
  customerName?: string;
}

export interface TokenVerifyResponse {
  valid: boolean;
  reason?: string;
  customerName?: string;
  expiresAt?: string;
}
