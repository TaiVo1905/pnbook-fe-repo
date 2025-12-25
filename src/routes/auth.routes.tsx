import { type RouteObject, Navigate } from 'react-router-dom';
import PublicLayout from '@/core/layouts/public.layout';
import SignUpPage from '@/features/auth/pages/signup.page';
import SignInPage from '@/features/auth/pages/signin.page';

export const authRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    { index: true, element: <Navigate to="/signin" replace /> },
    { path: 'signin', element: <SignInPage /> },
    { path: 'signup', element: <SignUpPage /> },
  ],
};
