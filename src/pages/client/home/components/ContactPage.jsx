import React, { useState } from "react";
import { motion as FM } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaYoutube, FaTimes } from "react-icons/fa";
import bannerHero from "../../../../assets/images/banner/banner4.webp";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });

  const messageLimit = 500;
  const messageCount = form.message.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "message" ? value.slice(0, messageLimit) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gửi liên hệ thành công!");
    console.log(form);
    setForm({ name: "", email: "", phone: "", topic: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative h-[420px] flex items-center justify-center text-center overflow-hidden">
        <img src={bannerHero} alt="Contact banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <FM.div
          className="relative z-10 max-w-5xl px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-3">Liên hệ với chúng tôi</h1>
          <p className="text-lg md:text-xl text-white/90">Chúng tôi sẵn sàng hỗ trợ bạn</p>
        </FM.div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Info */}
        <FM.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-3xl font-extrabold mb-6">Thông Tin ™</h2>
          <div className="space-y-5">
            <InfoItem icon={<FaMapMarkerAlt />} title="Chi" text1="72 Lê Thánh Tôn, Quận 1" text2="Thành phố Hồ Chí Minh, Việt Nam" />
            <InfoItem icon={<FaPhoneAlt />} title="Điện" text1="Đường dây nóng: 1900 1234" text2="Di động: +84 123 456 789" />
            <InfoItem icon={<FaEnvelope />} title="E-mail" text1="info@cinema.vn" text2="support@cinema.vn" />
            <InfoItem icon={<FaClock />} title="Giờ làm việc" text1="Thứ 2 - Chủ Nhật: 8:00 - 23:00" text2="Ngày lễ: 9:00 - 22:00" />
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-3">Kết nối với chúng tôi</p>
            <div className="flex items-center gap-3">
              <SocialLink href="https://facebook.com" label="Facebook" icon={<FaFacebook />} />
              <SocialLink href="https://instagram.com" label="Instagram" icon={<FaInstagram />} />
              <SocialLink href="https://youtube.com" label="YouTube" icon={<FaYoutube />} />
              <SocialLink href="#" label="Zalo" icon={<FaTimes />} />
            </div>
          </div>
        </FM.div>

        {/* Right: Form */}
        <FM.div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
          <h3 className="text-2xl font-bold mb-4">Gửi Tin</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập họ và tên của bạn"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số Điện</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="0123 456 789"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chủ đề *</label>
                <select
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                >
                  <option value="" disabled>chọn chủ đề</option>
                  <option value="booking">Đặt vé</option>
                  <option value="promotion">Khuyến mãi</option>
                  <option value="support">Hỗ trợ kỹ thuật</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nội Dung *</label>
              <textarea
                name="message"
                placeholder="Nhập tin nhắn nội dung của bạn (tối đa 500 ký tự)"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 h-32 focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
              <div className="text-right text-xs text-slate-500 mt-1">{messageCount}/{messageLimit} ký tự</div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:opacity-95 transition"
            >
              Gửi Tin
            </button>
          </form>
        </FM.div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-extrabold mb-5 text-center">Vị Trí Của Chúng Tôi</h2>
        <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3799638758637!2d105.7445247750829!3d21.01628608809538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e46cf469cf%3A0xd6f0eef89441f0f9!2sFPT%20Polytechnic!5e0!3m2!1svi!2s!4v1706301499987"
            width="100%"
            height="420"
            allowFullScreen=""
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, title, text1, text2 }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50">
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
      {icon}
    </div>
    <div>
      <p className="font-semibold m-0">{title}</p>
      <p className="text-slate-700 m-0 text-sm">{text1}</p>
      <p className="text-slate-700 m-0 text-sm">{text2}</p>
    </div>
  </div>
);

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-red-600 hover:text-white transition"
  >
    {icon}
  </a>
);

export default ContactPage;
