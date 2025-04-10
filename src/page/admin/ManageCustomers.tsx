import { useEffect, useState } from "react";
import { Table, Input, Button, message, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { User } from "../../type/type";
import { motion } from "framer-motion";
import API from "../../services/api";
import { debounce } from "lodash"; // Adding debounce for improved search performance

const { Title } = Typography;
const { Search } = Input;

export type Customer = {
  id: string;
  fullname: string;
  address: string;
  email: string;
  phone: string;
};

function ManageCustomers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get<User[]>("users");
      // Lọc các user có role là "staff" hoặc role khác tùy theo mục đích (ở đây dùng cho khách hàng)
      const staffUsers = res.data.filter((user) => user.role === "staff");
      setCustomers(staffUsers);
      setFilteredCustomers(staffUsers);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khách hàng:", err);
      message.error("Lỗi khi tải khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  const handleSearchChange = debounce((value: string) => {
    setSearchTerm(value);
    const filtered = customers.filter((c) =>
      c.fullname.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, 300); // 300ms debounce delay

  const columns: ColumnsType<Customer> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <>
          <Link to={`/admin/customer-history/${record.id}`}>
            <Button type="primary" size="small" ghost>
              History
            </Button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div style={{ padding: 24 }}>
        <Title level={3}>Quản lý khách hàng</Title>

        {/* Tìm kiếm */}
        <Search
          placeholder="Tìm theo tên khách hàng..."
          allowClear
          onChange={(e) => handleSearchChange(e.target.value)} // Trigger on change with debounce
          style={{ width: 300, marginBottom: 16 }}
          value={searchTerm}
        />

        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>
    </motion.div>
  );
}

export default ManageCustomers;
