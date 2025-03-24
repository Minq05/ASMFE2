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
import ClientLayout from "./page/client/layout/ClientLayout";
import Home from "./page/client/Home";
import Shop from "./page/client/Shop";
import CategoriesProduct from "./page/client/Categories";
import Cart from "./page/client/Cart";
import ProductDetailClient from "./page/client/DetailProduct";
import RequireAuth from "./components/RequireAuth";
import LoginClient from "./page/client/auth/Login";
import Register from "./page/client/auth/Register";
import LoginAdmin from "./page/admin/auth/Login";
import Contact from "./page/client/Contact";
import PaymentPage from "./page/client/PaymentPage";
import PaymentSuccess from "./page/client/PaymentSuccess";
import OrderHistory from "./page/client/OrderHistory";
import NotFound from "./page/client/NotFound";
import NotFoundAdmin from "./page/admin/NotFound";

const routesConfig = [
  // Route đăng nhập, đăng ký
  { path: "/admin/login", element: <LoginAdmin /> },
  { path: "/register", element: <Register /> },
  { path: "/login-client", element: <LoginClient /> },

  // Route ADMIN
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
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
      // NotFound riêng cho Admin
      { path: "*", element: <NotFoundAdmin /> },
    ],
  },

  // Route CLIENT
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "shop/:id", element: <ProductDetailClient /> },
      { path: "categories-product/:name", element: <CategoriesProduct /> },
      { path: "cart", element: <Cart /> },
      { path: "contact", element: <Contact /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "order-history", element: <OrderHistory /> },
      // NotFound riêng cho Client
      { path: "*", element: <NotFound /> },
    ],
  },
];


function App() {
  const routes = useRoutes(routesConfig);
  return routes;
}

export default App;
