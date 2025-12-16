import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import bannerImgA from "../../../assets/images/banner/banner4.png";
import bannerImgB from "../../../assets/images/banner/banner3.png";

import posterTraiTim from "../../../assets/images/poster/trai-tim-que-quat.jpg";
import { getAllMovie } from "../../../common/services/movie.service";
import { getMovieHasShowtime, getShowtimeWeekday } from "../../../common/services/showtime.service";
import { getAgeBadge } from "../../../common/utils/age";

import BannerSection from "./components/BannerSection";
import MovieCard from "./components/MovieCard";
import MovieTabs from "./components/MovieTabs";
import MovieFilterBar from "./components/MovieFilterBar";
import { useTable } from "../../../common/hooks/useTable";
import { motion as FM } from "framer-motion";
import comboImgA from "../../../assets/images/poster/Combo.webp";
import comboImgB from "../../../assets/images/poster/combo2.webp";

const formatReleaseDate = (m) => {
  const dateStr = m?.releaseDate || m?.startDate || m?.ngayKhoiChieu;
  if (!dateStr) return "";
  try {
    return dayjs(dateStr).format("DD/MM/YYYY");
  } catch {
    return String(dateStr);
  }
};

const ageText = (ageBadge, raw) => {
  const label = (raw || ageBadge?.label || "P").toString().toUpperCase();
  if (label.startsWith("K")) return "K - Phim dành cho mọi độ tuổi";
  if (label.includes("13"))
    return "T13 - Phim được phổ biến đến người xem từ đủ 13 tuổi trở lên (13+)";
  if (label.includes("16"))
    return "T16 - Phim được phổ biến đến người xem từ đủ 16 tuổi trở lên (16+)";
  if (label.includes("18"))
    return "T18 - Chỉ dành cho khán giả từ đủ 18 tuổi trở lên (18+)";
  return "Phim dành cho mọi độ tuổi";
};

const HomePage = () => {
  const [tabKey, setTabKey] = useState("nowShowing");
  const { query } = useTable();

  // --- Gọi API phim ---
  const { data, isLoading } = useQuery({
    queryKey: ["movies-homepage"],
    queryFn: () => getAllMovie({ status: true }),
  });

  // --- Tách phim theo ngày ---
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

  // chọn list theo tab
  const moviesToShow =
    tabKey === "nowShowing" ? nowShowingMovies : upcomingMovies;

  // --- Bộ lọc frontend ---
  const filteredMovies = useMemo(() => {
    return moviesToShow?.filter((movie) => {
      const matchSearch = query.search
        ? movie.name?.toLowerCase().includes(query.search.toLowerCase())
        : true;

      const matchGenre = query.genre
        ? movie?.genreIds?.some((g) => g._id === query.genre)
        : true;

      const matchAge = query.age ? movie.age === query.age : true;
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

  // Đọc cấu hình banner từ localStorage và cập nhật khi thay đổi
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

  // --- Lịch chiếu hôm nay (preview) ---
  const today = dayjs();
  const { data: todayRes, isLoading: loadingToday } = useQuery({
    queryKey: ["homepage-today-showtimes", today.startOf("day").toISOString()],
    queryFn: () =>
      getMovieHasShowtime({
        limit: 12,
        startTimeFrom: today.startOf("day").toISOString(),
        startTimeTo: today.endOf("day").toISOString(),
      }),
  });
  const todayMovies = todayRes?.data || [];

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
        <FM.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 rounded-3xl bg-white text-slate-900 shadow-lg shadow-slate-200/50 px-8 py-8 border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold flex items-center gap-3 uppercase text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600 shadow-lg shadow-red-500/50"></span>
              Phim đang chiếu
            </h2>
          </div>
          <MovieTabs tabKey={tabKey} onChange={handleChangeTab} />
          <MovieFilterBar status={tabKey} />

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

        {/* LỊCH CHIẾU HÔM NAY */}
        <FM.section
          className="mt-12 rounded-3xl bg-white text-slate-900 shadow-lg shadow-slate-200/50 px-8 py-8 border border-slate-100"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-extrabold flex items-center gap-3 uppercase text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600 shadow-lg shadow-red-500/50"></span>
              Lịch chiếu hôm nay
            </h2>
          </div>
          <p className="text-slate-500 mb-6 ml-6">Chọn suất chiếu phù hợp với bạn</p>

          {loadingToday ? (
            <div className="flex items-center gap-2 text-gray-300 mt-4 ml-6">
              <Spin size="small" /> Đang tải lịch chiếu...
            </div>
          ) : todayMovies.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
              <p className="text-slate-500">Không có suất chiếu hôm nay</p>
            </div>
          ) : (
            <div className="space-y-6">
              {todayMovies.map((m) => {
                const age = getAgeBadge(m.ageRequire);
                return (
                  <FM.div
                    key={m._id}
                    className="rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={m.poster}
                        alt={m.name}
                        className="w-40 h-56 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="pr-3">
                            <p className="text-xl font-semibold truncate text-white">
                              {m.name}
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                              {m.duration} phút
                            </p>
                          </div>
                          <div className="px-2 py-1 rounded-md border border-white/20 text-white text-xs">
                            2D
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-300">
                          <p>
                            Xuất xứ:{" "}
                            {m.origin || m.country || m.language || "Việt Nam"}
                          </p>
                          <p>Khởi chiếu: {formatReleaseDate(m)}</p>
                          <p className="text-red-400">
                            {ageText(age, m.ageRequire)}
                          </p>
                        </div>
                        <TodayTimes movieId={m._id} />
                      </div>
                    </div>
                  </FM.div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <Link
              to="/showtimes"
              className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg shadow-md font-medium"
            >
              Xem tất cả lịch chiếu
            </Link>
          </div>
        </FM.section>

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

const TodayTimes = ({ movieId }) => {
  const today = dayjs();
  const { data, isLoading } = useQuery({
    queryKey: [
      "homepage-movie-times",
      movieId,
      today.startOf("day").toISOString(),
    ],
    queryFn: () =>
      getShowtimeWeekday({
        movieId,
        sort: "startTime",
        order: "asc",
        startTimeFrom: today.startOf("day").toISOString(),
        startTimeTo: today.endOf("day").toISOString(),
      }),
    enabled: !!movieId,
  });
  const grouped = data?.data || {};
  const times = Object.values(grouped).flat();
  if (isLoading)
    return (
      <div className="text-xs text-gray-400 mt-2">Đang tải giờ chiếu...</div>
    );
  if (!times || times.length === 0)
    return <div className="text-xs text-gray-400 mt-2">Không có giờ chiếu</div>;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {times.slice(0, 6).map((s) => {
        const values = Array.isArray(s.price) ? s.price.map((p) => p.value) : [];
        const minPrice = values.length ? Math.min(...values) : null;
        const start = dayjs(s.startTime);
        const isPast = start.isBefore(dayjs());
        
        const baseClass = isPast
          ? "border-white/10 text-gray-500 pointer-events-none"
          : "border-red-500 text-red-500 hover:bg-gradient-to-r hover:from-[#ff4d4f] hover:to-[#ff2d2d] hover:text-white hover:border-[#ff4d4f] shadow-red-500/20 shadow-sm";

        return (
          <Link
            key={s._id}
            to={`/showtime/${movieId}/${s._id}/${s.roomId?._id || s.roomId}?hour=${start.format("HH:mm")}&movieId=${movieId}`}
            className={`min-w-[84px] px-3 py-2 rounded-lg text-sm flex flex-col items-center border transition-all ${baseClass} group`}
            title={minPrice ? `Giá từ ${minPrice.toLocaleString()}đ` : undefined}
            onClick={(e) => {
              if (isPast) e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className={`font-semibold ${isPast ? "" : "text-red-500 group-hover:text-white"}`}>
              {start.format("HH:mm")}
            </span>
            <span className={`text-[11px] opacity-90 ${isPast ? "" : "text-red-500 group-hover:text-white"}`}>
              {minPrice ? `${minPrice.toLocaleString()}đ` : ""}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default HomePage;
