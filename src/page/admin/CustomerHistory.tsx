import { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { Order } from "../../type/type";

const { Title } = Typography;

function CustomerHistory() {
  // Sử dụng customerId thay vì customerName
  const { customerId } = useParams<{ customerId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get<Order[]>("orders");
      // Lọc đơn hàng theo userId (chuyển về string để so sánh)
      const customerOrders = res.data.filter(
        (order) => String(order.userId) === customerId
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
      dataIndex: "items",
      key: "items",
      render: (items: any[]) =>
        items
          .map(
            (p) =>
              `${p.productName ? p.productName.trim() : "Sản phẩm không có tên"} (x${p.quantity})`
          )
          .join(", "),
    },
    {
      title: "Tổng tiền",
      key: "totalAmount",
      render: (_: any, record: any) => {
        const total = record.totalPrice
          ? record.totalPrice
          : record.items.reduce((acc: number, item: any) => acc + item.total, 0);
        return total.toLocaleString() + " VND";
      },
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Lịch sử mua hàng của khách hàng {customerId}</Title>
      <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} bordered />
    </div>
  );
}

export default CustomerHistory;
