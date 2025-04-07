import { useEffect, useState } from "react";
import { Table, Select, message, Button } from "antd";
import { Order, User } from "../../type/type";
import API from "../../services/api";

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
      const res = await API.get("orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải đơn hàng");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải danh sách người dùng");
    }
  };

  const getUserName = (userId: any) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullname : "Không xác định";
  };

  const handleStatusChange = async (orderId: any, newStatus: any) => {
    try {
      await API.patch(`orders/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      message.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    {
      title: "Người mua",
      dataIndex: "userId",
      key: "userId",
      render: getUserName,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: any) =>
        typeof price === "number" ? `${price.toLocaleString()} VND` : "0 VND",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: any, record: any) => (
        <Select
          defaultValue={status}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
        >
          <Option value="Đang xử lý">Đang xử lý</Option>
          <Option value="Hoàn tất mua hàng">Hoàn tất mua hàng</Option>
          <Option value="Thanh toán thành công">Thanh toán thành công</Option>
        </Select>
      ),
    },
    { title: "Ngày đặt hàng", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" />
    </div>
  );
};

export default ManageOrders;
