import { Link, NavLink, useNavigate } from "react-router";
import { FaFilm, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuthSelector } from "../../../store/useAuthStore";

const Header = () => {
  const nav = useNavigate();
  const { user, logout } = useAuthSelector((state) => ({
    user: state.user,
    logout: state.doLogout,
  }));

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
    <header className={`sticky top-0 z-50 ${headerBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO + MENU */}
        <div className="flex items-center gap-8">
          <Link to="/" className={`flex items-center gap-2 ${navColorBase}`}>
            <FaFilm size={24} className="text-white" />
            <span className="text-2xl font-bold text-white">MPV</span>
          </Link>

          <ul className="flex items-center gap-6 m-0">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${navColorBase} relative ${isActive ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-red-500" : ""} text-[15px]`
                  }
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
              <p className={`${navColorBase} m-0`}>Xin chào, {user.userName}</p>

              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                title="Đăng xuất"
              >
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
            <Link
              to={"/auth/register"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/60 bg-transparent text-white font-semibold transition-colors duration-200 ease-out shadow-sm hover:bg-white/10 hover:border-white hover:shadow-md"
            >
              Đăng ký
              <FaUser className="text-white" />
            </Link>

              <Link
                to={"/auth/login"}
                className="inline-flex items-center px-4 py-2 rounded-full border border-white/60 bg-transparent text-white font-semibold transition-colors duration-200 ease-out shadow-sm hover:bg-white/10 hover:border-white hover:shadow-md"
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
