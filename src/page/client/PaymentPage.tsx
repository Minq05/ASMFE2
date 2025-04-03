// src/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LocationState {
  cartItems: any[];
  totalPrice: number;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice } = (location.state as LocationState) || { cartItems: [], totalPrice: 0 };

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'vnpay' | 'cod'>('vnpay');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleVnpayPayment = () => {
    if (!user) {
      toast.error('Người dùng chưa đăng nhập!');
      return;
    }
    navigate('/payment-info', { state: { cartItems, totalPrice } });
  };

  // src/PaymentPage.tsx
const handleCODSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!user) {
    toast.error('Người dùng chưa đăng nhập!');
    return;
  }

  const formData = new FormData(e.currentTarget);
  const items = cartItems.map(item => ({
    productId: item.id,
    productName: item.name,
    volume: item.volume || '',
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price
  }));

  const orderData = {
    userId: user.id,
    items,
    totalPrice,
    paymentMethod: 'COD',
    bank: null,
    status: 'Đang xử lý',
    createdAt: new Date().toISOString()
  };

  try {
    const jsonResponse = await fetch('http://localhost:8000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!jsonResponse.ok) {
      throw new Error('Lỗi khi lưu đơn hàng vào json-server!');
    }
    const jsonResponseData = await jsonResponse.json();
    console.log('JSON Server Response:', jsonResponseData);

    toast.success('Đặt hàng thành công! Đơn hàng đang được xử lý.');

    // Chuyển hướng đến trang payment-success và truyền dữ liệu
    navigate('/payment-success', {
      state: {
        totalPrice,
        paymentMethod: 'COD', // hoặc 'Credit Card' nếu cần
      }
    });

  } catch (error) {
    toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    console.error('Lỗi:', error);
  }
};


  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Thanh toán đơn hàng</h2>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Tổng tiền: {Number(totalPrice).toLocaleString()} VND
      </h3>

      <div className="mb-6">
        <label className="block mb-2">
          <input
            type="radio"
            value="vnpay"
            checked={selectedPayment === 'vnpay'}
            onChange={() => setSelectedPayment('vnpay')}
          />
          <span className="ml-2">Thanh toán qua VNPAY</span>
        </label>
        <label className="block">
          <input
            type="radio"
            value="cod"
            checked={selectedPayment === 'cod'}
            onChange={() => setSelectedPayment('cod')}
          />
          <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
        </label>
      </div>

      {selectedPayment === 'vnpay' ? (
        <button
          onClick={handleVnpayPayment}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thanh toán qua VNPAY
        </button>
      ) : (
        <form onSubmit={handleCODSubmit} className="mt-6 p-4 border rounded-lg">
          <input type="text" name="name" placeholder="Họ tên" required className="block w-full p-2 mb-2 border" />
          <input type="text" name="phone" placeholder="Số điện thoại" required className="block w-full p-2 mb-2 border" />
          <input type="text" name="address" placeholder="Địa chỉ" required className="block w-full p-2 mb-2 border" />
          <textarea name="note" placeholder="Lời nhắn" className="block w-full p-2 mb-2 border" />
          <button type="submit" className="mt-4 w-full bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            Xác nhận thanh toán
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default PaymentPage;