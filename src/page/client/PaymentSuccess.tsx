import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalPrice } = location.state || { totalPrice: 0 };

    return (
        <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
            <h2 className="text-2xl font-bold text-green-500 mb-4">Mua hàng thành công!</h2>
            <p className="text-lg">Tổng tiền đã thanh toán: {totalPrice.toLocaleString()} VND</p>
            <button onClick={() => navigate("/")} className="mt-4 cursor-pointer hover:bg-orange-600 bg-orange-500 text-white px-6 py-2 rounded-lg">Quay về trang chủ</button>
        </div>
    );
}

export default PaymentSuccess;
