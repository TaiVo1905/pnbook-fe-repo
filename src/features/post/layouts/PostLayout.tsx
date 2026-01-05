import type { PostLayoutProps } from '@/features/post/types/post.type';

const PostLayout = ({ children }: PostLayoutProps) => {
  return <div className="w-full max-w-2xl space-y-6">{children}</div>;
};

export default PostLayout;
