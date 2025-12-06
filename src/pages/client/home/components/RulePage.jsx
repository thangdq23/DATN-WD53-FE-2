import React from "react";

const RulePage = () => {
  return (
    <div className="w-full bg-[#0b1a25] py-16 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto bg-[#0b1a25]/90 p-10 md:p-16 rounded-3xl shadow-2xl border border-teal-700/50 backdrop-blur-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-teal-300">
          ĐIỀU KHOẢN & QUY ĐỊNH – MVP TICKET
        </h1>

        {/* I. NỘI QUY PHÒNG CHIẾU */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5 border-l-4 border-teal-500 pl-3 text-teal-200">
            I. NỘI QUY PHÒNG CHIẾU
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-300">
            <li>Không quay phim, chụp ảnh trong rạp để đảm bảo quyền riêng tư của mọi khách hàng.</li>
            <li>Tắt hoặc để chế độ im lặng điện thoại khi vào phòng chiếu.</li>
            <li>Không hút thuốc, kể cả thuốc lá điện tử.</li>
            <li>Không gây mất trật tự, la hét, ném đồ hoặc làm phiền người khác.</li>
            <li>Không nhai kẹo cao su hoặc đồ ăn gây tiếng động trong phòng chiếu.</li>
            <li>Không mang thú cưng hoặc động vật nuôi vào rạp.</li>
            <li>Bảo quản tài sản cá nhân cẩn thận; rạp không chịu trách nhiệm mất mát tài sản.</li>
            <li>
              Chỉ thức ăn, nước uống mua tại MVP Ticket mới được phép mang vào, nhằm đảm bảo vệ sinh và an toàn.
            </li>
            <li>
              Không sử dụng rượu bia, đồ uống có cồn hoặc các chất kích thích khác trong khuôn viên rạp.
            </li>
            <li>Sau 22 giờ, rạp không phục vụ khách dưới 13 tuổi; sau 23 giờ, không phục vụ khách dưới 16 tuổi.</li>
            <li>MVP Ticket có quyền từ chối phục vụ nếu khách vi phạm nội quy hoặc gây nguy hiểm cho người khác.</li>
            <li>Hệ thống camera an ninh hoạt động 24/7 để đảm bảo an toàn và giám sát mọi hoạt động trong rạp.</li>
            <li>Mọi thắc mắc liên quan đến nội quy, khách hàng có thể liên hệ trực tiếp nhân viên quầy vé hoặc hotline.</li>
          </ul>
        </section>

        {/* II. PHÂN LOẠI PHIM */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5 border-l-4 border-teal-500 pl-3 text-teal-200">
            II. PHÂN LOẠI PHIM THEO ĐỘ TUỔI
          </h2>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            1. Phân loại phim
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>P – Phim dành cho mọi độ tuổi; thích hợp cho cả gia đình.</li>
            <li>K – Trẻ dưới 13 tuổi cần người bảo hộ đi cùng để đảm bảo an toàn và hướng dẫn.</li>
            <li>T13 – Dành cho người từ 13 tuổi trở lên; có thể có cảnh bạo lực nhẹ, cảnh kinh dị vừa phải.</li>
            <li>T16 – Dành cho người từ 16 tuổi trở lên; có thể có nội dung bạo lực, ngôn ngữ không phù hợp trẻ em.</li>
            <li>T18 – Dành cho người từ 18 tuổi trở lên; có cảnh bạo lực mạnh, nội dung nhạy cảm.</li>
            <li>C – Phim không được phép phổ biến; cấm chiếu tại rạp MVP Ticket.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            2. Lưu ý
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              Khách xem phim T13 – T18 phải mang giấy tờ tùy thân để đối chiếu độ tuổi, nhằm đảm bảo tuân thủ luật pháp.
            </li>
            <li>
              Bao gồm CCCD, thẻ học sinh – sinh viên, giấy khai sinh hoặc các giấy tờ hợp lệ khác.
            </li>
            <li>MVP Ticket có quyền từ chối phục vụ nếu khách không đáp ứng quy định, nhằm bảo vệ trải nghiệm xem phim cho tất cả khách hàng.</li>
            <li>
              Việc phân loại phim dựa trên hướng dẫn của cơ quan quản lý văn hóa và tiêu chuẩn quốc tế.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            3. Chế tài
          </h3>
          <p className="text-gray-300">
            – Phạt tiền từ 60.000.000đ – 80.000.000đ nếu không đảm bảo đúng độ tuổi theo phân loại phim.
          </p>
        </section>

        {/* III. KHUNG GIỜ CHIẾU */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5 border-l-4 border-teal-500 pl-3 text-teal-200">
            III. QUY ĐỊNH KHUNG GIỜ CHIẾU PHIM CHO TRẺ EM
          </h2>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            1. Quy định
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Trẻ dưới 13 tuổi chỉ xem phim kết thúc trước 22 giờ, đảm bảo giấc ngủ và an toàn.</li>
            <li>Trẻ dưới 16 tuổi chỉ xem phim kết thúc trước 23 giờ, phù hợp với độ tuổi.</li>
            <li>Khuyến nghị phụ huynh đi cùng trẻ nhỏ để hướng dẫn và giám sát.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            2. Lưu ý
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>MVP Ticket có quyền yêu cầu giấy tờ xác minh độ tuổi của khách hàng.</li>
            <li>Rạp có quyền từ chối phục vụ nếu khách không tuân thủ quy định, nhằm đảm bảo an toàn và trật tự chung.</li>
            <li>Mọi trường hợp ngoại lệ cần xin phép quản lý trước khi vào rạp.</li>
          </ul>
        </section>

        {/* IV. CHÍNH SÁCH GIÁ VÉ */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-5 border-l-4 border-teal-500 pl-3 text-teal-200">
            IV. CHÍNH SÁCH GIÁ VÉ MVP TICKET
          </h2>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            1. Phân loại khách hàng
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Trẻ em: dưới 16 tuổi hoặc cao dưới 130cm.</li>
            <li>U22: khách từ 12–22 tuổi, thành viên chương trình ưu đãi.</li>
            <li>Khách dưới 23 tuổi: cần giấy tờ tùy thân xác minh tuổi.</li>
            <li>Người cao tuổi: trên 55 tuổi.</li>
            <li>Người có công, hoàn cảnh khó khăn, khuyết tật: cần giấy tờ chứng minh hợp lệ.</li>
            <li>Người lớn: không thuộc nhóm ưu tiên, áp dụng giá vé cơ sở.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            2. Tài liệu xác minh
          </h3>
          <p className="text-gray-300">
            MVP Ticket có quyền yêu cầu khách hàng xuất trình giấy tờ tùy thân hoặc các tài liệu hợp pháp để áp dụng đúng giá ưu đãi và đảm bảo minh bạch.
          </p>

          <h3 className="text-xl font-semibold mt-5 mb-3 text-teal-300">
            3. Chính sách giá vé
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Giá vé người lớn: áp dụng theo bảng giá rạp MVP Ticket.</li>
            <li>U22: áp dụng giá ưu đãi theo từng rạp.</li>
            <li>Sinh viên: ưu đãi riêng, cần thẻ sinh viên hợp lệ.</li>
            <li>Trẻ em, người cao tuổi, người có công, người hoàn cảnh khó khăn: giảm tối thiểu 20%.</li>
            <li>Người khuyết tật nặng: giảm tối thiểu 50%.</li>
            <li>Người khuyết tật đặc biệt nặng: miễn phí vé vào rạp.</li>
            <li>Mọi ưu đãi KHÔNG áp dụng khi đặt vé online, chỉ áp dụng trực tiếp tại rạp.</li>
          </ul>

          <p className="mt-6 italic text-gray-500">
            *Lưu ý: MVP Ticket cam kết minh bạch, công bằng và ưu tiên quyền lợi khách hàng. Mọi thắc mắc vui lòng liên hệ hotline hoặc nhân viên quầy vé.*
          </p>
        </section>

        <p className="text-center text-gray-400 italic text-sm mt-12">
          © 2025 – MVP Ticket. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
};

export default RulePage;
