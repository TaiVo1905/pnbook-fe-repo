import { type RouteObject, Navigate } from 'react-router-dom';
import { PrivateLayout } from '@/core/layouts/private.layout';
import PublicLayout from '@/core/layouts/public.layout';
import { authRoutes } from '@/features/auth/routes/auth.routes';
import { friendsRoutes } from '@/features/friend/routes/friend.route';

export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/sign-in" replace />,
      },
      ...authRoutes,
    ],
  },
  {
    path: '/app',
    element: <PrivateLayout />,
    children: [...friendsRoutes],
  },
  {
    path: '*',
    element: <Navigate to="/sign-in" replace />,
  },
];
