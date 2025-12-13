import React from "react";
import { Link } from "react-router";

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-white py-10">
			<div className="max-w-7xl mx-6 xl:mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				<div>
					<h2 className="text-2xl font-bold">MPV</h2>
					<p className="mt-2 text-sm text-gray-300">
						Rạp chiếu phim hàng đầu — trải nghiệm điện ảnh tuyệt vời.
					</p>
				</div>

				<div>
					<h3 className="font-semibold mb-3">Liên kết</h3>
					<ul className="space-y-2 text-gray-300">
						<li>
							<Link to="/" className="hover:text-primary! duration-200">
								Trang chủ
							</Link>
						</li>
						<li>
            <Link to="/phim" className="hover:text-primary! duration-200">
              Phim
            </Link>
						</li>
						<li>
							<Link to="/showtimes" className="hover:text-primary! duration-200">
								Lịch chiếu
							</Link>
						</li>
						<li>
							<Link to="/news" className="hover:text-primary! duration-200">
								Tin tức
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="font-semibold mb-3">Liên hệ</h3>
					<p className="text-gray-300 text-sm">Email: info@mpv.vn</p>
					<p className="text-gray-300 text-sm">Hotline: 1900 1234</p>
					<div className="flex gap-3 mt-3">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Facebook"
							className="text-gray-300 hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
							</svg>
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noreferrer"
							aria-label="Twitter"
							className="text-gray-300 hover:text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M22.162 5.656c-.637.283-1.322.475-2.043.56.734-.44 1.296-1.136 1.562-1.966-.687.407-1.45.703-2.262.862C18.77 4.89 17.836 4.5 16.796 4.5c-1.842 0-3.335 1.495-3.335 3.336 0 .262.03.516.086.76-2.772-.14-5.234-1.466-6.88-3.485-.287.492-.45 1.064-.45 1.674 0 1.154.587 2.173 1.48 2.768-.544-.017-1.056-.167-1.503-.417v.042c0 1.612 1.148 2.957 2.672 3.262-.28.077-.576.118-.88.118-.215 0-.424-.02-.627-.06.425 1.327 1.656 2.293 3.116 2.32-1.14.894-2.576 1.427-4.137 1.427-.269 0-.535-.016-.797-.047 1.475.945 3.226 1.495 5.111 1.495 6.134 0 9.49-5.082 9.49-9.488 0-.145-.003-.289-.01-.432.652-.472 1.216-1.06 1.664-1.731-.597.265-1.238.444-1.906.524.686-.411 1.21-1.062 1.458-1.836z" />
							</svg>
						</a>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-800 mt-8 pt-6">
				<div className="max-w-7xl mx-6 xl:mx-auto text-center text-gray-400 text-sm">
					&copy; {new Date().getFullYear()} MPV. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;

