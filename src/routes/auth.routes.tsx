import { Navigate, type RouteObject } from 'react-router-dom';
import SignInForm from '@/features/auth/components/signInForm';
import SignUpForm from '@/features/auth/components/signUpForm';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '/signin',
    element: <SignInForm />,
  },
  {
    path: '/signup',
    element: <SignUpForm />,
  },
];
