import { type RouteObject } from 'react-router-dom';
import MessagingPage from '../pages/MessagingPage';

export const messagingRoutes: RouteObject[] = [
  {
    path: 'messages',
    element: <MessagingPage />,
  },
];
