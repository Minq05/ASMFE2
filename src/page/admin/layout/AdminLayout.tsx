// components/AdminLayout.tsx
import { Layout, Menu, Switch, ConfigProvider, theme as antdTheme } from "antd";
import {
  PieChartOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  GiftOutlined,
  AppstoreOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const { Header, Sider, Content, Footer } = Layout;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load trạng thái Dark Mode từ localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("adminDarkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const handleToggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("adminDarkMode", checked.toString());
  };

  const darkMode = isDarkMode ? <MoonOutlined /> : <SunOutlined />;

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    toast.success("Đăng xuất thành công!");
    window.location.href = "/admin/login";
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div
            style={{
              color: "white",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Admin Panel
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={[
              {
                key: "/admin",
                icon: <PieChartOutlined />,
                label: "Dashboard",
              },
              {
                key: "/admin/manage-customer",
                icon: <UsergroupAddOutlined />,
                label: "Customers",
              },
              {
                key: "/admin/manage-order",
                icon: <ShoppingOutlined />,
                label: "Orders",
              },
              {
                key: "/admin/manage-product",
                icon: <GiftOutlined />,
                label: "Products",
              },
              {
                key: "/admin/manage-category",
                icon: <AppstoreOutlined />,
                label: "Categories",
              },
            ]}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              background: isDarkMode ? "#141414" : "#fff",
              padding: "0 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            <div>ASSIGNMENT FE2</div>
            <div>
              {darkMode}
              <Switch
                checked={isDarkMode}
                onChange={handleToggleDarkMode}
                style={{ marginLeft: 8 }}
              />
              <button onClick={handleLogout} className=" mx-5 text-red-500 cursor-pointer hover:text-xl hover:font-extrabold transition">
                Đăng xuất
              </button>
            </div>
          </Header>

          <Content
            style={{
              margin: "16px",
              padding: 24,
              background: isDarkMode ? "#1f1f1f" : "#fff",
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
          <ToastContainer />
          <Footer
            style={{
              textAlign: "center",
              background: isDarkMode ? "#111" : "#f0f2f5",
              color: isDarkMode ? "#ccc" : "#000",
            }}
          >
            Admin Panel ©2025
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default AdminLayout;
