import { Table, Button, Space, message, Image, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { Product } from "../../type/type";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import API from "../../services/api";

function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const nav = useNavigate();

  const fetchProduct = async () => {
    try {
      const { data } = await API.get("products");
      setProducts(data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleView = (record: Product) => {
    nav(`/admin/product-detail/${record.id}`);
  };

  const handleEdit = (record: Product) => {
    nav(`/admin/product-form/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`products/${id}`);
      message.success("Xoá sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi xoá sản phẩm:", error);
      message.error("Xoá sản phẩm thất bại!");
    }
  };

  const handleAdd = () => {
    nav("/admin/product-form");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_: any, __: Product, index: number) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: any) =>
        typeof category === "object" ? category.name : category,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image
          src={image}
          alt="Product"
          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          <Button onClick={() => handleView(record)} type="primary">
            Chi tiết
          </Button>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
              Xoá
            </Button>
          </Popconfirm>
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
          <h2 style={{ fontSize: 20 }}>📦 Danh sách sản phẩm</h2>
          <Button type="primary" onClick={handleAdd}>
            ➕ Thêm sản phẩm
          </Button>
        </div>
        <Table columns={columns} dataSource={products} rowKey="id" />
      </motion.div>
    </div>
  );
}

export default ManageProducts;
