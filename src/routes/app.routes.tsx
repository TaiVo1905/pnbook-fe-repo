import { type RouteObject } from 'react-router-dom';
import { PrivateLayout } from '@/core/layouts/private.layout';
import { authRoutes } from '@/routes/auth.routes';

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [{ ...authRoutes }],
  },
  {
    path: '/',
    element: <PrivateLayout />,
    children: [],
  },
];
