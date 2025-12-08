import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useEffect } from "react";
import { initSocket } from "../../socket/socket-client";
import { useAuthSelector } from "../../store/useAuthStore";

const MainLayout = () => {
  const token = useAuthSelector((state) => state.token);

  useEffect(() => {
    if (token) {
      initSocket(token);
    }
  }, [token]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
