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
import MoviesPage from "../pages/client/home/components/MoviesPage";
import NewsPage from "../pages/client/home/components/NewsPage";
import NewsDetailPage from "../pages/client/home/components/NewsDetailPage";
import CheckoutPage from "../pages/client/checkout/CheckoutPage";
import PaymentSuccess from "../pages/client/checkout/PaymentSuccess";
import PaymentFailed from "../pages/client/checkout/PaymentFailed";
import ProfilePage from "../pages/client/user/ProfilePage";
import MyTicketsPage from "../pages/client/user/MyTicketsPage";

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
        path: "about", // thêm route cho AboutPage
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "lien-he",
        element: <ContactPage />,
      },
      {
        path: "showtimes",
        element: <ShowtimesPage />,
      },
      {
        path: "phim",
        element: <MoviesPage />,
      },
      {
        path: "tin-tuc",
        element: <NewsPage />,
      },
      {
        path: "tin-tuc/:id",
        element: <NewsDetailPage />,
      },
      {
        path: "ticket",
        element: <RulePage />,
      },
      {
        path: "lich-chieu",
        element: <ShowtimesPage />,
      },
      {
        path: "checkout/:showtimeId/:roomId",
        element: <CheckoutPage />,
      },
      {
        path: "user",
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "tickets", element: <MyTicketsPage /> },
        ],
      },
      {
        path: "payment",
        children: [
          {
            path: "success/:id",
            element: <PaymentSuccess />,
          },
          {
            path: "failed",
            element: <PaymentFailed />,
          },
        ],
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
