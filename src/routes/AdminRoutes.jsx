import AdminLayout from "../common/layouts/AdminLayout";
import MainLayout from "../common/layouts/MainLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import HomePage from "../pages/client/home/HomePage";

export const AdminRoutes = [
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
];
