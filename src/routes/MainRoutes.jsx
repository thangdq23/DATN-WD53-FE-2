import AuthLayout from "../common/layouts/AuthLayout";
import MainLayout from "../common/layouts/MainLayout";
import LoginPage from "../pages/client/auth/LoginPage";
import RegisterPage from "../pages/client/auth/RegisterPage";
import HomePage from "../pages/client/home/HomePage";
import ShowtimePage from "../pages/client/ShowTimePage";
import AboutPage from "../pages/client/home/components/AboutPage";
import ContactPage from "../pages/client/home/components/ContactPage";
import RulePage from "../pages/client/home/components/RulePage";
import ShowtimePicker from "../pages/client/movie/detail/components/ShowtimePicker";
import ShowtimesPage from "../pages/client/home/components/ShowtimesPage";

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
        children: [
          { index: true, element: <ShowtimePicker /> },
          { path: ":showtimeId/:roomId", element: <ShowtimePicker /> },
        ],
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
        path: "showtimes",
        element: <ShowtimesPage />,
      },
      {
        path: "lich-chieu",
        element: <ShowtimesPage />,
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
