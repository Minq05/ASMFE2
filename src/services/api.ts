// page/admin/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/", // sửa theo cổng json-server của bạn
});

export default API;
