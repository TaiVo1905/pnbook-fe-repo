import { ProfilePage } from '../pages/ProfilePage';
import { type RouteObject } from 'react-router-dom';

export const profileRoutes: RouteObject[] = [
  {
    path: 'profile',
    element: <ProfilePage />,
  },
  {
    path: 'profile/:userId',
    element: <ProfilePage />,
  },
];
