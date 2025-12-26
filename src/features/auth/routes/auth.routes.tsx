import { type RouteObject } from 'react-router-dom';
import SignUpPage from '@/features/auth/pages/signup.page';
import SignInPage from '@/features/auth/pages/signin.page';

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
