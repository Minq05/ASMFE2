import { useEffect, useState } from "react";
import { Table, Select, message } from "antd";
import axios from "axios";
import { Order, User } from "../../type/type";

const { Option } = Select;

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải đơn hàng");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải danh sách người dùng");
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullname : "Không xác định";
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    { title: "Người mua", dataIndex: "userId", key: "userId", render: getUserName },
    { title: "Tổng tiền", dataIndex: "totalPrice", key: "totalPrice", render: price => `${price.toLocaleString()} VND` },
    { title: "Phương thức thanh toán", dataIndex: "paymentMethod", key: "paymentMethod" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select defaultValue={status} onChange={newStatus => handleStatusChange(record.id, newStatus)}>
          <Option value="Đang xử lý">Đang xử lý</Option>
          <Option value="Đang xử lý">Thanh toán thành công</Option>
          <Option value="Đang xử lý">Đang giao hàng</Option>
          <Option value="Đang xử lý">Chưa thanh toán</Option>
          <Option value="Đang xử lý">Giao hàng thành công</Option>
        </Select>
      )
    },
    { title: "Ngày đặt hàng", dataIndex: "createdAt", key: "createdAt" }
  ];

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" />
    </div>
  );
};

export default ManageOrders;