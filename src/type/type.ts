// types.ts

export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  productName: string;
  productId: string | null;
  quantity: number;
  price: number;
  total: number;
  status: "Đã giao" | "Đang xử lý" | "Đã hủy" | string; // có thể mở rộng nếu có thêm status khác
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "staff" | string; // mở rộng nếu có thêm quyền
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface VolumeOption {
  type: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  category: string;
  brand: string;
  volume: VolumeOption[];
  image: string;
  description: string;
  createdAt: string;
}
