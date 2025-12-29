import React from "react";
import { Layout, Button, Space, Typography, Menu, Modal } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthSelector } from "../../store/useAuthStore";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthSelector((state) => state.doLogout);

  // MENU NGANG
  const menuItems = [
    { key: "/admin", label: "Dashboard" },
    { key: "/admin/genres", label: "Quản lý thể loại" },
    { key: "/admin/movies", label: "Quản lý phim" },
    { key: "/admin/rooms", label: "Quản lý phòng chiếu" },
    { key: "/admin/showtimes", label: "Quản lý lịch chiếu" },
    { key: "/admin/ticket", label: "Quản lý vé"},
    { key: "/admin/banners", label: "Quản lý banner" },
    { key: "/admin/users", label: "Quản lý người dùng" },

  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* TOP NAVBAR */}
      <Header
        style={{
          padding: "0 24px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <Text
          style={{
            color: "#000",
            fontSize: 22,
            fontWeight: "bold",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={() => navigate("/admin")}
        >
          MPV Admin
        </Text>

        {/* MENU NGANG */}
        <Menu
          mode="horizontal"
          items={menuItems}
          selectedKeys={[window.location.pathname]}
          onClick={(item) => navigate(item.key)}
          style={{
            flex: 1,
            borderBottom: "none",
            marginLeft: 40,
            fontSize: 16,
          }}
        />

        {/* User + Logout */}
        <Space size="middle" style={{ marginLeft: "auto" }}>
          <Button
            type="default"
            icon={<UserOutlined />}
            style={{ borderRadius: 6 }}
          >
            Admin
          </Button>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            danger
            style={{ borderRadius: 6 }}
            onClick={() => {
              Modal.confirm({
                centered: true,
                title: "Đăng xuất",
                icon: <ExclamationCircleOutlined style={{ color: "#ef4444" }} />,
                content: "Bạn có chắc chắn muốn đăng xuất không?",
                okText: "Đăng xuất",
                cancelText: "Hủy",
                okButtonProps: { danger: true },
                onOk: () => {
                  logout();
                  navigate("/");
                },
              });
            }}
          >
            Đăng xuất
          </Button>
        </Space>
      </Header>

      {/* Nội dung */}
      <Content
        style={{
          margin: "24px auto",
          width: "95%",
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AdminLayout;
