import { type RouteObject, Navigate } from 'react-router-dom';
import { PrivateLayout } from '@/core/layouts/PrivateLayout';
import PublicLayout from '@/core/layouts/PublicLayout';
import { authRoutes } from '@/features/auth/routes/auth.routes';
import { postRoutes } from '@/features/post/routes/post.routes';
import { SearchPage } from '@/features/post/pages/SearchPage';
import { NotFoundPage } from '@/core/pages/NotFoundPage';
import { friendsRoutes } from '@/features/friend/routes/friend.route';
import MessagingPage from '@/features/messaging/pages/MessagingPage';

export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Navigate to="/sign-in" replace /> },
      ...authRoutes,
    ],
  },
  {
    path: '/app',
    element: <PrivateLayout />,
    children: [
      {
        path: 'home',
        children: [...postRoutes, { path: 'search', element: <SearchPage /> }],
      },
      ...friendsRoutes,
      { path: 'notifications', element: <NotFoundPage /> },
      { path: 'messages', element: <MessagingPage /> },
      { path: 'profile', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/sign-in" replace />,
    children: [...friendsRoutes],
  },
  {
    path: '*',
    element: <Navigate to="/sign-in" replace />,
  },
];
