export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  timeStamp: string;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleSignInPayload {
  authCode: string;
}
