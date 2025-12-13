import React from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ScheduleOutlined,
  TagsOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Quản lý người dùng",
    },
    {
      key: "/admin/genres",
      icon: <TagsOutlined />,
      label: "Quản lý thể loại phim",
    },
    {
      key: "/admin/movies",
      icon: <VideoCameraOutlined />,
      label: "Quản lý phim",
    },
    {
      key: "/admin/rooms",
      icon: <DesktopOutlined />,
      label: "Quản lý phòng chiếu",
    },
    {
      key: "/admin/showtimes",
      icon: <ScheduleOutlined />,
      label: "Quản lý suất chiếu",
    },
    {
      key: "/admin/banners",
      icon: <DesktopOutlined />,
      label: "Quản lý banner",
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={menuItems}
      style={{
        height: "100%",
        borderRight: 0,
      }}
    />
  );
};

export default SideBar;
