import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import { Order, Product } from "../../type/type";
import { motion } from "framer-motion";

function CustomerHistory() {
  const { customerName } = useParams<{ customerName: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>("http://localhost:3000/orders");
      const customerOrders = res.data.filter(
        (order) => order.customerName === customerName
      );
      setOrders(customerOrders);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>("http://localhost:3000/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const getProductImage = (productName: string): string => {
    const product = products.find((p) =>
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    return product?.image || "https://via.placeholder.com/100";
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Hình",
      dataIndex: "productName",
      key: "image",
      render: (productName: string) => (
        <img
          src={getProductImage(productName)}
          alt={productName}
          style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 4 }}
        />
      ),
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
      render: (price: number) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `${total.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: 12,
            backgroundColor:
              status === "Đã giao"
                ? "#d1fae5"
                : status === "Đang xử lý"
                ? "#fef3c7"
                : "#e5e7eb",
            color:
              status === "Đã giao"
                ? "#065f46"
                : status === "Đang xử lý"
                ? "#92400e"
                : "#374151",
          }}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Lịch sử đơn hàng của {customerName}
      </h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default CustomerHistory;
