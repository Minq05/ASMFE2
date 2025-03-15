import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Cart() {
  interface CartItem {
    image: string;
    // Add other properties of the cart item as needed
  }

  const [carts, setCarts] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/orders");
      setCarts(data);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi hiển thị đơn hàng");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <main className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>
      <div className="flex flex-col space-y-4">
        {/* Cart Item */}
        <div className="flex items-center justify-between border-b pb-4">
          {carts.map((cart) => (
            <div className="flex items-center space-x-4">
              <img
                src={cart.image}
                alt="Product Image"
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">Product Name</h3>
                <p className="text-gray-600">Product Description</p>
              </div>
            </div>
          ))}
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">$20.00</span>
            <input
              type="number"
              defaultValue={1}
              className="w-16 border rounded-lg text-center"
            />
            <button className="text-red-500 hover:text-red-700 transition">
              <i className="fas fa-trash-alt" />
            </button>
          </div>
        </div>
        {/* Repeat Cart Item as needed */}
      </div>
      <div className="mt-6 flex justify-end">
        <a href="./payment.html">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
            Proceed to Checkout
          </button>
        </a>
      </div>
    </main>
  );
}
export default Cart;
