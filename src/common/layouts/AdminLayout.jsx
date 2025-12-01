import React from "react";
import { Layout, Button, Space, Typography, Avatar } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet } from "react-router";
import SideBar from "./components/SideBar";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Sidebar */}
      <Sider
        width={260}
        style={{
          overflow: "hidden",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#001529", // màu sidebar tối chuyên nghiệp
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            background: "#002140",
            marginBottom: 24,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
            MPV Admin
          </Text>
        </div>

        {/* Menu */}
        <SideBar />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: 260, minHeight: "100vh" }}>
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Text strong style={{ fontSize: 18 }}>
            Dashboard
          </Text>
          <Space size="middle">
            <Button type="default" icon={<UserOutlined />} style={{ borderRadius: 6 }}>
              Admin
            </Button>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              danger
              style={{ borderRadius: 6 }}
              onClick={() => {
                // Xử lý logout
              }}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
