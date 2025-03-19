import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Product, VolumeOption, Order, CartItem } from "../../type/type";
import "react-toastify/dist/ReactToastify.css";

function ProductDetailClient() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVolume, setSelectedVolume] = useState<VolumeOption | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: number } | null>(null);
    const nav = useNavigate();

    // Lấy thông tin user từ localStorage
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) setUser(JSON.parse(userData));
        } catch (err) {
            console.error("Lỗi khi lấy user từ localStorage:", err);
        }
    }, []);

    // Lấy dữ liệu sản phẩm
    useEffect(() => {
        if (!id) return;

        const fetchProductDetail = async () => {
            try {
                const { data } = await axios.get<Product>(`http://localhost:8000/products/${id}`);
                setProduct(data);
                if (data.volume?.length > 0) setSelectedVolume(data.volume[0]);
            } catch (err) {
                console.error("Lỗi lấy chi tiết sản phẩm:", err);
                setError("Không thể tải sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    // Xử lý thay đổi dung tích
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = product?.volume.find((v) => v.type === e.target.value) || null;
        setSelectedVolume(selected);
    };

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }

        if (!product || !selectedVolume) return;

        try {
            const res = await axios.get(`http://localhost:8000/orders?userId=${user.id}`);
            const orders = Array.isArray(res.data) ? res.data : [];
            let existingOrder = orders[0];

            const newItem = {
                productId: product.id,
                productName: product.name,
                volume: selectedVolume.type,
                quantity: 1,
                price: selectedVolume.price,
                total: selectedVolume.price * 1
            };

            if (existingOrder) {
                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const existingItemIndex = existingOrder.items.findIndex(
                    (item: any) => item.productId === product.id && item.volume === selectedVolume.type
                );

                if (existingItemIndex !== -1) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng tiền
                    existingOrder.items[existingItemIndex].quantity += 1;
                    existingOrder.items[existingItemIndex].total =
                        existingOrder.items[existingItemIndex].quantity * existingOrder.items[existingItemIndex].price;
                } else {
                    // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                    existingOrder.items.push(newItem);
                }

                // Cập nhật giỏ hàng trên server
                await axios.put(`http://localhost:8000/orders/${existingOrder.id}`, existingOrder);
            } else {
                // Nếu chưa có đơn hàng, tạo đơn hàng mới
                const newOrder = {
                    userId: user.id,
                    items: [newItem]
                };
                await axios.post(`http://localhost:8000/orders`, newOrder);
            }

            toast.success("Đã thêm vào giỏ hàng!");
            nav("/cart");
        } catch (err) {
            console.error("Lỗi thêm giỏ hàng:", err);
            toast.error("Thêm vào giỏ hàng thất bại!");
        }
    };


    if (loading) return <div className="text-center py-10">Đang tải chi tiết sản phẩm...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                {/* Hình ảnh sản phẩm */}
                <div>
                    <img src={product?.image} alt={product?.name} className="w-full rounded-lg shadow" />
                </div>

                {/* Thông tin sản phẩm */}
                <div>
                    <h2 className="text-3xl font-bold text-orange-600 mb-2">{product?.name}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Thương hiệu: <strong>{product?.brand}</strong></p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Danh mục: <strong>{product?.category}</strong></p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Tồn kho: <strong>{product?.stock}</strong></p>

                    {/* Chọn dung tích */}
                    <div className="my-4">
                        <h4 className="text-lg font-semibold text-orange-500 mb-2">Chọn dung tích:</h4>
                        <div className="space-y-2">
                            {product?.volume?.map((vol, index) => (
                                <label key={index} className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                                    <input
                                        type="radio"
                                        name="volume"
                                        value={vol.type}
                                        checked={selectedVolume?.type === vol.type}
                                        onChange={handleVolumeChange}
                                        className="text-orange-500 focus:ring-orange-400"
                                    />
                                    <span>
                                        {vol.type} – <span className="font-semibold text-orange-600">{vol.price.toLocaleString()}đ</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mô tả sản phẩm */}
                    <div className="my-4">
                        <h4 className="text-lg font-semibold text-orange-500 mb-2">Mô tả sản phẩm:</h4>
                        <p className="text-gray-700 dark:text-gray-200">{product?.description}</p>
                    </div>

                    {/* Nút Thêm vào giỏ hàng và Mua ngay */}
                    <div className="flex space-x-3 mt-6">
                        <button
                            onClick={handleAddToCart}
                            className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-6 py-2 rounded shadow"
                        >
                            Thêm vào giỏ hàng
                        </button>
                        <button className="bg-white border cursor-pointer border-orange-500 text-orange-600 px-6 py-2 rounded hover:bg-orange-100">
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailClient;
