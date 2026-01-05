import { type RouteObject } from 'react-router-dom';
import FriendsPage from '@/features/friend/pages/FriendPage';

export const friendsRoutes: RouteObject[] = [
  {
    path: 'friends',
    element: <FriendsPage />,
  },
];
