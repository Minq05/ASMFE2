import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Product, VolumeOption } from "../../type/type";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import API from "../../services/api";

function ProductDetailClient() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVolume, setSelectedVolume] = useState<VolumeOption | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [otherProducts, setOtherProducts] = useState<Product[]>([]);
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

                const res = await API.get<Product[]>("products");
                setOtherProducts(res.data.filter(p => p.id !== data.id));
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

    const handleQuantityChange = (type: "increase" | "decrease") => {
        setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1));
    };
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) setUser(JSON.parse(userData));
        } catch (err) {
            console.error("Lỗi khi lấy user từ localStorage:", err);
        }
    }, []);

    const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!user) {
            toast.warning("Vui lòng đăng nhập để mua hàng!");
            return;
        }

        if (!product || !selectedVolume) return;

        const newItem = {
            productId: product.id,
            productName: product.name,
            volume: selectedVolume.type,
            quantity: quantity,
            price: selectedVolume.price,
            total: selectedVolume.price * quantity
        };

        nav("/payment", { state: { cartItems: [newItem], totalPrice: newItem.total } });
    };

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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
                quantity: quantity,
                price: selectedVolume.price,
                total: selectedVolume.price * quantity
            };

            if (existingOrder) {
                const existingItemIndex = existingOrder.items.findIndex(
                    (item: any) => item.productId === product.id && item.volume === selectedVolume.type
                );

                if (existingItemIndex !== -1) {
                    existingOrder.items[existingItemIndex].quantity += quantity;
                    existingOrder.items[existingItemIndex].total =
                        existingOrder.items[existingItemIndex].quantity *
                        existingOrder.items[existingItemIndex].price;
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
            alert("Đã thêm vào giỏ hàng!");
        } catch (err) {
            console.error("Lỗi thêm giỏ hàng:", err);
            toast.error("Thêm vào giỏ hàng thất bại!");
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải chi tiết sản phẩm...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div>
                        <img src={product?.image} alt={product?.name} className="w-96 h-96 rounded-lg shadow" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-orange-600 mb-2">{product?.name}</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Thương hiệu: <strong>{product?.brand}</strong>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Danh mục: <strong>{product?.category}</strong>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Tồn kho: <strong>{product?.stock}</strong>
                        </p>

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

                        <div className="flex items-center space-x-4 my-4">
                            <button onClick={() => handleQuantityChange("decrease")} className="px-3 py-1 border rounded">-</button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantityChange("increase")} className="px-3 py-1 border rounded">+</button>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                type="button"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                type="button"
                                className="bg-white border border-orange-500 text-orange-600 px-6 py-2 rounded hover:bg-orange-100"
                                onClick={handleBuyNow}
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Sản phẩm khác</h2>
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={5}
                    navigation
                    autoplay={{ delay: 2000 }}
                    loop={true}
                    breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                >
                    {otherProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <Link to={`/shop/${product.id}`}>
                                <div className="text-center p-4">
                                    <img src={product.image} alt={product.name} className="rounded-full h-56 w-46 mx-auto transition transform hover:scale-105 hover:shadow-lg cursor-pointer" />
                                    <p className="mt-2 font-semibold">{product.name}</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </motion.div>
    );
}

export default ProductDetailClient;
