import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    name: string;
    image: string;
    brand: string;
    createdAt: string;
}

function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [visibleCount, setVisibleCount] = useState(9);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/products");
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi hiển thị sản phẩm!");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const newestProducts = useMemo(() => {
        return [...products]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 8);
    }, [products]);

    return (
        <div>
            {/* Sản phẩm mới nhất - Slideshow */}
            <section className="container mx-auto p-6 text-center">
                <h2 className="text-4xl font-bold mb-4 text-center">Sản phẩm mới nhất</h2>
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={4}
                    navigation
                    autoplay={{ delay: 2000 }}
                    loop={true}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {newestProducts.map((product) => (
                        <SwiperSlide key={product.id}>
                            <Link to={`/shop/${product.id}`}>
                                <div className="text-center p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="rounded-full h-56 w-46 mx-auto transition transform hover:scale-105 hover:shadow-lg cursor-pointer"
                                    />
                                    <p className="mt-2 font-semibold">{product.name}</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Tất cả sản phẩm */}
            <section className="container mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Tất cả sản phẩm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.slice(0, visibleCount).map((product) => (
                        <div
                            key={product.id}
                            className="bg-white h-96 w-full p-4 grid justify-center shadow rounded hover:shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-72 h-56 object-cover"
                            />
                            <p className="mt-2 font-semibold">{product.name}</p>
                            <p className="text-gray-700">Nhãn: {product.brand}</p>
                            <Link to={`/shop/${product.id}`}>
                                <button className="text-orange-500 font-semibold cursor-pointer hover:bg-orange-500 hover:text-white hover:shadow-2xl transition duration-300 border border-orange-500 rounded-lg px-4 py-2 w-full mt-2">
                                    Mua ngay
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Nút xem thêm */}
                {visibleCount < products.length && (
                    <div className="text-center mt-6">
                        <button
                            onClick={handleShowMore}
                            className="text-orange-500 font-semibold hover:bg-orange-500 cursor-pointer hover:text-white hover:shadow-2xl transition duration-300 border border-orange-500 rounded-lg px-4 py-2"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Shop;
