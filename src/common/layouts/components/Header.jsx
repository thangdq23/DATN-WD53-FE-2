import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaFilm } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuthSelector } from "../../../store/useAuthStore";
import { Avatar, Button, Dropdown, List, Popover } from "antd";

const Header = () => {
  const nav = useNavigate();
  const { user, logout } = useAuthSelector((state) => ({
    user: state.user,
    logout: state.doLogout,
  }));

  // intentionally not reading tickets here; kept selector import for future use

  const navItems = [
    { path: "/", label: "Trang Chủ" },
    { path: "/showtimes", label: "Lịch Chiếu" },
    { path: "/phim", label: "Phim" },
    { path: "/tin-tuc", label: "Tin Tức" },
    { path: "/about", label: "Giới Thiệu" },
    { path: "/lien-he", label: "Liên Hệ" },
    { path: "/ticket", label: "Điều khoản" },
  ];

  const navColorBase = "text-white font-medium";

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerBg = scrolled ? "bg-black/70 backdrop-blur-md" : "bg-black";

  return (
    <header
      className={`sticky top-0 z-50 ${headerBg} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO + MENU */}
        <div className="flex items-center gap-8">
          <Link to="/" className={`flex items-center gap-2 ${navColorBase}`}>
            <FaFilm size={24} className="text-blue-500" />
            <span className="text-2xl font-bold text-blue-500">MPV</span>
          </Link>

          <ul className="flex items-center gap-6 m-0">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${navColorBase} relative ${
                      isActive
                        ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-blue-500"
                        : ""
                    } text-[15px]`
                  }
                  style={{ color: "#fff" }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* AUTH */}
        <div className="flex items-center gap-4 font-sans text-[15px]">
          {user ? (
            <>
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <div
                    style={{ minWidth: 260 }}
                    className="rounded-md overflow-hidden shadow-md bg-white"
                  >
                    <div className="p-4 flex items-center gap-3">
                      <Avatar size={48} style={{ backgroundColor: "#2f0fe4" }}>
                        {(user.userName || "").charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {user.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="border-t" />
                    <div className="p-3 flex items-center gap-2">
                      <Link to="/user/profile" className="w-full">
                        <Button block size="small">
                          Trang cá nhân
                        </Button>
                      </Link>
                      <Link to="/user/tickets" className="w-full">
                        <Button block size="small">
                          Lịch sử
                        </Button>
                      </Link>
                    </div>
                    <div className="p-3">
                      <Button
                        block
                        size="small"
                        danger
                        onClick={() => {
                          try {
                            logout();
                            nav("/");
                            nav(0);
                          } catch {
                            logout();
                            window.location.href = "/";
                          }
                        }}
                      >
                        Đăng xuất
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar size={36} style={{ backgroundColor: "#2f0fe4" }}>
                    {(user.userName || "").charAt(0).toUpperCase()}
                  </Avatar>
                  <span className={`${navColorBase} hidden md:inline-block`}>
                    {user.userName}
                  </span>
                </div>
              </Popover>
            </>
          ) : (
            <>
              <Link
                to={"/auth/register"}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white bg-transparent text-white font-semibold transition-opacity duration-200 shadow-sm hover:opacity-90"
                style={{ color: "#fff" }}
              >
                Đăng ký
              </Link>

              <Link
                to={"/auth/login"}
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-white font-semibold shadow-sm hover:opacity-90"
                style={{
                  background: "linear-gradient(90deg, #2f0fe4ff, #4c57eeff)",
                  border: "none",
                  color: "#fff",
                }}
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
