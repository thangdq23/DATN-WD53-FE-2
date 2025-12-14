import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import dayjs from "dayjs";
import { motion as FM } from "framer-motion";
import { NEWS_ITEMS } from "../data/newsData";

const NewsDetailPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const item = state || NEWS_ITEMS.find((n) => n.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        Không tìm thấy bài viết.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative h-[380px] overflow-hidden">
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 h-full flex flex-col justify-end pb-8">
          <FM.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.type === "promo" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}>
              {item.type === "promo" ? "Khuyến Mãi" : "Tin Tức"}
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white">{item.title}</h1>
            <p className="mt-2 text-white/80 text-sm">
              {dayjs(item.date).format("DD/MM/YYYY")} • {item.author}
            </p>
          </FM.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <FM.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            {item.category && <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold">{item.category}</span>}
            {Array.isArray(item.tags) && item.tags.map((t) => (
              <span key={t} className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">{t}</span>
            ))}
            {item.readTime && <span className="ml-auto">{item.readTime} phút đọc</span>}
          </div>

          <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <p className="text-lg text-slate-800 font-semibold">{item.excerpt}</p>
            <p className="text-slate-700 mt-3 whitespace-pre-line">{item.content || "Nội dung đang được cập nhật."}</p>
          </div>
        </FM.div>

        {item.type === "promo" && (
          <FM.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mt-8">
            <div className="rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 text-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Mã khuyến mãi</p>
                <span className="px-3 py-1 rounded-full bg-white/20">{item.category}</span>
              </div>
              <p className="mt-2 text-3xl font-extrabold tracking-wider">{item.promoCode}</p>
              <p className="mt-1 text-white/80 text-sm">
                Hiệu lực {dayjs(item.promoValidFrom).format("DD/MM/YYYY")} – {dayjs(item.promoValidTo).format("DD/MM/YYYY")}
              </p>
              {Array.isArray(item.conditions) && item.conditions.length > 0 && (
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.conditions.map((c) => (
                    <li key={c} className="text-white/95">• {c}</li>
                  ))}
                </ul>
              )}
              <div className="mt-5">
                <Link to="/phim" className="inline-block px-4 py-2 bg-white text-red-700 rounded-lg font-bold shadow hover:bg-white/90">Sử dụng ngay</Link>
              </div>
            </div>
          </FM.div>
        )}

        <FM.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mt-10">
          <h3 className="text-2xl font-extrabold text-slate-900">Bài viết liên quan</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 3).map((n) => (
              <Link key={n.id} to={`/tin-tuc/${n.id}`} state={n} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md">
                <img src={n.image} alt={n.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-slate-500">{dayjs(n.date).format("DD/MM/YYYY")} • {n.author}</p>
                  <p className="mt-1 font-semibold text-slate-900">{n.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </FM.div>

        <div className="mt-8">
          <Link to="/tin-tuc" className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold">Quay lại Tin Tức</Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
