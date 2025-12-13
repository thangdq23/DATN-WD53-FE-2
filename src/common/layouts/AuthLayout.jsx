import React from "react";
import { Link, Outlet } from "react-router";


const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-[#0b1a25] text-white">
      {/* Header */}
      <header className="bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="text-2xl font-bold text-white">
            MPV
          </Link>
          <span className="text-white/90 font-medium hidden sm:block">
            Movie Plus Vietnam
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="bg-[#0c1a22]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1a25] py-6 text-center text-white text-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="text-gray-400">
            Liên hệ: {" "}
            <a href="mailto:support@mpv.vn" className="text-teal-300 hover:underline">
              support@mpv.vn
            </a> {" "}| Hotline: {" "}
            <a href="tel:19001009" className="text-teal-300 hover:underline">
              1900 1009
            </a> {" "}| Địa chỉ: Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
          </p>
          <p className="text-gray-500">© 2025 MPV — Movie Plus Vietnam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
