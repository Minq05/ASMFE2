import { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { Order } from "../../type/type";

const { Title } = Typography;

function CustomerHistory() {
  const { customerId } = useParams<{ customerId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (customerId) {
      fetchOrders();
    }
  }, [customerId]); // Reload orders when customerId changes

  const fetchOrders = async () => {
    try {
      const res = await API.get<Order[]>("orders");
      console.log(res.data); // Log the API response to inspect
      
      // Lọc các đơn hàng có trạng thái thanh toán thành công và mua hàng thành công
      const customerOrders = res.data.filter(
        (order) => String(order.userId) === customerId &&
                    (order.status === "Thanh toán thành công" || order.status === "Hoàn tất mua hàng")
      );

      console.log(customerOrders); // Log customer orders to inspect

      // Kiểm tra nếu không có đơn hàng nào được tìm thấy
      if (customerOrders.length === 0) {
        message.warning("Không có đơn hàng nào cho khách hàng này với trạng thái thành công.");
      }

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
        // Đảm bảo totalPrice tồn tại; nếu không, tính toán dựa trên items
        const total = record.totalPrice
          ? record.totalPrice
          : record.items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
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