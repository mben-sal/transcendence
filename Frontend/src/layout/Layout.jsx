
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/sidebar';

export function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;