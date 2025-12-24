import { Outlet } from 'react-router-dom';
import pnv from '@/core/assets/images/pnv.webp';

const AuthLayout = () => {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="border-border bg-card rounded-auth max-w-auth-container h-auth-container flex w-full overflow-hidden border shadow-2xl">
        <div className="relative hidden w-1/2 lg:flex">
          <img src={pnv} alt="PNV" className="h-full w-full object-cover" />
        </div>
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="max-w-auth-form w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
