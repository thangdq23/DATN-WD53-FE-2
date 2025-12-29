import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import bannerImgA from "../../../assets/images/banner/banner4.png";
import bannerImgB from "../../../assets/images/banner/banner3.png";

import posterTraiTim from "../../../assets/images/poster/trai-tim-que-quat.jpg";
import { getAllMovie } from "../../../common/services/movie.service";

import BannerSection from "./components/BannerSection";
import HomeShowtimeSection from "./components/HomeShowtimeSection";
import MovieCard from "./components/MovieCard";
import MovieTabs from "./components/MovieTabs";
import MovieFilterBar from "./components/MovieFilterBar";
import { useTable } from "../../../common/hooks/useTable";
import { motion as FM } from "framer-motion";
import comboImgA from "../../../assets/images/poster/Combo.webp";
import comboImgB from "../../../assets/images/poster/combo2.webp";

const HomePage = () => {
  const [tabKey, setTabKey] = useState("nowShowing");
  const { query } = useTable();

  
  const { data, isLoading } = useQuery({
    queryKey: ["movies-homepage"],
    queryFn: () => getAllMovie({ status: true }),
  });

  
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ["movies-featured"],
    queryFn: () => getAllMovie({ isHot: true, status: true, limit: 4 }),
  });
  const featuredMovies = featuredData?.data || [];

 
  const { nowShowingMovies, upcomingMovies } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = [];
    const upcoming = [];

    data?.data?.forEach((movie) => {
      const dateStr =
        movie.releaseDate || movie.startDate || movie.ngayKhoiChieu;
      if (!dateStr) return;

      const parts = dateStr.toString().split(/[-/.]/);
      let releaseDate;

      if (parts.length === 3) {
        if (parts[0].length === 4) {
          releaseDate = new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
          releaseDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      } else {
        releaseDate = new Date(dateStr);
      }

      releaseDate.setHours(0, 0, 0, 0);

      if (releaseDate <= today) {
        now.push(movie);
      } else {
        upcoming.push(movie);
      }
    });

    return { nowShowingMovies: now, upcomingMovies: upcoming };
  }, [data]);

  
  const moviesToShow =
    tabKey === "nowShowing" ? nowShowingMovies : upcomingMovies;

  
  const filteredMovies = useMemo(() => {
    return moviesToShow?.filter((movie) => {
      const matchSearch = query.search
        ? (movie.name || "")
            .toLowerCase()
            .includes(String(query.search).toLowerCase())
        : true;

      const matchGenre = query.genre
        ? Array.isArray(movie?.genreIds) &&
          movie.genreIds.some((g) => String(g?._id) === String(query.genre))
        : true;

      
      const matchAge = query.age
        ? String(movie?.ageRestriction) === String(query.age)
        : true;

      const matchHot =
        query.hot !== null && query.hot !== undefined
          ? movie.isHot === query.hot
          : true;

      return matchSearch && matchGenre && matchAge && matchHot;
    });
  }, [moviesToShow, query]);

  const handleChangeTab = (key) => {
    setTabKey(key);
  };

  const [bannerList, setBannerList] = useState([bannerImgA, bannerImgB]);

  
  useEffect(() => {
    const readLS = () => {
      try {
        const raw = localStorage.getItem("app:banners");
        const arr = JSON.parse(raw || "[]");
        if (Array.isArray(arr) && arr.length > 0) {
          setBannerList(arr);
        } else {
          setBannerList([bannerImgA, bannerImgB]);
        }
      } catch {
        setBannerList([bannerImgA, bannerImgB]);
      }
    };
    readLS();
    const onStorage = (e) => {
      if (e.key === "app:banners") readLS();
    };
    const onCustomUpdate = () => readLS();
    window.addEventListener("storage", onStorage);
    window.addEventListener("banners:update", onCustomUpdate);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="bg-gradient-to-b from-[#0b1220] via-[#121826] to-[#0b1220] text-white pb-0">
        <BannerSection images={bannerList} interval={3000} />
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          paddingBottom: 48,
        }}
      >
        
        {loadingFeatured ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Spin />
          </div>
        ) : (
          featuredMovies.length > 0 && (
            <FM.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="mt-8 rounded-3xl bg-white text-slate-900 shadow-lg shadow-slate-200/50 px-8 py-8 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold flex items-center gap-3 uppercase text-blue-600">
                  <span className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50"></span>
                  Phim nổi bật
                </h2>
              </div>

              <Row gutter={[24, 28]}>
                {featuredMovies.map((m) => (
                  <Col key={m._id || m.id} xs={12} sm={12} md={8} lg={6}>
                    <FM.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      <MovieCard movie={m} fallback={posterTraiTim} />
                    </FM.div>
                  </Col>
                ))}
              </Row>
            </FM.div>
          )
        )}

        <FM.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 rounded-3xl bg-white text-slate-900 shadow-lg shadow-slate-200/50 px-8 py-8 border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold flex items-center gap-3 uppercase text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50"></span>
              Danh sách phim
            </h2>
          </div>

          <MovieTabs tabKey={tabKey} onChange={handleChangeTab} />

          
          <MovieFilterBar status={tabKey} movies={moviesToShow} />

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <Spin />
            </div>
          ) : filteredMovies?.length === 0 ? (
            <Empty description="Không có phim" />
          ) : (
            <Row gutter={[24, 28]}>
              {filteredMovies.map((m) => (
                <Col key={m._id || m.id} xs={12} sm={12} md={8} lg={6}>
                  <FM.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <MovieCard movie={m} fallback={posterTraiTim} />
                  </FM.div>
                </Col>
              ))}
            </Row>
          )}
        </FM.div>

        
        <HomeShowtimeSection />

        <FM.section
          className="mt-12"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold text-slate-900">KHUYẾN MÃI</h2>
          <p className="text-slate-600">Ưu đãi hấp dẫn dành cho bạn</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <FM.div
              className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img
                src={comboImgA}
                alt="Combo Popcorn + Drink"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-semibold">
                -20%
              </div>
              <div className="p-4 text-white">
                <p className="text-lg font-bold">Combo Popcorn + Drink</p>
                <p className="mt-1 opacity-90 text-sm">
                  Mua vé kèm combo tiết kiệm đến 20%
                </p>
                <Link
                  to="/about"
                  className="inline-block mt-3 px-3 py-1.5 border border-red-500 text-red-100 hover:bg-red-600/20 rounded-md text-sm"
                >
                  Xem chi tiết
                </Link>
              </div>
            </FM.div>

            <FM.div
              className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img
                src={comboImgB}
                alt="Combo Couple"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-semibold">
                Hot
              </div>
              <div className="p-4 text-white">
                <p className="text-lg font-bold">Combo Couple</p>
                <p className="mt-1 opacity-90 text-sm">
                  Ưu đãi dành cho cặp đôi cuối tuần
                </p>
                <Link
                  to="/about"
                  className="inline-block mt-3 px-3 py-1.5 border border-emerald-500 text-emerald-100 hover:bg-emerald-600/20 rounded-md text-sm"
                >
                  Xem chi tiết
                </Link>
              </div>
            </FM.div>

            <FM.div
              className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600" />
              <div className="p-4 relative z-10 text-white">
                <p className="text-lg font-bold">
                  Giảm giá học sinh – sinh viên
                </p>
                <p className="mt-1 opacity-90 text-sm">
                  Giảm 15% khi xuất trình thẻ sinh viên
                </p>
                <Link
                  to="/about"
                  className="inline-block mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm"
                >
                  Xem chi tiết
                </Link>
              </div>
            </FM.div>
          </div>
        </FM.section>
      </div>
    </div>
  );
};

export default HomePage;
