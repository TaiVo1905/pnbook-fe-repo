import { httpClient } from '@/core/api/httpClient.api';
import type {
  SignInPayload,
  SignUpPayload,
  AuthResponse,
  GoogleSignInPayload,
} from '../types/auth.type';

export const authApi = {
  signIn: (payload: SignInPayload) =>
    httpClient.post<AuthResponse>('/auth/sign-in', payload),

  signUp: (payload: SignUpPayload) =>
    httpClient.post<AuthResponse>('/auth/sign-up', payload),

  googleSignIn: (payload: GoogleSignInPayload) =>
    httpClient.post<AuthResponse>('/auth/google', payload),

  signOut: () => httpClient.get<AuthResponse>('/auth/sign-out'),
};
