import { type RouteObject, Navigate } from 'react-router-dom';
import { PrivateLayout } from '@/core/layouts/private.layout';
import PublicLayout from '@/core/layouts/public.layout';
import { authRoutes } from '@/features/auth/routes/auth.routes';
import { messagingRoutes } from '@/features/messaging/routes/messaging.routes';

export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/sign-in" replace />,
      },
      ...authRoutes,
      {
        path: '/',
        element: <Navigate to="/messages" replace />,
      },
      ...messagingRoutes,
    ],
  },
  {
    path: '/app',
    element: <PrivateLayout />,
    children: [],
  },
  {
    path: '*',
    element: <Navigate to="/sign-in" replace />,
  },
];
