import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import { Category } from "../../type/type";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import API from "../../services/api";
function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const nav = useNavigate();

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("categories");
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá danh mục này?")) {
      try {
        await API.delete(`categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Lỗi xoá danh mục:", error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns: TableProps<Category>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="category"
          style={{ width: 100, height: 100, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => nav(`/admin/category-form/${record.id}`)}
          >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 20 }}>📦 Danh sách danh mục</h2>
          <Button type="primary" onClick={() => nav("/admin/category-form")}>
            ➕ Add category
          </Button>
        </div>
        <Table columns={columns} dataSource={categories} rowKey="id" />
      </motion.div>
    </div>
  );
}

export default ManageCategories;
