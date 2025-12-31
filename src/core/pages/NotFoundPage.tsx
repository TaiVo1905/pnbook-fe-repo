import { useNavigate } from 'react-router-dom';
import { Button } from '@/core/shadcn/components/ui/button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-primary text-6xl font-bold">404</h1>
      <p className="text-muted-foreground text-xl">Oops! Page not found.</p>
      <Button onClick={() => navigate('/app/home')}>Back to Home</Button>
    </div>
  );
};
