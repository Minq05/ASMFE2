// types.ts

export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  productName: string;
  productId: string | null;
  quantity: number;
  price: number;
  userId: string;
  createdAt: string;
  total: number;
  status: "Đã giao" | "Đang xử lý" | "Đã hủy" | string; // có thể mở rộng nếu có thêm status khác
}

export interface User {
  id: string;
  userId: string;
  fullname: string;
  phone: string;
  address: string;
  confirmPassword: string;
  email: string;
  password: string;
  createdAt: string;
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
  category: any;
  brand: string;
  volume: VolumeOption[];
  image: string;
  description: string;
  createdAt: string;
  key: string;
}

export interface CartItem {
  productId: number;
  productName: string;
  volume: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}
