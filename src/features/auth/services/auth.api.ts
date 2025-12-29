import type {
  SignUpPayload,
  SignInPayload,
  AuthResponse,
} from '@/features/auth/types/auth.type';

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  try {
    const res = await fetch('http://localhost:5001/api/v1/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: `Sign up failed: ${res.statusText}`,
        timeStamp: new Date().toISOString(),
      };
    }

    const data = await res.json();
    return data as AuthResponse;
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: 'Network error during sign up',
      timeStamp: new Date().toISOString(),
    };
  }
}

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  try {
    const res = await fetch('http://localhost:5001/api/v1/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: `Sign in failed: ${res.statusText}`,
        timeStamp: new Date().toISOString(),
      };
    }

    const data = await res.json();
    return data as AuthResponse;
  } catch {
    return {
      statusCode: 500,
      message: 'Network error during sign in',
      timeStamp: new Date().toISOString(),
    };
  }
}
