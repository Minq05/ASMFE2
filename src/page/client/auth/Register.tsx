import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { User } from "../../../type/type";
import API from "../../../services/api";

function Register() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();

  const onSubmitForm: SubmitHandler<User> = async (data) => {
    try {
      await API.post("users", { ...data, role: "staff" });
      toast.success("Đăng ký thành công!");
      nav("/login-client");
    } catch (error) {
      console.log(error);
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
        <h2 className="text-center text-2xl font-semibold mb-4">Đăng ký</h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Họ và tên"
              {...register("fullname", { required: "Vui lòng nhập họ tên" })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-user absolute left-3 top-4 text-gray-600" />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không hợp lệ",
                },
              })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-envelope absolute left-3 top-4 text-gray-600" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Số điện thoại"
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
                pattern: {
                  value: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-phone absolute left-3 top-4 text-gray-600" />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Địa chỉ"
              {...register("address", { required: "Vui lòng nhập địa chỉ" })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-home absolute left-3 top-4 text-gray-600" />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu tối thiểu 6 ký tự",
                },
              })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-lock absolute left-3 top-4 text-gray-600" />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu không khớp",
              })}
              className="w-full bg-transparent border border-gray-300 p-3 pl-10 rounded-md focus:outline-none"
            />
            <i className="fa fa-lock absolute left-3 top-4 text-gray-600" />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-600 text-white py-2 rounded-md cursor-pointer"
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
