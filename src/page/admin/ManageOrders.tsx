// pages/admin/ManageOrders.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Select, Button, message, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { Order } from "../../type/type";
import { motion } from "framer-motion";

const { Title } = Typography;
const { Option } = Select;

function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>("http://localhost:3000/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      message.error("Lỗi khi tải đơn hàng!");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const orderToUpdate = orders.find((order) => order.id === id);
      if (!orderToUpdate) return;

      const updatedOrder = { ...orderToUpdate, status: newStatus };
      await axios.put(`http://localhost:3000/orders/${id}`, updatedOrder);

      const updatedOrders = orders.map((order) =>
        order.id === id ? updatedOrder : order
      );
      setOrders(updatedOrders);
      message.success("Cập nhật trạng thái đơn hàng thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()}₫`,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `${total.toLocaleString()}₫`,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record: Order) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Option value="Chờ xử lý">Chờ xử lý</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Đã giao">Đã giao</Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: Order) => (
        <Button
          type="primary"
          size="small"
          onClick={() => navigate(`/admin/manage-orders/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Title level={3} style={{ marginBottom: 20 }}>
          Quản lý đơn hàng
        </Title>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          bordered
        />
      </motion.div>
    </div>
  );
}

export default ManageOrders;
