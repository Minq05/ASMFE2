import { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { Order } from "../../type/type";

const { Title } = Typography;

function CustomerHistory() {
  const { customerName } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get<Order[]>("orders");
      const customerOrders = res.data.filter(
        (order) => order.customerName === customerName
      );
      setOrders(customerOrders);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      message.error("Lỗi khi tải đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products: { name: string; quantity: number }[]) =>
        products.map((p) => `${p.name} (x${p.quantity})`).join(", "),
    },
    { title: "Tổng tiền", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Lịch sử mua hàng của {customerName}</Title>
      <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} bordered />
    </div>
  );
}

export default CustomerHistory;
