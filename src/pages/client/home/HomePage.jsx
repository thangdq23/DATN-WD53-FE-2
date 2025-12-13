import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Spin } from "antd";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import bannerImgA from "../../../assets/images/banner/banner.png";
import bannerImgB from "../../../assets/images/banner/banner3.png";

import posterTraiTim from "../../../assets/images/poster/trai-tim-que-quat.jpg";
import { getAllMovie } from "../../../common/services/movie.service";
import { getMovieHasShowtime, getShowtimeWeekday } from "../../../common/services/showtime.service";

import BannerSection from "./components/BannerSection";
import MovieCard from "./components/MovieCard";
import MovieTabs from "./components/MovieTabs";
import MovieFilterBar from "./components/MovieFilterBar";
import { useTable } from "../../../common/hooks/useTable";
import { motion as FM } from "framer-motion";

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

  const bannerList = [bannerImgA, bannerImgB];

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

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", paddingBottom: 48 }}>
        <FM.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 rounded-3xl bg-white text-slate-900 shadow-md px-6 py-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-extrabold tracking-wide">PHIM ĐANG CHIẾU</h2>
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
          className="mt-10"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold text-slate-900">LỊCH CHIẾU HÔM NAY</h2>
          <p className="text-slate-600">Chọn suất chiếu phù hợp với bạn</p>

          {loadingToday ? (
            <div className="flex items-center gap-2 text-gray-300 mt-4">
              <Spin size="small" /> Đang tải lịch chiếu...
            </div>
          ) : todayMovies.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-6">
              <p className="text-slate-600">Không có suất chiếu hôm nay</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {todayMovies.map((m) => (
                <FM.div
                  key={m._id}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <img src={m.poster} alt={m.name} className="w-full h-52 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold truncate">{m.name}</p>
                      <Link to={`/showtime/${m._id}`} className="text-sm text-red-600 hover:text-red-500">Chi tiết</Link>
                    </div>
                    <TodayTimes movieId={m._id} />
                  </div>
                </FM.div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <Link to="/showtimes" className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg shadow-md font-medium">
              Xem tất cả lịch chiếu
            </Link>
          </div>
        </FM.section>

        {/* KHUYẾN MÃI */}
        <FM.section
          className="mt-12"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-extrabold text-slate-900">KHUYẾN MÃI</h2>
          <p className="text-slate-600">Ưu đãi hấp dẫn dành cho bạn</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FM.div
                className="rounded-2xl p-6 bg-gradient-to-br from-pink-600 to-red-600 text-white shadow-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <p className="text-xl font-bold">Combo Popcorn + Drink</p>
                <p className="mt-1 opacity-90">Mua vé kèm combo tiết kiệm đến 20%</p>
                <Link to="/about" className="inline-block mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg">Xem chi tiết</Link>
              </FM.div>
              <FM.div
                className="rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <p className="text-xl font-bold">Thành viên thân thiết</p>
                <p className="mt-1 opacity-90">Tích điểm đổi quà, nhận ưu đãi hằng tuần</p>
                <Link to="/about" className="inline-block mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg">Xem chi tiết</Link>
              </FM.div>
              <FM.div
                className="rounded-2xl p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <p className="text-xl font-bold">Giảm giá học sinh - sinh viên</p>
                <p className="mt-1 opacity-90">Giảm 15% khi xuất trình thẻ sinh viên</p>
                <Link to="/about" className="inline-block mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg">Xem chi tiết</Link>
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
    queryKey: ["homepage-movie-times", movieId, today.startOf("day").toISOString()],
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
  if (isLoading) return <div className="text-xs text-gray-400 mt-2">Đang tải giờ chiếu...</div>;
  if (!times || times.length === 0)
    return <div className="text-xs text-gray-400 mt-2">Không có giờ chiếu</div>;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {times.slice(0, 6).map((s) => (
        <span key={s._id} className="px-3 py-1 bg-red-600/80 hover:bg-red-700 rounded-lg shadow text-sm">
          {dayjs(s.startTime).format("HH:mm")}
        </span>
      ))}
    </div>
  );
};

export default HomePage;
