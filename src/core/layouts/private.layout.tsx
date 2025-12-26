import { Outlet, Navigate } from 'react-router-dom';

export const PrivateLayout = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="private-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
