import React from "react";
import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-500 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <Link
            to="/"
            className="text-4xl font-extrabold text-white tracking-wide hover:text-yellow-300 transition-colors"
          >
            MPV
          </Link>
          <span className="text-white/90 font-medium text-lg hidden sm:block">
            Movie Plus Vietnam
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="text-gray-400">
            Liên hệ:{" "}
            <a
              href="mailto:support@mpv.vn"
              className="text-orange-400 hover:underline"
            >
              support@mpv.vn
            </a>{" "}
            | Hotline:{" "}
            <a href="tel:19001009" className="text-orange-400 hover:underline">
              1900 1009
            </a>{" "}
            | Địa chỉ: Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
          </p>
          <p className="text-gray-500">
            © 2025 MPV — Movie Plus Vietnam. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
