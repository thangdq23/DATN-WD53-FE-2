import { Link, NavLink, useNavigate } from "react-router";
import { useAuthSelector } from "../../../store/useAuthStore";

const Header = () => {
  const nav = useNavigate();
  const { user, logout } = useAuthSelector((state) => ({
    user: state.user,
    logout: state.doLogout,
  }));
  const navItems = [
    {
      path: "/",
      label: "Trang chủ",
    },
    {
      path: "/showtimes",
      label: "Lịch chiếu",
    },
    {
      path: "/flim",
      label: "Phim",
    },
    {
      path: "/contact",
      label: "Liên hệ",
    },
    {
      path: "/discount",
      label: "Tin mới và ưu đãi",
    },
    {
      path: "/ticket",
      label: "Điều khoản",
    },
    {
      path: "/about",
      label: "Giới thiệu",
    },
  ];
  return (
    <>
      <section className="bg-black py-1">
        <div className=" flex justify-end max-w-7xl mx-6 xl:mx-auto">
          {user ? (
            <div className="flex items-center gap-3  font-sans text-sm text-white">
              <p className="m-0!">Xin chào, {user.userName}</p>|
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="hover:text-red-500! cursor-pointer duration-300"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3  font-sans text-sm text-white">
              <Link
                to={"/auth/register"}
                className="text-white! hover:text-primary! duration-300"
              >
                Đăng ký
              </Link>
              |
              <Link
                to={"/auth/login"}
                className="text-white! hover:text-primary! duration-300"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </section>
      <header className="py-4 shadow-lg sticky top-0 z-999 bg-white">
        <div className="flex items-center max-w-7xl xl:mx-auto justify-between">
          <h1 className="text-4xl font-bold m-0!">MPV</h1>
          <div>
            <ul className="flex items-center gap-6 m-0!">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${
                        isActive ? "text-primary!" : "text-black!"
                      } text-base  hover:text-primary! duration-300 uppercase text-[18px]`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
