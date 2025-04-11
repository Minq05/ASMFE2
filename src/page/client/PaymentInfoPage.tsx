import React, { useState, useEffect, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPaymentUrl } from "../../others/vnpay";

interface LocationState {
  cartItems: any[];
  totalPrice: number;
}

const PaymentInfoPage: React.FC = () => {
  // Nhận luôn cả cartItems và totalPrice từ state
  const location = useLocation();
  const { cartItems, totalPrice } = (location.state as LocationState) || {
    cartItems: [],
    totalPrice: 0,
  };

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [testCard, setTestCard] = useState({
    bank: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    otp: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm xử lý thanh toán VNPay (lưu đơn hàng vào DB và chuyển hướng tới cổng thanh toán VNPay)
  const handlePaymentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("Người dùng chưa đăng nhập!");
      return;
    }

    // Thông tin thẻ test theo cấu hình VNPay
    const requiredTestCard = {
      bank: "NCB",
      cardNumber: "9704198526191432198",
      cardHolder: "NGUYEN VAN A",
      expiryDate: "07/15",
      otp: "123456",
    };

    if (
      testCard.bank.trim() !== requiredTestCard.bank ||
      testCard.cardNumber.trim() !== requiredTestCard.cardNumber ||
      testCard.cardHolder.trim() !== requiredTestCard.cardHolder ||
      testCard.expiryDate.trim() !== requiredTestCard.expiryDate ||
      testCard.otp.trim() !== requiredTestCard.otp
    ) {
      toast.error("Thông tin thẻ không đúng. Vui lòng nhập đúng thông tin thẻ test.");
      return;
    }

    // Tạo items từ cartItems để lưu vào DB
    const items = cartItems.map((item) => ({
      productId: item.id,
      productName: item.name,
      volume: item.volume || "",
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    // Thiết lập thông tin đơn hàng với trạng thái "Thanh toán thành công"
    const orderData = {
      userId: user.id,
      items,
      totalPrice,
      paymentMethod: "vnpay",
      bank: testCard.bank,
      status: "Thanh toán thành công",
      createdAt: new Date().toISOString(),
    };

    try {
      const jsonResponse = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!jsonResponse.ok) {
        throw new Error("Lỗi khi lưu đơn hàng vào json-server!");
      }
      const jsonResponseData = await jsonResponse.json();
      console.log("Order saved:", jsonResponseData);
      
      // Tạo URL thanh toán VNPay (dùng thông tin đơn hàng và tổng tiền)
      const orderInfo = `Thanh toán đơn hàng của user ${user.id}`;
      const amount = totalPrice;
      const orderId = Date.now().toString();
      const paymentUrl = createPaymentUrl(orderInfo, amount, orderId);
      console.log("Payment URL:", paymentUrl);

      // Chuyển hướng trực tiếp tới cổng thanh toán VNPay
      window.location.href = paymentUrl;
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu đơn hàng");
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Nhập Thông Tin Thẻ Test</h2>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Tổng tiền: {Number(totalPrice).toLocaleString()} VND
      </h3>
      <p className="mb-4">
        Vui lòng nhập chính xác thông tin thẻ test theo bảng dưới đây để thực hiện thanh toán thành công:
      </p>
      <table className="table-auto mb-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1">Ngân hàng</th>
            <th className="border border-gray-300 px-2 py-1">Số thẻ</th>
            <th className="border border-gray-300 px-2 py-1">Tên chủ thẻ</th>
            <th className="border border-gray-300 px-2 py-1">Ngày phát hành</th>
            <th className="border border-gray-300 px-2 py-1">Mật khẩu OTP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-2 py-1">NCB</td>
            <td className="border border-gray-300 px-2 py-1">9704198526191432198</td>
            <td className="border border-gray-300 px-2 py-1">NGUYEN VAN A</td>
            <td className="border border-gray-300 px-2 py-1">07/15</td>
            <td className="border border-gray-300 px-2 py-1">123456</td>
          </tr>
        </tbody>
      </table>
      <form onSubmit={handlePaymentSubmit} className="mt-6 p-4 border rounded-lg">
        <div className="mb-4">
          <label className="block mb-1">Ngân hàng</label>
          <input
            type="text"
            value={testCard.bank}
            onChange={(e) => setTestCard({ ...testCard, bank: e.target.value })}
            className="block w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Số thẻ</label>
          <input
            type="text"
            value={testCard.cardNumber}
            onChange={(e) => setTestCard({ ...testCard, cardNumber: e.target.value })}
            className="block w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tên chủ thẻ</label>
          <input
            type="text"
            value={testCard.cardHolder}
            onChange={(e) => setTestCard({ ...testCard, cardHolder: e.target.value })}
            className="block w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Ngày phát hành (MM/YY)</label>
          <input
            type="text"
            value={testCard.expiryDate}
            onChange={(e) => setTestCard({ ...testCard, expiryDate: e.target.value })}
            className="block w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mật khẩu OTP</label>
          <input
            type="text"
            value={testCard.otp}
            onChange={(e) => setTestCard({ ...testCard, otp: e.target.value })}
            className="block w-full p-2 border"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thanh toán qua VNPay
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PaymentInfoPage;
