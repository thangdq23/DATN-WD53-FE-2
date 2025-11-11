import { createBrowserRouter, RouterProvider } from "react-router";
import { MainRoutes } from "./mainRoutes";
import NotfoundPage from "../pages/NotfoundPage";
import { AdminRoutes } from "./AdminRoutes";

const routes = createBrowserRouter([
  ...MainRoutes,
  ...AdminRoutes,
  {
    path: "*",
    element: <NotfoundPage />,
  },
]);
export const AppRoutes = () => {
  return <RouterProvider router={routes} />;
};
