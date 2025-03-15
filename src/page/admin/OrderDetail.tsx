// pages/admin/ManageOrderDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Descriptions, Typography, Spin, Alert, Tag, Card } from "antd";
import { Order } from "../../type/type";
import { motion } from "framer-motion";

const { Title } = Typography;

function ManageOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const res = await axios.get<Order>(`http://localhost:3001/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "Đã giao":
        return <Tag color="green">Đã giao</Tag>;
      case "Đang giao":
        return <Tag color="gold">Đang giao</Tag>;
      case "Chờ xử lý":
        return <Tag color="default">Chờ xử lý</Tag>;
      default:
        return <Tag color="gray">{status}</Tag>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card style={{ margin: "24px" }}>
        <Title level={3}>Chi tiết đơn hàng</Title>

        {loading ? (
          <Spin tip="Đang tải dữ liệu..." />
        ) : !order ? (
          <Alert message="Không tìm thấy đơn hàng." type="error" />
        ) : (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Khách hàng">
              {order.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm">
              {order.productName}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng">
              {order.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Đơn giá">
              {order.price.toLocaleString()}₫
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {order.total.toLocaleString()}₫
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(order.status)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </motion.div>
  );
}

export default ManageOrderDetail;
