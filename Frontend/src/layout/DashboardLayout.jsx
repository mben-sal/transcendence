import { Outlet } from 'react-router-dom';
import Sidebar from '../component/sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex  bg-[#F3F3E0] w-full">
      <Sidebar />
      <main className=" p-6 w-full overflow-y-auto h-dvh">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;