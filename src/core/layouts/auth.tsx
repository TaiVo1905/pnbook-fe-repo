import React from 'react';
import { APP_CONFIG } from '@/core/configs/config.ts';
import pnv from '@/core/assets/images/pnv.png';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div
        className="border-border bg-card rounded-auth flex w-full overflow-hidden border shadow-2xl"
        style={{
          maxWidth: APP_CONFIG.layout.authContainerWidth,
          height: APP_CONFIG.layout.authContainerHeight,
        }}
      >
        <div className="relative hidden w-1/2 lg:flex">
          <img src={pnv} alt="PNV" className="h-full w-full object-cover" />
        </div>

        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div
            className="w-full"
            style={{ maxWidth: APP_CONFIG.layout.authFormMaxWidth }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
