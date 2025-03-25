import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Product } from "../../type/type";
import { motion } from "framer-motion"
import API from "../../services/api";

const CategoriesProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Nam", "Nữ", "Unisex"];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("products");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      toast.error("Lỗi khi tải sản phẩm!");
    }
  };

  const filterProducts = () => {
    if (selectedCategory === "Tất cả") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="p-4">
        <div className="mb-6 grid justify-center">
          <h3 className="text-5xl font-extrabold mb-4 text-center text-gray-800 dark:text-white">
            Danh mục
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full border cursor-pointer ${selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Danh sách sản phẩm
          </h3>
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm nào.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
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
                  <p className="text-gray-700">Danh mục: {product.category}</p>
                  <a href={`/shop/${product.id}`}>
                    <button className="text-orange-500 font-semibold cursor-pointer hover:bg-orange-500 hover:text-white hover:shadow-2xl transition duration-300 border border-orange-500 rounded-lg px-4 py-2 w-full mt-2">
                      Mua ngay
                    </button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div></motion.div>
  );
};

export default CategoriesProduct;
