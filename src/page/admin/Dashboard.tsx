import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, Divider } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ShoppingCartOutlined,
  BoxPlotOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import API from "../../services/api";
import { Order, Product } from "../../type/type";

const { Title } = Typography;

function Dashboard() {
  const [totalProducts, setTotalProducts] = useState<Product[]>([]);
  const [totalOrders, setTotalOrders] = useState<Order[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState([]);
  interface User {
    role?: string;
  }
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resProducts = await API.get("products");
        const resOrders = await API.get("orders");
        const resUsers = await API.get("users");

        setTotalProducts(resProducts.data.length);
        setTotalOrders(resOrders.data.length);

        // tong khach hang
        const staffUsers = resUsers.data.filter(
          (user: User) => user.role === "staff"
        ).length;
        setTotalCustomers(staffUsers);
        const revenue = resOrders.data.reduce(
          (sum: any, order: any) => sum + (order.totalPrice || 0),
          0
        );
        setTotalRevenue(revenue);

        // tong doanh thu
        const grouped: Record<string, number> = {};

        resOrders.data.forEach(
          (order: { items: { productName?: string; total: number }[] }) => {
            order.items.forEach((item) => {
              const product = item.productName || "Sản phẩm khác";
              const revenue = item.total;
              grouped[product] = (grouped[product] || 0) + revenue;
            });
          }
        );

        // bang
        const chart = Object.keys(grouped).map((product) => ({
          product,
          revenue: grouped[product],
        }));

        setChartData(chart);
      } catch (error) {
        console.error("Lỗi load dữ liệu dashboard:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Title level={2}>Tổng quan</Title>
      <Row gutter={[16, 16]}>
        {[
          {
            title: "Tổng đơn hàng",
            value: totalOrders,
            icon: <ShoppingCartOutlined style={{ color: "#1677ff" }} />,
          },
          {
            title: "Sản phẩm",
            value: totalProducts,
            icon: <BoxPlotOutlined style={{ color: "#52c41a" }} />,
          },
          {
            title: "Khách hàng (Staff)",
            value: totalCustomers,
            icon: <UserOutlined style={{ color: "#faad14" }} />,
          },
          {
            title: "Doanh thu (₫)",
            value: totalRevenue.toLocaleString(),
            icon: <DollarOutlined style={{ color: "#ff4d4f" }} />,
          },
        ].map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <motion.div
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card>
                <Statistic
                  title={
                    <span>
                      {item.icon} {item.title}
                    </span>
                  }
                  value={
                    typeof item.value === "number" ||
                    typeof item.value === "string"
                      ? item.value
                      : ""
                  }
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Divider />

      <Title level={3}>Biểu đồ doanh thu theo sản phẩm</Title>
      <Card>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#1677ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

export default Dashboard;
