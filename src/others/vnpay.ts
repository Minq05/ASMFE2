// src/vnpay.ts
import * as CryptoJS from "crypto-js";

const vnp_TmnCode = "CBAYBK24";
const vnp_HashSecret = "S8H5AK9AR4LL93H97TUX910K5R4NSWY9";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:3000/payment-return"; // URL chuyển hướng sau thanh toán

export interface VnpayParams {
  [key: string]: string | number;
}

const sortObject = (obj: VnpayParams): VnpayParams => {
  const sorted: VnpayParams = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
};

export const createPaymentUrl = (
  orderInfo: string,
  amount: number,
  orderId: string
): string => {
  // Lấy thời gian hiện tại theo định dạng yyyyMMddHHmmss
  const now = new Date();
  const createDate = now
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);

  // Giả sử IP của khách hàng (có thể lấy từ window.location hoặc gán tĩnh cho assignment)
  const ipAddr = "127.0.0.1";

  // Thiết lập các tham số theo yêu cầu của VNPAY
  let vnp_Params: VnpayParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId, // Mã giao dịch duy nhất
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // Số tiền tính theo đơn vị "x100"
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Sắp xếp tham số theo thứ tự bảng chữ cái
  vnp_Params = sortObject(vnp_Params);

  // Tạo chuỗi để ký
  const signData = Object.keys(vnp_Params)
    .map((key) => `${key}=${vnp_Params[key]}`)
    .join("&");

  // Tạo chữ ký HMAC-SHA512
  const hmac = CryptoJS.HmacSHA512(signData, vnp_HashSecret);
  const secureHash = CryptoJS.enc.Hex.stringify(hmac);

  // Thêm chữ ký vào tham số
  vnp_Params["vnp_SecureHashType"] = "HMAC-SHA512";
  vnp_Params["vnp_SecureHash"] = secureHash;

  // Tạo query string
  const queryString = Object.keys(vnp_Params)
    .map((key) => `${key}=${encodeURIComponent(vnp_Params[key].toString())}`)
    .join("&");

  return `${vnp_Url}?${queryString}`;
};
