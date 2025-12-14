import React, { useMemo, useState } from "react";
import { motion as FM } from "framer-motion";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import bannerImg from "../../../../assets/images/banner/banner3.png";
import { NEWS_ITEMS } from "../data/newsData";
import posterFallback from "../../../../assets/images/poster/trai-tim-que-quat.jpg";

const DATA = NEWS_ITEMS;

const NewsPage = () => {
  const [filter, setFilter] = useState("all");

  const items = useMemo(() => {
    if (filter === "all") return DATA;
    return DATA.filter((i) => i.type === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative h-[420px] flex items-center justify-center text-center overflow-hidden">
        <img src={bannerImg} alt="News banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <FM.div
          className="relative z-10 max-w-5xl px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">Tin Tức & Ưu Đãi</h1>
          <p className="text-lg md:text-xl text-white/90">Cập nhật tin mới và các chương trình khuyến mãi</p>
        </FM.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <FM.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full font-semibold shadow ${filter === "all" ? "bg-red-600 text-white" : "bg-white border border-slate-300 text-slate-900"}`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setFilter("news")}
            className={`px-5 py-2 rounded-full font-semibold shadow ${filter === "news" ? "bg-red-600 text-white" : "bg-white border border-slate-300 text-slate-900"}`}
          >
            Tin Tức
          </button>
          <button
            onClick={() => setFilter("promo")}
            className={`px-5 py-2 rounded-full font-semibold shadow ${filter === "promo" ? "bg-red-600 text-white" : "bg-white border border-slate-300 text-slate-900"}`}
          >
            Khuyến Mãi
          </button>
        </FM.div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((i) => (
            <FM.div
              key={i.id}
              className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="relative">
                <Link to={`/tin-tuc/${i.id}`} state={i}>
                  <img
                    src={i.image}
                    alt={i.title}
                    className="w-full h-52 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== posterFallback) {
                        e.currentTarget.src = posterFallback;
                        e.currentTarget.onerror = null;
                      }
                    }}
                  />
                </Link>
                <span
                  className={`absolute top-3 left-3 inline-block px-3 py-1 rounded-full text-xs font-bold ${i.type === "promo" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}
                >
                  {i.type === "promo" ? "Khuyến Mãi" : "Tin Tức"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{dayjs(i.date).format("DD/MM/YYYY")}</span>
                  <span>•</span>
                  <span>{i.author}</span>
                </div>
                <Link to={`/tin-tuc/${i.id}`} state={i}>
                  <h3 className="mt-2 text-lg font-extrabold text-slate-900">{i.title}</h3>
                </Link>
                <p className="mt-1 text-slate-600">{i.excerpt}</p>
                <Link
                  to={`/tin-tuc/${i.id}`}
                  state={i}
                  className="mt-3 inline-flex items-center gap-1 text-red-600 hover:text-red-500 font-semibold"
                >
                  Đọc Thêm
                  <span>→</span>
                </Link>
              </div>
            </FM.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
