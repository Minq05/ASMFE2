import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function LoginClient() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("http://localhost:3000/users");

      const validUser = data.find(
        (u: { email: string; password: string; }) => u.email === user.email && u.password === user.password
      );

      if (validUser) {
        toast.success("Đăng nhập thành công!");
        navigate("/home"); // Điều hướng về trang Home
      } else {
        toast.error("Sai email hoặc mật khẩu!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi đăng nhập!");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1676748933022-e1183e997436?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D')",
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white backdrop-blur-md shadow-lg rounded-lg p-8 w-96 text-gray-600">
        <h2 className="text-center text-2xl font-semibold mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
              required
            />
            <i className="fa fa-envelope absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
              required
            />
            <i className="fa fa-lock absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Nhớ mật khẩu
            </label>
            <a href="#" className="text-blue-300 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-black cursor-pointer hover:bg-gray-600 text-white py-2 rounded-md"
          >
            Đăng nhập
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Bạn chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-300 hover:underline">
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginClient;
