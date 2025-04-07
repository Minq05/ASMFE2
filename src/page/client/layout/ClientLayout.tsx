import { Outlet, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useCart } from "../../../contexts/cartContext";
import { Link } from "react-router-dom";  // Import Link từ react-router-dom

function ClientLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { cartQuantity } = useCart(); 

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("Đăng xuất thành công!");
    navigate("/"); 
  };

  return (
    <div>
      {/* Header & nav  */}
      <header className="bg-white shadow-md py-4 px-6 flex flex-col border-b-2 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-serif mt-3 font-bold text-orange-500">
              ASSIGNMENT
            </h1>
          </div>
          <div className="relative w-1/3">
            <nav className="w-full">
              <ul className="flex justify-center space-x-8">
                <li>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-orange-500 transition flex items-center"
                  >
                    <i className="fas fa-home" /> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className="text-gray-700 hover:text-orange-500 transition flex items-center"
                  >
                    <i className="fas fa-store mr-2" /> Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-700 hover:text-orange-500 transition flex items-center"
                  >
                    <i className="fas fa-envelope mr-2" /> Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="space-x-4 relative">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login-client"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-orange-500 transition"
            >
              <i className="fas fa-shopping-cart" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 text-gray-800 dark:text-gray-100">
        <Outlet />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <footer className="bg-blue-900 text-white mt-10 text-center">
        <p className="mt-4 bg-black text-white py-2">© Content footer</p>
      </footer>
    </div>
  );
}

export default ClientLayout;
