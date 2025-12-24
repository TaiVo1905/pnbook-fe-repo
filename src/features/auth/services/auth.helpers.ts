import type {
  SignUpPayload,
  SignInPayload,
  AuthResponse,
} from '@/features/auth/types/auth.type';

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Sign up failed: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return {
      success: data.success,
      message: data.message,
      userId: data.userId,
      token: data.token,
    };
  } catch {
    return {
      success: false,
      message: 'Network error during sign up',
    };
  }
}

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Sign in failed: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return {
      success: data.success,
      message: data.message,
      userId: data.userId,
      token: data.token,
    };
  } catch {
    return {
      success: false,
      message: 'Network error during sign in',
    };
  }
}
