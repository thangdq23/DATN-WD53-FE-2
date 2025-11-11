import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";

const MainLayout = () => {
  return (
    <>
      <Header></Header>
      <main>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </>
  );
};

export default MainLayout;
