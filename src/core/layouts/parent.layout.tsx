import { Outlet } from 'react-router-dom';

export const ParentLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
