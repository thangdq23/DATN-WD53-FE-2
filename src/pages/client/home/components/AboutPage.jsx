import React from "react";
import { FaFilm, FaChair, FaTicketAlt } from "react-icons/fa";
import banner2 from "../../../../assets/images/banner/banner2.jpg";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-900 text-gray-100">
      {/* HERO SECTION */}
      <section
        className="relative h-[650px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${banner2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
 {/* Overlay đậm hơn */}
 <div className="absolute inset-0 bg-black/60"></div>

{/* Nội dung banner */}
<div className="relative z-10 max-w-4xl px-6">
  <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-[0_0_10px_black]">
    Chào mừng đến với MPV Ticket
  </h1>
  <p className="text-2xl text-white drop-shadow-[0_0_8px_black]">
    Trải nghiệm rạp chiếu phim hiện đại, tiện nghi và các chương trình ưu đãi hấp dẫn.
  </p>
  </div>
      </section>

      {/* ABOUT / FEATURES SECTION */}
      <section className="py-20 bg-gray-900 text-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Về rạp MPV</h2>
          <p className="text-lg leading-relaxed mb-12 text-gray-300">
            MPV Ticket là hệ thống rạp chiếu phim hiện đại, mang đến trải nghiệm tuyệt vời cho khán giả
            với các phòng chiếu sang trọng, âm thanh sống động và màn hình chất lượng cao. 
            Chúng tôi cung cấp đa dạng các bộ phim mới, chương trình ưu đãi đặc biệt và sự phục vụ chuyên nghiệp.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-cyan-500 transition-shadow duration-300">
              <FaFilm className="text-cyan-400 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Phim Mới & Hot</h3>
              <p className="text-gray-300">
                Cập nhật liên tục các bộ phim bom tấn, phim mới ra rạp và các suất chiếu hấp dẫn.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-cyan-500 transition-shadow duration-300">
              <FaChair className="text-cyan-400 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Phòng Chiếu Tiện Nghi</h3>
              <p className="text-gray-300">
                Phòng chiếu sang trọng, ghế êm ái, âm thanh sống động và màn hình chất lượng cao.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-cyan-500 transition-shadow duration-300">
              <FaTicketAlt className="text-cyan-400 text-5xl mb-4 mx-auto" />
              <h3 className="text-2xl font-semibold mb-2">Ưu Đãi & Vé</h3>
              <p className="text-gray-300">
                Các chương trình ưu đãi hấp dẫn, mua vé trực tuyến tiện lợi và nhận khuyến mãi đặc biệt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gray-800 text-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-cyan-400">Tại sao chọn MPV Ticket?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-cyan-500 transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-2">Dịch vụ chuyên nghiệp</h3>
              <p className="text-gray-300">
                Nhân viên thân thiện, hỗ trợ đặt vé nhanh chóng và tư vấn suất chiếu tốt nhất.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-cyan-500 transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-2">Công nghệ hiện đại</h3>
              <p className="text-gray-300">
                Hệ thống chiếu phim hiện đại với âm thanh vòm và màn hình chất lượng cao.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-cyan-500 transition-shadow duration-300">
              <h3 className="text-2xl font-semibold mb-2">Ưu đãi thường xuyên</h3>
              <p className="text-gray-300">
                Khuyến mãi, combo hấp dẫn và chương trình tri ân khách hàng trung thành.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-black to-cyan-800 text-white text-center">
  <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">Đặt vé ngay hôm nay!</h2>
  <p className="mb-6 drop-shadow-md">
    Trải nghiệm rạp chiếu phim hiện đại cùng MPV Ticket.
  </p>
  <a
    href="/showtimes"
    className="bg-yellow-400 text-black font-bold py-3 px-10 rounded-full shadow-xl hover:bg-yellow-500 transition-colors duration-300"
  >
    Xem lịch chiếu
  </a>
</section>


    </div>
  );
};

export default AboutPage;
