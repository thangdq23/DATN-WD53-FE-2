import React from "react";
import { motion as FM } from "framer-motion";
import bannerHero from "../../../../assets/images/banner/banner3.png";

const RulePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative h-[420px] flex items-center justify-center text-center overflow-hidden">
        <img src={bannerHero} alt="Rule banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <FM.div
          className="relative z-10 max-w-5xl px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">Điều khoản & Quy định</h1>
          <p className="text-lg md:text-xl text-white/90">Áp dụng cho hệ thống rạp MVP Ticket</p>
        </FM.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <FM.section
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold mb-5">I. Nội quy phòng chiếu</h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-700">
            <li>Không quay phim, chụp ảnh trong rạp để đảm bảo quyền riêng tư của mọi khách hàng.</li>
            <li>Tắt hoặc để chế độ im lặng điện thoại khi vào phòng chiếu.</li>
            <li>Không hút thuốc, kể cả thuốc lá điện tử.</li>
            <li>Không gây mất trật tự, la hét, ném đồ hoặc làm phiền người khác.</li>
            <li>Không nhai kẹo cao su hoặc đồ ăn gây tiếng động trong phòng chiếu.</li>
            <li>Không mang thú cưng hoặc động vật nuôi vào rạp.</li>
            <li>Bảo quản tài sản cá nhân cẩn thận; rạp không chịu trách nhiệm mất mát tài sản.</li>
            <li>Chỉ thức ăn, nước uống mua tại MVP Ticket mới được phép mang vào.</li>
            <li>Không sử dụng đồ uống có cồn hoặc các chất kích thích trong khuôn viên rạp.</li>
            <li>Sau 22 giờ, không phục vụ khách dưới 13 tuổi; sau 23 giờ, không phục vụ khách dưới 16 tuổi.</li>
            <li>Rạp có quyền từ chối phục vụ nếu khách vi phạm nội quy hoặc gây nguy hiểm cho người khác.</li>
            <li>Hệ thống camera an ninh hoạt động 24/7 để đảm bảo an toàn.</li>
            <li>Mọi thắc mắc liên hệ trực tiếp nhân viên quầy vé hoặc hotline.</li>
          </ul>
        </FM.section>

        <FM.section
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold mb-5">II. Phân loại phim theo độ tuổi</h2>
          <h3 className="text-xl font-semibold mt-5 mb-3">1. Phân loại phim</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>P – Dành cho mọi độ tuổi.</li>
            <li>K – Trẻ dưới 13 tuổi cần người bảo hộ đi cùng.</li>
            <li>T13 – Từ 13 tuổi trở lên.</li>
            <li>T16 – Từ 16 tuổi trở lên.</li>
            <li>T18 – Từ 18 tuổi trở lên.</li>
            <li>C – Không được phép phổ biến.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-5 mb-3">2. Lưu ý</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Khách xem phim T13 – T18 cần mang giấy tờ tùy thân để đối chiếu độ tuổi.</li>
            <li>Gồm CCCD, thẻ học sinh – sinh viên, giấy khai sinh hoặc giấy tờ hợp lệ khác.</li>
            <li>Việc phân loại dựa trên hướng dẫn của cơ quan quản lý văn hóa.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-5 mb-3">3. Chế tài</h3>
          <p className="text-slate-700">Phạt 60.000.000đ – 80.000.000đ nếu không đảm bảo đúng độ tuổi theo phân loại.</p>
        </FM.section>

        <FM.section
          className="mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold mb-5">III. Quy định khung giờ chiếu cho trẻ em</h2>
          <h3 className="text-xl font-semibold mt-5 mb-3">1. Quy định</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Trẻ dưới 13 tuổi chỉ xem phim kết thúc trước 22 giờ.</li>
            <li>Trẻ dưới 16 tuổi chỉ xem phim kết thúc trước 23 giờ.</li>
            <li>Khuyến nghị phụ huynh đi cùng trẻ nhỏ.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-5 mb-3">2. Lưu ý</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Rạp có quyền yêu cầu giấy tờ xác minh độ tuổi.</li>
            <li>Rạp có quyền từ chối phục vụ nếu không tuân thủ quy định.</li>
            <li>Mọi trường hợp ngoại lệ cần xin phép quản lý.</li>
          </ul>
        </FM.section>

        <FM.section
          className="mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold mb-5">IV. Chính sách giá vé</h2>
          <h3 className="text-xl font-semibold mt-5 mb-3">1. Phân loại khách hàng</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Trẻ em: dưới 16 tuổi hoặc cao dưới 130cm.</li>
            <li>U22: khách từ 12–22 tuổi.</li>
            <li>Khách dưới 23 tuổi: cần giấy tờ xác minh.</li>
            <li>Người cao tuổi: trên 55 tuổi.</li>
            <li>Người có công, hoàn cảnh khó khăn, khuyết tật: cần giấy tờ hợp lệ.</li>
            <li>Người lớn: áp dụng giá vé cơ sở.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-5 mb-3">2. Tài liệu xác minh</h3>
          <p className="text-slate-700">Rạp có quyền yêu cầu giấy tờ tùy thân để áp dụng chính xác ưu đãi.</p>
          <h3 className="text-xl font-semibold mt-5 mb-3">3. Chính sách giá</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Giá vé người lớn: theo bảng giá rạp.</li>
            <li>U22, sinh viên: áp dụng ưu đãi theo từng rạp.</li>
            <li>Trẻ em, người cao tuổi, người có công, hoàn cảnh khó khăn: giảm tối thiểu 20%.</li>
            <li>Người khuyết tật nặng: giảm tối thiểu 50%.</li>
            <li>Người khuyết tật đặc biệt nặng: miễn phí vé.</li>
            <li>Ưu đãi không áp dụng khi đặt vé online, chỉ áp dụng trực tiếp tại rạp.</li>
          </ul>
          <p className="mt-6 italic text-slate-500">MVP Ticket cam kết minh bạch, công bằng và ưu tiên quyền lợi khách hàng.</p>
        </FM.section>

        <p className="text-center text-slate-500 italic text-sm">© 2025 – MVP Ticket. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  );
};

export default RulePage;
