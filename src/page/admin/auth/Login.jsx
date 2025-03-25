import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get("users");
      const user = res.data.find(
        (u) => u.username === username && u.password === password
      );
      if (user && user.role === "admin") {
        localStorage.setItem("adminUser", JSON.stringify(user));
        navigate("/admin");
      } else {
        setError("Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Lỗi hệ thống!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
          Đăng nhập Admin
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Tài khoản
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginAdmin;
