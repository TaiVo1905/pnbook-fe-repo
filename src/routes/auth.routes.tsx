import { type RouteObject, Navigate } from 'react-router-dom';
import { ParentLayout } from '@/core/layouts/parent.layout';
import { PrivateLayout } from '@/core/layouts/private.layout';
import AuthLayout from '@/core/layouts/auth.layout';

import SignUpPage from '@/pages/signup.page';
import SignInPage from '@/pages/signin.page';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ParentLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="/signin" replace /> },
          { path: 'signin', element: <SignInPage /> },
          { path: 'signup', element: <SignUpPage /> },
        ],
      },
      {
        element: <PrivateLayout />,
        children: [],
      },
    ],
  },
];
