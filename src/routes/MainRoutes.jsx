import MainLayout from "../common/layouts/MainLayout";
import HomePage from "../pages/client/home/HomePage";

export const MainRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
];
