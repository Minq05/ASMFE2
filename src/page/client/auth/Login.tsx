import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { User } from "../../../type/type";

// Type cho response trả về từ API
type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

function LoginClient() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const nav = useNavigate();

  const onSubmitForm: SubmitHandler<User> = async (data) => {
    try {
      const res = await axios.post<LoginResponse>(
        "http://localhost:8000/login",
        data
      );

      toast.success("Đăng nhập thành công!");

      // Tạo object user lưu vào localStorage
      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        accessToken: res.data.accessToken,
      };

      // Lưu JSON string vào localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      nav("/");
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập thất bại!");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1676748933022-e1183e997436?w=600&auto=format&fit=crop&q=60')",
      }}
    >
      <div className="bg-white backdrop-blur-md shadow-lg rounded-lg p-8 w-96 text-gray-600">
        <h2 className="text-center text-2xl font-semibold mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="mb-4 relative">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email không được bỏ trống" })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-envelope absolute left-3 top-4 text-gray-600" />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password", {
                required: "Mật khẩu không được bỏ trống",
              })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-lock absolute left-3 top-4 text-gray-600" />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mb-4 text-sm">
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
