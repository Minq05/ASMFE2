import { Button, Form, Input, Card, message, Select, Spin } from "antd";
import type { FormProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Category } from "../../../type/type";

const { Option } = Select;

const FormCategory: React.FC = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Lấy dữ liệu danh mục nếu có id
  const fetchCategoryById = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/categories/${id}`
      );
      form.setFieldsValue(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  // Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/categories");
      setCategories(data);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCategories();
      if (id) {
        await fetchCategoryById();
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Xử lý khi submit form
  const onFinish: FormProps<Category>["onFinish"] = async (values) => {
    const volume = [
      { type: "100ml", price: 250000 },
      { type: "150ml", price: 280000 },
      { type: "200ml", price: 310000 },
    ];

    const newCategory = { ...values, volume };

    try {
      if (id) {
        await axios.put(`http://localhost:3001/categories/${id}`, newCategory);
        message.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post("http://localhost:3001/categories", newCategory);
        message.success("Thêm danh mục mới thành công!");
        nav("/admin/manage-category");
      }
      nav("/admin/manage-category");
    } catch (error) {
      console.error("Lỗi thêm mới hoặc cập nhật danh mục:", error);
      message.error("Thao tác thất bại!");
    }
  };

  const onFinishFailed: FormProps<Category>["onFinishFailed"] = (errorInfo) => {
    console.log("Lỗi validate:", errorInfo);
  };

  return (
    <Card
      title={id ? "✏️ Cập nhật danh mục" : "🛍️ Thêm danh mục mới"}
      style={{ width: "100%", maxWidth: 700, margin: "0 auto", marginTop: 24 }}
    >
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : (
        <Form
          form={form}
          name="addCategory"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<Category>
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<Category>
            label="Ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng nhập ảnh!" }]}
          >
            <Input />
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

export default FormCategory;
