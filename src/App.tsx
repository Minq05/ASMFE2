// src/App.tsx
import { useRoutes } from "react-router";
import AdminLayout from "./page/admin/layout/AdminLayout";
import Dashboard from "./page/admin/Dashboard";
import ManageOrders from "./page/admin/ManageOrders";
import ManageProducts from "./page/admin/ManageProducts";
import ManageCustomers from "./page/admin/ManageCustomers";
import ManageCategories from "./page/admin/ManageCategories";
import FormProduct from "./page/admin/form/FormProduct";
import ProductDetail from "./page/admin/ProductDetail";
import FormCategory from "./page/admin/form/FormCategory";
import ManageOrderDetail from "./page/admin/OrderDetail";
import CustomerHistory from "./page/admin/CustomerHistory";
import Login from "./page/client/auth/Login";
import Register from "./page/client/auth/Register";
import LoginClient from "./page/client/auth/Login";
import ClientLayout from "./page/client/layout/ClientLayout";
import Home from "./page/client/Home";

const routesConfig = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login-client",
    element: <LoginClient />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "manage-order", element: <ManageOrders /> },
      { path: "manage-orders/:id", element: <ManageOrderDetail /> },
      { path: "manage-customer", element: <ManageCustomers /> },
      { path: "customer-history/:customerName", element: <CustomerHistory /> },
      { path: "product-form/:id", element: <FormProduct /> },
      { path: "product-form", element: <FormProduct /> },
      { path: "category-form/:id", element: <FormCategory /> },
      { path: "category-form", element: <FormCategory /> },
      { path: "product-detail/:id", element: <ProductDetail /> },
      { path: "manage-category", element: <ManageCategories /> },
      { path: "manage-product", element: <ManageProducts /> },
    ],
  },
  {
    path: "/",
    element: <ClientLayout />,
    children: [{ path: "/", element: <Home /> }],
  },
];

function App() {
  const routes = useRoutes(routesConfig);
  return routes;
}

export default App;
