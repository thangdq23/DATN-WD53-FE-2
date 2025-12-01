import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gửi liên hệ thành công!");
    console.log(form);

    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Liên Hệ Với Chúng Tôi
      </h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT: FORM */}
        <div className="bg-white shadow-xl p-7 rounded-xl border border-gray-100">
          <h3 className="text-xl font-semibold mb-5 text-gray-800">
            Gửi Thắc Mắc Hoặc Hỗ Trợ
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />

            <textarea
              name="message"
              placeholder="Nội dung cần hỗ trợ"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 h-32 focus:ring-2 focus:ring-red-500 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:opacity-90 transition"
            >
              Gửi Liên Hệ
            </button>
          </form>
        </div>

        {/* RIGHT: MAP */}
        <div>
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3799638758637!2d105.7445247750829!3d21.01628608809538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e46cf469cf%3A0xd6f0eef89441f0f9!2sFPT%20Polytechnic!5e0!3m2!1svi!2s!4v1706301499987"              width="100%"
              height="360"
              allowFullScreen=""
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>

          <div className="bg-gray-50 p-5 mt-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">🎬 Rạp Phim MPV</h3>
            <p><b>Địa chỉ:</b> Hà Nội — Việt Nam</p>
            <p><b>Hotline:</b> 0909 123 456</p>
            <p><b>Email:</b> support@moviestar.vn</p>
            <p><b>Giờ làm việc:</b> 8:00 – 22:00</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
