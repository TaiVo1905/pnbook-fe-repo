import { type RouteObject } from 'react-router-dom';
import { PrivateLayout } from '@/core/layouts/private.layout';
import PublicLayout from '@/core/layouts/public.layout';
import { authRoutes } from '@/features/auth/routes/auth.routes';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [...authRoutes],
  },
  {
    path: '/',
    element: <PrivateLayout />,
    children: [],
  },
];
