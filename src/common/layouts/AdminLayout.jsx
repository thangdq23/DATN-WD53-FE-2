import { Outlet } from "react-router";
import SideBar from "./components/SideBar";

const AdminLayout = () => {
  return (
    <div>
      <SideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
