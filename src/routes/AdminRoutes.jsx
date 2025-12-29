import AdminLayout from "../common/layouts/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import CreateMovie from "../pages/admin/movie/create/CreateMovie";
import ListMovie from "../pages/admin/movie/ListMovie";
import UpdateMovie from "../pages/admin/movie/update/UpdateMovie";
import MovieDetail from "../pages/admin/movie/MovieDetail";
import GenrePage from "../pages/admin/genre/GenrePage";
import ListRoomPage from "../pages/admin/room/ListRoomPage";
import CreateRoom from "../pages/admin/room/create/CreateRoom";
import UpdateRoom from "../pages/admin/room/update/UpdateRoom";
import ListShowtime from "../pages/admin/showtime/ListShowTime";
import ListShowtimeInMovie from "../pages/admin/showtime/showtimeMovie/ListShowtimeInMovie";
import CreateMovieShowtime from "../pages/admin/showtime/create/CreateMovieShowtime";
import ListUser from "../pages/admin/user/ListUser";
import BannerManager from "../pages/admin/banner/BannerManager";
import ListOrder from "../pages/admin/order/ListOrder";

export const AdminRoutes = [
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "genres",
        element: <GenrePage />,
      },
      {
        path: "movies",
        children: [
          {
            index: true,
            element: <ListMovie />,
          },
          {
            path: "create",
            element: <CreateMovie />,
          },
          {
            path: "update/:id",
            element: <UpdateMovie />,
          },
          {
            path: ":id",
            element: <MovieDetail />,
          },
        ],
      },
      {
        path: "rooms",
        children: [
          {
            index: true,
            element: <ListRoomPage />,
          },
          {
            path: "create",
            element: <CreateRoom />,
          },
          {
            path: "update/:id",
            element: <UpdateRoom />,
          },
        ],
      },
      {
        path: "showtimes",
        element: <ListShowtime />,
      },
      {
        path: "showtimes/create",
        element: <CreateMovieShowtime />,
      },
      {
        path: "showtimes/movie/:id",
        element: <ListShowtimeInMovie />,
      },
      {
        path: "users",
        element: <ListUser />,
      },
      {
        path: "banners",
        element: <BannerManager />,
      },
      {
        path: "ticket",
        element: <ListOrder />,
      },
    ],
  },
];
