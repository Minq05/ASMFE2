// page/admin/ProductDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../../type/type";
import { Button, Card, Descriptions, Image } from "antd";
import { motion } from "framer-motion";
import API from "../../services/api";

function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProductDetail = async () => {
    try {
      const { data } = await API.get(`products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  if (!product) return <p>Đang tải dữ liệu sản phẩm...</p>;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card title="📋 Chi tiết sản phẩm" bordered={false}>
          <div style={{ display: "flex", gap: 24 }}>
            <Image
              width={300}
              src={product.image}
              alt={product.name}
              style={{ borderRadius: 12, objectFit: "cover" }}
            />

            <Descriptions
              title={product.name}
              bordered
              column={1}
              layout="vertical"
              style={{ width: "100%" }}
            >
              <Descriptions.Item label="Danh mục">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu">
                {product.brand}
              </Descriptions.Item>
              <Descriptions.Item label="Tồn kho">
                {product.stock}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {product.description}
              </Descriptions.Item>
              {/* Nếu có volumes và prices, có thể hiển thị luôn */}
              {product.volumes && Array.isArray(product.volumes) && (
                <Descriptions.Item label="Các loại dung tích">
                  <ul>
                    {product.volumes.map((v: any, index: number) => (
                      <li key={index}>
                        {v.size}ml - {v.price.toLocaleString()}₫
                      </li>
                    ))}
                  </ul>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={() => nav(-1)}>
              ⬅ Quay lại
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default ProductDetail;
