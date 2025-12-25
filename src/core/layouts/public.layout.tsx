import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default PublicLayout;
