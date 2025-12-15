import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Outlet } from "react-router";
import SeatPicker from "./movie/detail/components/seatPicker";
import { motion as FM } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getDetailMovie, getAllMovie } from "../../common/services/movie.service";
import { Modal, Spin } from "antd";
import { getShowtimeWeekday } from "../../common/services/showtime.service";

const ShowtimePage = () => {
  const { id } = useParams();

  const { data: detailRes, isLoading: loadingDetail } = useQuery({
    queryKey: ["movie-detail", id],
    queryFn: () => getDetailMovie(id),
  });

  const movie = detailRes?.data || detailRes;

  const { data: listRes, isLoading: loadingList } = useQuery({
    queryKey: ["movies-active"],
    queryFn: () => getAllMovie({ status: true }),
  });

  const otherMovies = (listRes?.data || [])
    .filter((m) => m._id !== id)
    .slice(0, 8);

  const normalizeYouTubeEmbed = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.slice(1);
        return `https://www.youtube.com/embed/${id}`;
      }
      if (u.hostname.includes("youtube.com")) {
        if (u.pathname.startsWith("/embed/")) return url;
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const [trailerModal, setTrailerModal] = useState({ open: false, url: null, title: "" });

  const { data: showtimeRes, isLoading: loadingShowtime } = useQuery({
    queryKey: ["movie-showtimes", id],
    queryFn: () =>
      getShowtimeWeekday({
        movieId: id,
        sort: "startTime",
        order: "asc",
        startTimeFrom: dayjs().startOf("day").toISOString(),
      }),
    enabled: !!movie,
  });
  const showtimeData = showtimeRes?.data || {};
  const showtimeDates = Object.keys(showtimeData);
  const todayKey = showtimeDates.find((d) => dayjs(d).isSame(dayjs(), "day"));
  const selectedKey = todayKey || showtimeDates[0];
  const todaysShowtimes = selectedKey ? showtimeData[selectedKey] : [];

  const [openSeat, setOpenSeat] = useState(false);
  const [selected, setSelected] = useState({ roomId: null, showtimeId: null, hour: null });

  if (loadingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
        Đang tải...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
        Không tìm thấy phim
      </div>
    );
  }

  const trailerUrl = normalizeYouTubeEmbed(movie.trailer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 blur-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.poster})` }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto py-14 px-6 md:px-10">
        <FM.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10"
        >
          <FM.img
            whileHover={{ scale: 1.05 }}
            src={movie.poster}
            alt={movie.name}
            className="w-full md:w-[420px] rounded-2xl shadow-lg border border-gray-700"
          />

          <div>
            <h1 className="text-4xl font-bold text-red-500 mb-3">{movie.name}</h1>
            <div className="text-gray-200 text-sm md:text-base mb-2">
            ⭐ <b>Thể loại:</b> {movie?.genreIds?.map((g) => g.name).join(", ")}
            </div>

            <div className="text-gray-200 space-y-2 text-sm md:text-base">
              <p>🎬 <b>Đạo diễn:</b> {movie.director}</p>
              <p>
                ⭐ <b>Diễn viên:</b> {Array.isArray(movie.actor) ? movie.actor.join(", ") : movie.actor}
              </p>
              <p>⏱ <b>Thời lượng:</b> {movie.duration} phút</p>
              <p>
                📅 <b>Khởi chiếu:</b> {movie.releaseDate ? dayjs(movie.releaseDate).format("DD/MM/YYYY") : ""}
              </p>
              <p>
                💬 <b>Ngôn ngữ:</b> {movie.language}
                {movie.subTitleLanguage ? ` - Phụ đề ${movie.subTitleLanguage}` : ""}
              </p>
            </div>

            <h3 className="text-xl font-semibold text-red-400 mt-5 mb-2">Mô tả</h3>
            <p className="text-gray-300 leading-relaxed">{movie.description}</p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-red-400 mb-3">🎫 Suất chiếu hôm nay</h3>
              {loadingShowtime ? (
                <div className="flex items-center gap-2 text-gray-300"><Spin size="small" /> Đang tải suất chiếu...</div>
              ) : todaysShowtimes && todaysShowtimes.length > 0 ? (
                <div className="flex flex-wrap gap-3">
              {todaysShowtimes.map((s) => (
                <button
                  key={s._id}
                  onClick={() => {
                    setSelected({
                      roomId: s.roomId?._id || s.roomId,
                      showtimeId: s._id,
                      hour: dayjs(s.startTime).format("HH:mm"),
                    });
                    setOpenSeat(true);
                  }}
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg shadow-md font-medium transition"
                >
                  {dayjs(s.startTime).format("HH:mm")}
                </button>
              ))}
                </div>
              ) : (
                <div className="text-gray-300">Không có suất chiếu hôm nay</div>
              )}
            </div>
          </div>
        </FM.div>
        {trailerUrl ? (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-6">🎞 Trailer</h2>
            <div className="relative w-full md:w-3/4 lg:w-2/3 mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-red-600/30">
              <iframe width="100%" height="100%" src={trailerUrl} title="Trailer" allowFullScreen></iframe>
            </div>
          </div>
        ) : null}

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-red-400 mb-6">🎬 Các phim khác</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loadingList ? (
              <div className="col-span-4 text-center text-gray-300">Đang tải...</div>
            ) : (
              otherMovies.map((m) => (
                <Link key={m._id} to={`/showtime/${m._id}`}>
                  <FM.div whileHover={{ scale: 1.05 }} className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10">
                    <img src={m.poster} alt={m.name} className="w-full h-60 object-cover" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTrailerModal({ open: true, url: normalizeYouTubeEmbed(m.trailer), title: m.name });
                      }}
                      className="absolute top-3 right-3 px-3 py-1 bg-red-600/90 hover:bg-red-700 text-white text-xs rounded"
                    >
                      Xem trailer
                    </button>
                    <div className="p-3">
                      <p className="font-semibold truncate">{m.name}</p>
                      <p className="text-xs text-gray-400">{m?.genreIds?.map((g) => g.name).join(", ")}</p>
                    </div>
                  </FM.div>
                </Link>
              ))
            )}
      </div>
      <Outlet />
      <Modal
        open={openSeat}
        onCancel={() => setOpenSeat(false)}
        width={1000}
        footer={null}
        className="rounded-xl"
        styles={{ content: { backgroundColor: '#0f1625' } }}
        bodyStyle={{ backgroundColor: '#0f1625' }}
        maskStyle={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      >
        {selected.showtimeId && selected.roomId && (
          <SeatPicker
            showtimeId={selected.showtimeId}
            roomId={selected.roomId}
            hour={selected.hour}
            onClose={() => setOpenSeat(false)}
          />
        )}
      </Modal>
    </div>
    <Modal
      open={trailerModal.open}
      onCancel={() => setTrailerModal({ open: false, url: null, title: "" })}
      footer={null}
      title={trailerModal.title}
      centered
    >
          <div className="relative w-full aspect-video">
            {trailerModal.url && (
              <iframe
                width="100%"
                height="100%"
                src={trailerModal.url}
                title={trailerModal.title}
                allowFullScreen
              ></iframe>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ShowtimePage;
