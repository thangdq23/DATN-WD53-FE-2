import React from "react";
import { Layout, Button, Space, Typography, Avatar } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet } from "react-router";
import SideBar from "./components/SideBar";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#0f172a" }}>
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
          background: "#1e293b",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            height: 64,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: "bold",
            color: "#00ffff",
          }}
        >
          MPV Admin
        </div>
        <SideBar />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: 260, minHeight: "100vh" }}>
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Space size="middle">
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                border: "2px solid #00ffff",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
            />
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              style={{
                background: "#00ffff",
                color: "#0f172a",
                border: "none",
                fontWeight: "bold",
                borderRadius: 8,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#00e5e5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#00ffff")
              }
              onClick={() => {
                /* Đăng xuất */
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
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            borderRadius: 12,
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            transition: "all 0.3s",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
