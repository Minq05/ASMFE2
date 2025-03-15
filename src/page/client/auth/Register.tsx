import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Kiểm tra email đã tồn tại chưa
      const checkEmail = await axios.get(
        `http://localhost:3000/users?email=${user.email}`
      );

      if (checkEmail.data.length > 0) {
        toast.error("Email này đã được đăng ký!");
        return;
      }

      const newUser = {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        password: user.password,
      };

      await axios.post("http://localhost:3000/users", newUser);
      toast.success("Đăng ký thành công! Hãy đăng nhập nhé.");
      navigate("/"); // Điều hướng đến trang đăng nhập
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi khi đăng ký!");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1676748933022-e1183e997436?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    >
      <div className="bg-white backdrop-blur-md shadow-lg rounded-lg p-8 w-96 text-gray-600">
        <h2 className="text-center text-2xl font-semibold mb-4">Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              placeholder="Họ và tên"
              required
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-user absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-envelope absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
              required
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-phone absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              placeholder="Địa chỉ"
              required
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-home absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-lock absolute left-3 top-4 text-gray-600" />
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              required
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-lock absolute left-3 top-4 text-gray-600" />
          </div>
          <button
            type="submit"
            className="w-full bg-black cursor-pointer hover:bg-gray-600 text-white py-2 rounded-md"
          >
            Đăng ký
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Đã có tài khoản?{" "}
            <a href="/login-client" className="text-blue-300 hover:underline">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;