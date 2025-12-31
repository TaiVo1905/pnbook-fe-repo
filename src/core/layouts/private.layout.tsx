import { Outlet } from 'react-router-dom';

export const PrivateLayout = () => {
  return (
    <div className="private-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
