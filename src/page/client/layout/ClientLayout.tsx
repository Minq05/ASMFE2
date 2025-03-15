import { Outlet } from "react-router";

function ClientLayout() {
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
                  <a
                    href="/"
                    className="text-gray-700 hover:text-orange-500 transition flex items-center"
                  >
                    <i className="fas fa-home" /> Home
                  </a>
                </li>
                <li>
                  <a
                    href="/shop"
                    className="text-gray-700 hover:text-orange-500 transition flex items-center"
                  >
                    <i className="fas fa-store mr-2" /> Shop
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-700 hover:text-orange-500 transition flex items-center"
                  >
                    <i className="fas fa-envelope mr-2" /> Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="space-x-4">
            <a
              href="/login-client"
              className="bg-orange-500 text-white p-6 px-4 py-2 rounded-full hover:bg-orange-600 transition"
            >
              Sign in
            </a>
            <a
              href="/cart"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              <i className="fas fa-shopping-cart" />
            </a>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 text-gray-800 dark:text-gray-100">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-10 text-center">
        <p className="mt-4 bg-black text-white py-2">© Content footer</p>
      </footer>
    </div>
  );
}
export default ClientLayout;
