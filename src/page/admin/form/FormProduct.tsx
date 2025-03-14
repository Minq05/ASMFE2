import React, { useEffect, useState } from "react";
import { Button, Form, Input, Card, message, Select, Spin } from "antd";
import type { FormProps } from "antd";
import axios from "axios";
import { Category, Product } from "../../../type/type";
import { useNavigate, useParams } from "react-router";

const { Option } = Select;

const FormProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSelect, setLoadingSelect] = useState(true);
  const nav = useNavigate();
  const { id } = useParams();

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/categories");
      setCategories(data);
      setLoadingSelect(false);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  // Lấy dữ liệu sản phẩm nếu có id
  const fetchProductId = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/products/${id}`);
      const fixedData = {
        ...data,
        category:
          typeof data.category === "object"
            ? data.category.name
            : data.category,
      };
      form.setFieldsValue(fixedData);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  // Gọi API theo thứ tự: lấy danh mục trước rồi mới lấy sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCategories();
      if (id) {
        await fetchProductId();
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Xử lý khi submit form
  const onFinish: FormProps<Product>["onFinish"] = async (values) => {
    const volume = [
      { type: "100ml", price: 250000 },
      { type: "150ml", price: 280000 },
      { type: "200ml", price: 310000 },
    ];

    const newProduct = { ...values, volume };

    try {
      if (id) {
        await axios.put(`http://localhost:3001/products/${id}`, newProduct);
        message.success("✔️ Cập nhật sản phẩm thành công!");
      } else {
        await axios.post("http://localhost:3001/products", newProduct);
        message.success("✔️ Thêm sản phẩm thành công!");
      }
      form.resetFields();
      nav("/admin/manage-product");
    } catch (error) {
      message.error("❌ Lỗi khi thêm/cập nhật sản phẩm!");
      console.error("Lỗi:", error);
    }
  };

  const onFinishFailed: FormProps<Product>["onFinishFailed"] = (errorInfo) => {
    console.log("Lỗi validate:", errorInfo);
  };

  return (
    <Card
      title={id ? "✏️ Cập nhật sản phẩm" : "🛍️ Thêm sản phẩm mới"}
      style={{ width: "100%", maxWidth: 700, margin: "0 auto", marginTop: 24 }}
    >
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : (
        <Form
          form={form}
          name="addProduct"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<Product>
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<Product>
            label="Tồn kho"
            name="stock"
            rules={[{ required: true, message: "Vui lòng nhập tồn kho!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item<Product>
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục" loading={loadingSelect}>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<Product>
            label="Thương hiệu"
            name="brand"
            rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<Product>
            label="Ảnh sản phẩm"
            name="image"
            rules={[{ required: true, message: "Vui lòng nhập link ảnh!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<Product>
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default FormProduct;
