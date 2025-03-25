import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import API from "../../services/api";

const banks = [
    { id: "vietcombank", name: "Vietcombank", logo: "https://www.bing.com/th?id=OIP.FCOsyWba4BiGoSt5jPl1dgHaFj&w=254&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" },
    { id: "bidv", name: "BIDV", logo: "https://bizweb.dktcdn.net/100/440/022/articles/seopremier.jpg?v=1670492620640" },
    { id: "tpbank", name: "TPBank", logo: "https://th.bing.com/th/id/OIP.tSogJdgokCviXv3ss4ayEQHaEm?w=269&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    { id: "vnpay", name: "VNPay", logo: "https://www.bing.com/th?id=OIP.dPjj0RmGu4qQ7Rlp8wcSYAHaHa&w=207&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" },
    { id: "vpbank", name: "VPBank", logo: "https://dongphucstore.com/wp-content/uploads/2023/05/logo-1.jpg" },
    { id: "mbbank", name: "MBBank", logo: "https://th.bing.com/th/id/OIP.j4VmH-_rdMwZ_Zj0CycZpwHaEN?w=275&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" }
];

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };
    const [user, setUser] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState<string>("credit_card");
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [cardInfo, setCardInfo] = useState({ name: "", number: "", expiry: "", cvv: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handlePayment = async () => {
        if (!user) {
            toast.error("Người dùng chưa đăng nhập!");
            return;
        }

        if (selectedPayment === "credit_card" && (!selectedBank || !cardInfo.name || !cardInfo.number || !cardInfo.expiry || !cardInfo.cvv)) {
            toast.error("Vui lòng điền đầy đủ thông tin thẻ và chọn ngân hàng!");
            return;
        }

        try {
            const newOrder = {
                userId: user.id,
                items: cartItems,
                totalPrice,
                paymentMethod: selectedPayment === "credit_card" ? "Credit Card" : "COD",
                bank: selectedPayment === "credit_card" ? selectedBank : null,
                status: selectedPayment === "credit_card" ? "Thanh toán thành công" : "Chờ xác nhận", // COD sẽ ở trạng thái "Chờ xác nhận"
                createdAt: new Date().toISOString(),
            };

            await API.post("orders", newOrder);

            if (selectedPayment === "credit_card") {
                await Promise.all(
                    cartItems.map(async (item: any) => {
                        const productRes = await API.get(`products/${item.productId}`);
                        const updatedStock = Number(productRes.data.stock) - Number(item.quantity);

                        if (updatedStock < 0) {
                            toast.error(`Sản phẩm ${item.productName} đã hết hàng!`);
                            return;
                        }

                        await API.patch(`products/${item.productId}`, { stock: updatedStock });
                    })
                );
            }

            navigate("/payment-success", {
                state: {
                    totalPrice,
                    paymentMethod: selectedPayment === "credit_card" ? "Credit Card" : "COD"
                }
            });

        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            toast.error("Thanh toán thất bại, vui lòng thử lại!");
        }
    };


    return (
        <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Chọn Phương Thức Thanh Toán</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Tổng tiền: {Number(totalPrice).toLocaleString()} VND
            </h3>

            <div className="mb-6">
                <label className="block mb-2">
                    <input type="radio" value="credit_card" checked={selectedPayment === "credit_card"} onChange={() => setSelectedPayment("credit_card")} />
                    <span className="ml-2">Thẻ ngân hàng</span>
                </label>
                <label className="block">
                    <input type="radio" value="cod" checked={selectedPayment === "cod"} onChange={() => setSelectedPayment("cod")} />
                    <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
                </label>
            </div>

            {selectedPayment === "credit_card" && (
                <>
                    <h3 className="text-xl font-bold mb-4">Chọn Ngân Hàng</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {banks.map((bank) => (
                            <div key={bank.id}
                                className={`p-4 border rounded-lg cursor-pointer ${selectedBank === bank.id ? "border-blue-500" : ""}`}
                                onClick={() => setSelectedBank(bank.id)}>
                                <img src={bank.logo} alt={bank.name} className="w-full h-16 object-contain" />
                            </div>
                        ))}
                    </div>

                    {selectedBank && (
                        <div className="mt-6 p-4 border rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Nhập Thông Tin Thẻ</h3>
                            <input type="text" name="name" placeholder="Tên chủ thẻ" className="block w-full p-2 mb-2 border"
                                onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })} />

                            <input type="text" name="number" placeholder="Số thẻ" className="block w-full p-2 mb-2 border"
                                onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })} />

                            <div className="flex gap-2">
                                <input type="text" name="expiry" placeholder="MM/YY" className="w-1/2 p-2 border"
                                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })} />

                                <input type="text" name="cvv" placeholder="CVV" className="w-1/2 p-2 border"
                                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })} />
                            </div>
                        </div>
                    )}
                </>
            )}

            <button onClick={handlePayment} className="mt-4 cursor-pointer bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                Xác nhận thanh toán
            </button>
            <ToastContainer />
        </div>
    );
}

export default PaymentPage;
