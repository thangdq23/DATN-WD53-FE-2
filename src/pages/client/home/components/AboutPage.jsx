import React from "react";
import { motion as FM } from "framer-motion";
import { FaStar, FaHeart, FaLightbulb, FaShieldAlt } from "react-icons/fa";
import bannerHero from "../../../../assets/images/banner/banner4.webp";
import bannerImg3 from "../../../../assets/images/banner/banner4.webp";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-slate-900">
      <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
        <img src={bannerHero} alt="About banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <FM.div
          className="relative z-10 max-w-4xl px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-6xl font-extrabold text-white mb-3">Về chúng tôi</h1>
          <p className="text-xl text-white/90">Hệ thống rạp chiếu phim hàng đầu Việt Nam, mang đến trải nghiệm điện ảnh đẳng cấp quốc tế</p>
        </FM.div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
            <p className="text-4xl font-extrabold text-red-600">15+</p>
            <p className="text-slate-600">Năm Kinh nghiệm</p>
          </FM.div>
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
            <p className="text-4xl font-extrabold text-red-600">10+</p>
            <p className="text-slate-600">Cơ Sở trên toàn quốc</p>
          </FM.div>
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
            <p className="text-4xl font-extrabold text-red-600">5 triệu+</p>
            <p className="text-slate-600">Khách hàng</p>
          </FM.div>
          <FM.div className="rounded-2xl bg-red-50 p-6 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
            <p className="text-4xl font-extrabold text-red-600">1000+</p>
            <p className="text-slate-600">Phim đã chiếu</p>
          </FM.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <FM.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
            <h2 className="text-5xl font-extrabold mb-6">Câu chuyện của chúng tôi</h2>
            <p className="text-slate-700 leading-relaxed mb-4">Được thành lập từ năm 2009, chúng tôi đã trở thành một trong những hệ thống rạp chiếu phim hàng đầu tại Việt Nam. Với sứ mệnh mang đến những trải nghiệm điện ảnh tuyệt vời nhất cho khán giả, chúng tôi không ngừng đầu tư vào công nghệ hiện đại và nâng cao chất lượng dịch vụ.</p>
            <p className="text-slate-700 leading-relaxed">Từ những ngày đầu khiêm tốn cho đến mạng lưới rạp chiếu phủ rộng khắp, mỗi phòng đều được trang bị âm thanh hình ảnh chuẩn mực, cùng đội ngũ nhân viên nhiệt tình sẵn sàng hỗ trợ khách hàng.</p>
          </FM.div>
          <FM.div className="rounded-2xl overflow-hidden shadow-xl" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
            <img src={bannerImg3} alt="Our story" className="w-full h-full object-cover" />
          </FM.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <h2 className="text-5xl font-extrabold mb-3">Giá trị cốt lõi</h2>
          <p className="text-slate-600">Những giá trị mà chúng tôi luôn hướng tới</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <FM.div className="rounded-2xl bg-white border border-slate-200 p-6 text-left shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
              <FaStar className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">Hàng đầu</p>
              <p className="text-slate-600 text-sm mt-1">Cam kết mang đến trải nghiệm xem phim tốt nhất với công nghệ hiện đại và dịch vụ chuyên nghiệp.</p>
            </FM.div>
            <FM.div className="rounded-2xl bg-white border border-slate-200 p-6 text-left shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
              <FaHeart className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">Tận tâm</p>
              <p className="text-slate-600 text-sm mt-1">Đội ngũ luôn sẵn sàng hỗ trợ và mang lại sự hài lòng cho khách hàng.</p>
            </FM.div>
            <FM.div className="rounded-2xl bg-white border border-slate-200 p-6 text-left shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
              <FaLightbulb className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">Sáng tạo</p>
              <p className="text-slate-600 text-sm mt-1">Không ngừng cập nhật và đổi mới để mang đến những trải nghiệm khác biệt.</p>
            </FM.div>
            <FM.div className="rounded-2xl bg-white border border-slate-200 p-6 text-left shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
              <FaShieldAlt className="text-red-500 text-2xl mb-3" />
              <p className="font-semibold">An toàn & Tin cậy</p>
              <p className="text-slate-600 text-sm mt-1">Môi trường xem phim an toàn, sạch sẽ, đảm bảo tiêu chuẩn nghiêm ngặt.</p>
            </FM.div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-5xl font-extrabold text-center">Đội ngũ lãnh đạo</h2>
          <p className="text-center text-slate-600 mt-2">Những con người có tài năng đứng sau thành công của chúng tôi</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Nguyễn Minh Phú",
                role: "Giám đốc Điều hành (CEO)",
                image:
                  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
              },
              {
                name: "Trần Thu Hà",
                role: "Giám đốc Vận hành (COO)",
                image:
                  "https://images.unsplash.com/photo-1544005311-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
              },
              {
                name: "Lê Quang Huy",
                role: "Giám đốc Marketing (CMO)",
                image:
                  "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?auto=format&fit=crop&w=800&q=80",
              },
              {
                name: "Phạm Bích Ngọc",
                role: "Giám đốc Công nghệ (CTO)",
                image:
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=800&q=80",
              },
            ].map((member) => (
              <FM.div key={member.name} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, amount: 0.2 }}>
                <img src={member.image} alt={member.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-slate-600 text-sm">{member.role}</p>
                </div>
              </FM.div>
            ))}
          </div>
        </div>
      </section>

      <FM.section className="bg-red-600 text-white" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-extrabold">Sẵn sàng và thử?</h2>
          <p className="text-white/90 mt-2">Đặt vé ngay hôm nay và tận hưởng những bộ phim tuyệt vời nhất</p>
          <a href="/showtimes" className="inline-block mt-6 px-6 py-3 bg.white text-red-600 font-semibold rounded-lg">Xem lịch chiếu</a>
        </div>
      </FM.section>
    </div>
  );
};

export default AboutPage;
