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

const { Title, Text } = Typography;

function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resProducts = await API.get("http://localhost:3001/products");
        const resOrders = await API.get("http://localhost:3001/orders");
        const resCustomers = await API.get("http://localhost:3001/customers");

        setTotalProducts(resProducts.data.length);
        setTotalOrders(resOrders.data.length);
        setTotalCustomers(resCustomers.data.length);

        const revenue = resOrders.data.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0
        );
        setTotalRevenue(revenue);

        const delivered = resOrders.data.filter(
          (o: any) => o.status === "Đã giao"
        ).length;
        const processing = resOrders.data.filter(
          (o: any) => o.status === "Đang xử lý"
        ).length;

        setDeliveredCount(delivered);
        setProcessingCount(processing);

        const grouped: Record<string, number> = {};
        resOrders.data.forEach((order: any) => {
          const product = order.productName || "Sản phẩm khác";
          const revenue = order.total || order.price * (order.quantity || 1);
          grouped[product] = (grouped[product] || 0) + revenue;
        });

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

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
            title: "Khách hàng",
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
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card>
                <Statistic
                  title={
                    <span>
                      {item.icon} {item.title}
                    </span>
                  }
                  value={item.value}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Divider />

      <Title level={3}>Thống kê đơn hàng</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Text>Tổng doanh thu</Text>
              <Statistic value={totalRevenue.toLocaleString()} suffix="₫" />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Text>Đơn hàng đã giao</Text>
              <Statistic value={deliveredCount} />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <Text>Đơn hàng đang xử lý</Text>
              <Statistic value={processingCount} />
            </Card>
          </motion.div>
        </Col>
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
