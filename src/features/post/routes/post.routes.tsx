import type { RouteObject } from 'react-router-dom';
import { FeedPage } from '../pages/FeedPage';

export const postRoutes: RouteObject[] = [
  {
    path: '',
    element: <FeedPage />,
  },
];
