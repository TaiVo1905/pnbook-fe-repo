import type {
  SignUpPayload,
  SignInPayload,
  AuthResponse,
  GoogleSignInPayload,
} from '@/features/auth/types/auth.type';

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  try {
    const res = await fetch(
      'https://pn-book-bj6tn.ondigitalocean.app/api/v1/auth/sign-up',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: `Sign up failed: ${res.statusText}`,
        timeStamp: new Date().toISOString(),
      };
    }

    const data = await res.json();
    return data as AuthResponse;
  } catch {
    return {
      statusCode: 500,
      message: 'Network error during sign up',
      timeStamp: new Date().toISOString(),
    };
  }
}

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  try {
    const res = await fetch(
      'https://pn-book-bj6tn.ondigitalocean.app/api/v1/auth/sign-in',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

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

export async function googleSignIn(
  payload: GoogleSignInPayload
): Promise<AuthResponse> {
  try {
    const res = await fetch(
      'https://pn-book-bj6tn.ondigitalocean.app/api/v1/auth/google',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      return {
        statusCode: res.status,
        message: `Google login failed: ${res.statusText}`,
        timeStamp: new Date().toISOString(),
      };
    }

    const data = await res.json();
    return data as AuthResponse;
  } catch {
    return {
      statusCode: 500,
      message: 'Network error during Google login',
      timeStamp: new Date().toISOString(),
    };
  }
}
