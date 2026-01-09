import React from "react";
import { motion as FM } from "framer-motion";
import { FaStar, FaHeart, FaLightbulb, FaShieldAlt } from "react-icons/fa";
import bannerHero from "../../../../assets/images/banner/banner4.webp";
import bannerImg3 from "../../../../assets/images/banner/banner4.webp";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-slate-900">
      <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
        <img
          src={bannerHero}
          alt="About banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <FM.div
          className="relative z-10 max-w-4xl px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-6xl font-extrabold text-white mb-3">
            Về chúng tôi
          </h1>
          <p className="text-xl text-white/90">
            Hệ thống rạp chiếu phim hàng đầu Việt Nam, mang đến trải nghiệm điện
            ảnh đẳng cấp quốc tế
          </p>
        </FM.div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-4xl font-extrabold text-red-600">15+</p>
            <p className="text-slate-600">Năm Kinh nghiệm</p>
          </FM.div>
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-4xl font-extrabold text-red-600">10+</p>
            <p className="text-slate-600">Cơ Sở trên toàn quốc</p>
          </FM.div>
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-4xl font-extrabold text-red-600">5 triệu+</p>
            <p className="text-slate-600">Khách hàng</p>
          </FM.div>
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-4xl font-extrabold text-red-600">1000+</p>
            <p className="text-slate-600">Phim đã chiếu</p>
          </FM.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <FM.div>
            <h2 className="text-5xl font-extrabold mb-6">
              Câu chuyện của chúng tôi
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Được thành lập từ năm 2009, chúng tôi đã trở thành một trong những hệ
              thống rạp chiếu phim hàng đầu tại Việt Nam...
            </p>
            <p className="text-slate-700 leading-relaxed">
              Từ những ngày đầu khiêm tốn cho đến mạng lưới rạp chiếu phủ rộng
              khắp...
            </p>
          </FM.div>
          <FM.div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={bannerImg3}
              alt="Our story"
              className="w-full h-full object-cover"
            />
          </FM.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <h2 className="text-5xl font-extrabold mb-3">Giá trị cốt lõi</h2>
          <p className="text-slate-600">
            Những giá trị mà chúng tôi luôn hướng tới
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <FM.div className="rounded-2xl bg-white border p-6 text-left shadow-sm">
              <FaStar className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">Hàng đầu</p>
            </FM.div>
            <FM.div className="rounded-2xl bg-white border p-6 text-left shadow-sm">
              <FaHeart className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">Tận tâm</p>
            </FM.div>
            <FM.div className="rounded-2xl bg-white border p-6 text-left shadow-sm">
              <FaLightbulb className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">Sáng tạo</p>
            </FM.div>
            <FM.div className="rounded-2xl bg-white border p-6 text-left shadow-sm">
              <FaShieldAlt className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">An toàn & Tin cậy</p>
            </FM.div>
          </div>
        </div>
      </section>

      <FM.section className="bg-red-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-extrabold">Sẵn sàng và thử?</h2>
          <p className="text-white/90 mt-2">
            Đặt vé ngay hôm nay và tận hưởng những bộ phim tuyệt vời nhất
          </p>
          <a
            href="/showtimes"
            className="inline-block mt-6 px-6 py-3 bg-white text-red-600 font-semibold rounded-lg"
          >
            Xem lịch chiếu
          </a>
        </div>
      </FM.section>
    </div>
  );
};

export default AboutPage;
