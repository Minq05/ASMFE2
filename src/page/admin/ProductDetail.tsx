import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../../type/type";
import { Button, Card, Descriptions, Image, Spin } from "antd";
import { motion } from "framer-motion";
import API from "../../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) return <Spin tip="Đang tải dữ liệu sản phẩm..." />;

  if (!product) return <p>Không tìm thấy sản phẩm!</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card title="📋 Chi tiết sản phẩm" bordered={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
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

            {product.volume?.length > 0 && (
              <Descriptions.Item label="Các loại dung tích">
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {product.volume.map((v, index) => (
                    <li key={index}>
                      {v.type} - {v.price.toLocaleString()}₫
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => navigate(-1)}>
            ⬅ Quay lại
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductDetail;
