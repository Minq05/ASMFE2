import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Product, VolumeOption } from "../../type/type";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"
import API from "../../services/api";

function ProductDetailClient() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVolume, setSelectedVolume] = useState<VolumeOption | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: number } | null>(null);
    const nav = useNavigate();

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) setUser(JSON.parse(userData));
        } catch (err) {
            console.error("Lỗi khi lấy user từ localStorage:", err);
        }
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchProductDetail = async () => {
            try {
                const { data } = await API.get<Product>(`products/${id}`);
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

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = product?.volume.find((v) => v.type === e.target.value) || null;
        setSelectedVolume(selected);
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để mua hàng!");
            return;
        }

        if (!product || !selectedVolume) return;

        const newItem = {
            productId: product.id,
            productName: product.name,
            volume: selectedVolume.type,
            quantity: 1,
            price: selectedVolume.price,
            total: selectedVolume.price * 1
        };

        nav("/payment", { state: { cartItems: [newItem], totalPrice: newItem.total } });
    };


    const handleAddToCart = async () => {
        if (!user) {
            toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }

        if (!product || !selectedVolume) return;

        try {
            const res = await API.get(`orders?userId=${user.id}`);
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
                const existingItemIndex = existingOrder.items.findIndex(
                    (item: any) => item.productId === product.id && item.volume === selectedVolume.type
                );

                if (existingItemIndex !== -1) {
                    existingOrder.items[existingItemIndex].quantity += 1;
                    existingOrder.items[existingItemIndex].total =
                        existingOrder.items[existingItemIndex].quantity * existingOrder.items[existingItemIndex].price;
                } else {
                    existingOrder.items.push(newItem);
                }

                await API.put(`orders/${existingOrder.id}`, existingOrder);
            } else {
                const newOrder = {
                    userId: user.id,
                    items: [newItem]
                };
                await API.post(`orders`, newOrder);
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div>
                        <img src={product?.image} alt={product?.name} className="w-full rounded-lg shadow" />
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-orange-600 mb-2">{product?.name}</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Thương hiệu: <strong>{product?.brand}</strong></p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Danh mục: <strong>{product?.category}</strong></p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Tồn kho: <strong>{product?.stock}</strong></p>

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

                        <div className="my-4">
                            <h4 className="text-lg font-semibold text-orange-500 mb-2">Mô tả sản phẩm:</h4>
                            <p className="text-gray-700 dark:text-gray-200">{product?.description}</p>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={handleAddToCart}
                                className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-6 py-2 rounded shadow"
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="bg-white border cursor-pointer border-orange-500 text-orange-600 px-6 py-2 rounded hover:bg-orange-100"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div></motion.div>
    );
}

export default ProductDetailClient;
