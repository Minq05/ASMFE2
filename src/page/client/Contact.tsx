function Contact() {
    return (
      <div
        className="container mx-auto relative mb-20"
        style={{ marginBottom: 280 }}
      >
        {/* Bản đồ */}
        <div className="relative w-full h-96">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.856854735754!2d105.76310137503257!3d21.03929768061383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab12f4f5a6e3%3A0x3b4a5c8b9b6aaf6c!2zTWl4aXZpdsOg!5e0!3m2!1sen!2s!4v1708661423541!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {/* Form liên hệ */}
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full md:w-3/4 lg:w-2/3">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Contact Us
          </h2>
          <p className="text-center text-gray-600 mt-2">
            Hãy liên hệ ngay để nhận giải đáp !
          </p>
          <form className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold">
                  Họ và tên *
                </label>
                <input
                  type="text"
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
                  className="w-full p-3 border rounded-lg"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold">Email *</label>
              <input
                type="email"
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
                defaultValue={""}
              />
            </div>
            <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition shadow-lg">
              Liên hệ
            </button>
          </form>
        </div>
      </div>
    );
  }
  export default Contact;
  