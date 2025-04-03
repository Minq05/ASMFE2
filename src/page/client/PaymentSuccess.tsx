// src/PaymentSuccess.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalPrice, paymentMethod } = location.state || { totalPrice: 0, paymentMethod: "COD" };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
      {loading ? (
        <div className="text-2xl font-bold text-gray-500">Đang xử lý ...</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-green-500 mb-4">
            {paymentMethod === "Credit Card" ? "Thanh toán thành công!" : "Đơn hàng đã được tạo thành công!"}
          </h2>
          <p className="text-lg">
            {paymentMethod === "Credit Card"
              ? `Tổng tiền đã thanh toán: ${totalPrice.toLocaleString()} VND`
              : `Bạn sẽ thanh toán ${totalPrice.toLocaleString()} VND khi nhận hàng.`}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 cursor-pointer hover:bg-orange-600 bg-orange-500 text-white px-6 py-2 rounded-lg"
          >
            Tiếp tục mua hàng
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
