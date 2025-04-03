import { motion } from "framer-motion"
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: any) => {
    const { name, phone, email, message, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [phone]: value,
      [email]: value,
      [message]: value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/hoangquan22022005@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setErrorMsg("Gửi thất bại, vui lòng thử lại sau.");
      }
    } catch (error) {
      setErrorMsg("Lỗi mạng, vui lòng thử lại.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div
        className="container mx-auto relative mb-20"
        style={{ marginBottom: 280 }}
      >
        <div className="relative w-full h-96">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.856854735754!2d105.76310137503257!3d21.03929768061383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab12f4f5a6e3%3A0x3b4a5c8b9b6aaf6c!2zTWl4aXZpdsOg!5e0!3m2!1sen!2s!4v1708661423541!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full md:w-3/4 lg:w-2/3">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Contact Us
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Hãy liên hệ ngay để nhận giải đáp !
          </p>
          {isSubmitted ? (
            <p className="text-green-400 text-lg font-semibold">
              🎉 Cảm ơn bạn đã liên hệ. Mình sẽ phản hồi sớm nhất!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                  placeholder="Nhập email"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold">
                  Nội dung *
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  placeholder="Nhập yêu cầu của bạn"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  defaultValue={""}
                />
              </div>
              {errorMsg && <p className="text-red-400 mb-3">{errorMsg}</p>}
              <button disabled={isLoading} className="mt-6 w-full cursor-pointer bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition shadow-lg">
                {isLoading ? "Đang gửi..." : "Send"}
              </button>
            </form>)}
        </div>
      </div></motion.div>
  );
}
export default Contact;
