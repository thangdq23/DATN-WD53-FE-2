import React from "react";
import { Link } from "react-router";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { 
      icon: <FacebookOutlined className="text-xl" />, 
      url: "https://facebook.com", 
      label: "Facebook" 
    },
    { 
      icon: <TwitterOutlined className="text-xl" />, 
      url: "https://twitter.com", 
      label: "Twitter" 
    },
    { 
      icon: <InstagramOutlined className="text-xl" />, 
      url: "https://instagram.com", 
      label: "Instagram" 
    },
    { 
      icon: <YoutubeOutlined className="text-xl" />, 
      url: "https://youtube.com", 
      label: "YouTube" 
    }
  ];

  const quickLinks = [
    { title: "Trang chủ", path: "/" },
    { title: "Phim đang chiếu", path: "/phim?status=nowShowing" },
    { title: "Phim sắp chiếu", path: "/phim?status=upcoming" },
    { title: "Lịch chiếu", path: "/lich-chieu" },
    { title: "Khuyến mãi", path: "/khuyen-mai" },
    { title: "Tin tức", path: "/tin-tuc" }
  ];

  const contactInfo = [
    { 
      icon: <EnvironmentOutlined className="text-lg" />, 
      text: "123 Đường Số 1, Quận 1, TP. Hồ Chí Minh" 
    },
    { 
      icon: <PhoneOutlined className="text-lg" />, 
      text: "1900 1234" 
    },
    { 
      icon: <MailOutlined className="text-lg" />, 
      text: "info@mpv.vn" 
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center md:justify-items-start">
          <div className="space-y-4 max-w-xs mx-auto md:mx-0">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-2">MPV</span>
              <span>CINEMA</span>
            </h2>
            <p className="text-sm leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại với chất lượng hình ảnh và âm thanh vượt trội.
            </p>
            <div className="flex space-x-4 pt-2 justify-center md:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-gray-700 inline-block">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="hover:text-blue-500 transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-white text-lg font-semibold mb-4 pb-2 border-b border-gray-700 inline-block">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center justify-center md:justify-start">
                  <span className="text-blue-500 mr-3">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} MPV Cinema. Tất cả các quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dieu-khoan" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                Điều khoản sử dụng
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/chinh-sach" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                Chính sách bảo mật
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/lien-he" className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;