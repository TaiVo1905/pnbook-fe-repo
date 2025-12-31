import { type RouteObject } from 'react-router-dom';
import SignUpPage from '@/features/auth/pages/SignUpPage';
import SignInPage from '@/features/auth/pages/SignInPage';

export const authRoutes: RouteObject[] = [
  {
    path: 'sign-in',
    element: <SignInPage />,
  },
  {
    path: 'sign-up',
    element: <SignUpPage />,
  },
];
