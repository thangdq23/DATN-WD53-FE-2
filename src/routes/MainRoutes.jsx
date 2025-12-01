import AuthLayout from "../common/layouts/AuthLayout";
import MainLayout from "../common/layouts/MainLayout";
import LoginPage from "../pages/client/auth/LoginPage";
import RegisterPage from "../pages/client/auth/RegisterPage";
import HomePage from "../pages/client/home/HomePage";
import ShowtimePage from "../pages/client/ShowTimePage";
import AboutPage from "../pages/client/home/components/AboutPage";
import ContactPage from "../pages/client/home/components/ContactPage";
import RulePage from "../pages/client/home/components/RulePage";

export const MainRoutes = [
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "showtime/:id",
        element: <ShowtimePage />,
      },
      {
        path: "about",       // thêm route cho AboutPage
        element: <AboutPage />,
      },
      {
        path: "contact",       
        element: <ContactPage />,
      },
      {
        path: "ticket",       
        element: <RulePage />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
];
