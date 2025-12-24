export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  userId?: string;
  token?: string;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
