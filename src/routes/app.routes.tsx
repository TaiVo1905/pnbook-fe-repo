import { type RouteObject, Navigate } from 'react-router-dom';
import { PrivateLayout } from '@/core/layouts/private.layout';
import PublicLayout from '@/core/layouts/public.layout';
import { authRoutes } from '@/features/auth/routes/auth.routes';
import { postRoutes } from '@/features/post/routes/post.routes';
import { DashboardLayout } from '@/features/post/layouts/dashboard.layout';
import { SearchPage } from '@/features/post/pages/search.page';

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
    children: [
      {
        path: 'home',
        element: <DashboardLayout />,
        children: [
          ...postRoutes,
          {
            path: 'search',
            element: <SearchPage />,
          },
        ],
      },
      {
        path: 'notifications',
        element: <DashboardLayout />,
        children: postRoutes,
      },
      {
        path: 'friends',
        element: <DashboardLayout />,
      },
      {
        path: 'messages',
        element: <DashboardLayout />,
      },
      {
        path: 'profile',
        element: <DashboardLayout />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/sign-in" replace />,
  },
];
