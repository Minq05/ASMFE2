// src/PaymentInfoPage.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPaymentUrl } from '../../others/vnpay';

interface LocationState {
    cartItems: any[];
    totalPrice: number;
}

const PaymentInfoPage: React.FC = () => {
    const location = useLocation();
    const { cartItems, totalPrice } = (location.state as LocationState) || { cartItems: [], totalPrice: 0 };

    const [user, setUser] = useState<{ id: string } | null>(null);
    const [testCard, setTestCard] = useState({
        bank: '',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        otp: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handlePaymentSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            toast.error('Người dùng chưa đăng nhập!');
            return;
        }
        // Kiểm tra thông tin thẻ test
        const requiredTestCard = {
            bank: 'NCB',
            cardNumber: '9704198526191432198',
            cardHolder: 'NGUYEN VAN A',
            expiryDate: '07/15',
            otp: '123456',
        };

        if (
            testCard.bank !== requiredTestCard.bank ||
            testCard.cardNumber !== requiredTestCard.cardNumber ||
            testCard.cardHolder !== requiredTestCard.cardHolder ||
            testCard.expiryDate !== requiredTestCard.expiryDate ||
            testCard.otp !== requiredTestCard.otp
        ) {
            toast.error('Thông tin thẻ không đúng. Vui lòng nhập đúng thông tin thẻ test.');
            return;
        }

        // Thiết lập thông tin đơn hàng và chuyển hướng thanh toán
        const orderInfo = `Thanh toán đơn hàng của user ${user.id}`;
        const amount = totalPrice; // Số tiền (VND)
        const orderId = Date.now().toString(); // Mã đơn hàng duy nhất dựa vào timestamp

        const paymentUrl = createPaymentUrl(orderInfo, amount, orderId);
        window.location.href = paymentUrl;
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
                    Thanh toán qua VNPAY
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default PaymentInfoPage;
