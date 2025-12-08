import { Link, NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthSelector } from "../../../store/useAuthStore";

const Header = () => {
  const nav = useNavigate();
  const { user, logout } = useAuthSelector((state) => ({
    user: state.user,
    logout: state.doLogout,
  }));

  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/showtimes", label: "Lịch chiếu" },
    { path: "/flim", label: "Phim" },
    { path: "/contact", label: "Liên hệ" },
    { path: "/discount", label: "Tin mới và ưu đãi" },
    { path: "/ticket", label: "Điều khoản" },
    { path: "/about", label: "Giới thiệu" },
  ];

  const [transparent, setTransparent] = useState(false);

  useEffect(() => {
    const onScroll = () => setTransparent(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Màu menu đồng bộ với tiêu đề RulePage
  const navColorBase = "text-teal-300 hover:text-teal-400 font-semibold";

  // Background header khi scroll
  const headerBg = transparent
    ? "bg-[#0b1a25]/70 backdrop-blur-md"
    : "bg-[#0b1a25]";

  return (
    <header className={`sticky top-0 z-50 ${headerBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO + MENU */}
        <div className="flex items-center gap-8">
          <h1 className={`text-2xl font-bold ${navColorBase}`}>MPV</h1>

          <ul className="flex items-center gap-6 m-0">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${navColorBase} ${isActive ? "font-bold" : ""} uppercase text-[16px]`
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
                className="px-4 py-1.5 rounded-lg bg-teal-900 text-teal-300 hover:bg-teal-800 hover:text-teal-400 transition-all duration-300 font-medium border border-teal-400 shadow-md"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
            <Link
  to={"/auth/register"}
  className="px-4 py-1.5 rounded-lg bg-[#062d32] text-white font-semibold 
             border border-white shadow-md 
             hover:bg-[#09474e] hover:scale-[1.05]
             transition-all duration-300"
>
  Đăng ký
</Link>

              <Link
  to={"/auth/login"}
  className="px-4 py-1.5 rounded-lg border border-white text-white 
             hover:bg-white/10 hover:scale-[1.05]
             transition-all duration-300"
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
