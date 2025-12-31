import type { RouteObject } from 'react-router-dom';
import { FeedPage } from '../pages/feed.page';

export const postRoutes: RouteObject[] = [
  {
    path: '',
    element: <FeedPage />,
  },
];
