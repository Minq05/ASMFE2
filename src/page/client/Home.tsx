import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Category, Product } from "../../type/type";
import { motion } from "framer-motion"

function Home() {
  const [products, setProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount] = useState(6);
  const navigate = useNavigate();
  const randomProduct = products[Math.floor(Math.random() * products.length)];

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/products");
      setProduct(data);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải sản phẩm !");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/categories");
      setCategories(data);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi tải danh mục !");
    }
  };

  const slideShow = () => {
    const slides = document.getElementById("slides");
    let currentIndex = 0;

    function showNextSlide() {
      currentIndex = currentIndex < 2 ? currentIndex + 1 : 0;
      if (slides) {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    }

    const intervalId = setInterval(showNextSlide, 8000);
    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    slideShow();
    fetchCategories();
    fetchProducts();
  }, []);

  const handleShowMore = () => {
    navigate("/shop");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div>
        <section className="relative bg-yellow-200 p-10 flex justify-between items-center hover:bg-yellow-300 transition cursor-pointer">
          <div className="w-full overflow-hidden">
            <div id="slides" className="flex transition-transform duration-500">
              {products.slice(0, 3).map((product, i) => (
                <div
                  key={i}
                  className="min-w-full flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-3xl font-bold">{product.name}</h2>
                    <p className="mt-2">{product.brand}</p>
                    <button className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                      <a href={"/shop/" + product.id}>Shop now</a>
                    </button>
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-lg w-56 h-56 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-left">Danh mục</h3>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((categorie, i) => (
              <Link to={"/categories-product/" + categorie.name}>
                <div
                  key={i}
                  className="bg-white p-4 shadow rounded-lg text-center hover:bg-gray-200 transition cursor-pointer"
                >
                  <img
                    src={categorie.image}
                    alt="Categories"
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  {categorie.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto p-6">
          {randomProduct && (
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-6 hover:shadow-2xl transition duration-300 cursor-pointer">
              <div className="flex-1">
                <h2 className="text-3xl font-bold">{randomProduct.name}</h2>
                <p className="mt-2">
                  Được khách hàng yêu thích và lựa chọn nhiều nhất
                </p>
                <a
                  href={"/shop/" + randomProduct.id}
                  className="text-blue-500 font-semibold mt-4 inline-block hover:underline"
                >
                  Xem chi tiết →
                </a>
              </div>
              <img
                src={randomProduct.image}
                alt={randomProduct.name}
                className="rounded-lg w-64 h-64 object-cover"
              />
            </div>
          )}
        </section>

        <section className="container mx-auto p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-left">Sản phẩm</h3>
          <div className="grid grid-cols-3 gap-4">
            {products.slice(0, visibleCount).map((product, i) => (
              <a href={"/shop/" + product.id}>
                <div key={i}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-md hover:shadow-2xl transition cursor-pointer hover:border-gray-500 hover:border-4"
                  />
                  <h4 className="mt-2 font-semibold">{product.name}</h4>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleShowMore}
              className="text-orange-500 cursor-pointer font-semibold hover:bg-orange-500 hover:text-white hover:shadow-2xl transition duration-300 border border-orange-500 rounded-lg px-4 py-2"
            >
              Xem thêm
            </button>
          </div>
        </section>
      </div></motion.div>
  );
}
export default Home;
