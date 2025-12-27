import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  getDetailMovie,
  getAllMovie,
} from "../../common/services/movie.service";
import { Modal, Tooltip } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { getAgeBadge } from "../../common/utils/age";

const ShowtimePage = () => {
  const { id, roomId, showtimeId } = useParams();
  const isSeatSelection = roomId && showtimeId;

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: detailRes, isLoading: loadingDetail } = useQuery({
    queryKey: ["movie-detail", id],
    queryFn: () => getDetailMovie(id),
  });
  const movie = detailRes?.data || detailRes;

  const { data: listRes } = useQuery({
    queryKey: ["movies-active"],
    queryFn: () => getAllMovie({ status: true }),
  });
  const otherMovies = (listRes?.data || [])
    .filter((m) => m._id !== id)
    .slice(0, 4);

  const [trailerModal, setTrailerModal] = useState({ open: false, url: null });

  const normalizeYouTubeEmbed = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be"))
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
        if (u.pathname.startsWith("/embed/")) return url;
      }
      return url;
    } catch {
      return url;
    }
  };

  if (loadingDetail)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Đang tải...
      </div>
    );
  if (!movie)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Không tìm thấy phim
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[480px] md:h-[550px] bg-slate-900 overflow-hidden">
        {/* Blurred Background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${movie.poster})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center gap-10">
          {/* Poster - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block w-[300px] shrink-0 rounded-lg overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
            <img
              src={movie.poster}
              alt={movie.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                  movie.statusRelease === "nowShowing"
                    ? "bg-red-600"
                    : "bg-red-600"
                }`}
              >
                {movie.statusRelease === "nowShowing"
                  ? "Đang chiếu"
                  : "Sắp chiếu"}
              </span>
              {(movie.ageRequire || movie.ageRestriction) && (
                <Tooltip
                  title={
                    getAgeBadge(movie.ageRequire || movie.ageRestriction)
                      .description
                  }
                >
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold cursor-help">
                    {
                      getAgeBadge(movie.ageRequire || movie.ageRestriction)
                        .label
                    }
                  </span>
                </Tooltip>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight uppercase tracking-tight">
              {movie.name}
            </h1>

            <div className="text-gray-300 space-y-2 mb-8 text-sm md:text-base">
              <p>
                <span className="text-white/60 font-medium">Thể loại:</span>{" "}
                {movie.genreIds?.map((g) => g.name).join(", ")}
              </p>
              <p>
                <span className="text-white/60 font-medium">Thời lượng:</span>{" "}
                {movie.duration} phút
              </p>
              <p>
                <span className="text-white/60 font-medium">Khởi chiếu:</span>{" "}
                {dayjs(movie.releaseDate).format("DD/MM/YYYY")}
              </p>
              <p>
                <span className="text-white/60 font-medium">Đạo diễn:</span>{" "}
                {movie.director}
              </p>
              <p>
                <span className="text-white/60 font-medium">Diễn viên:</span>{" "}
                {Array.isArray(movie.actor)
                  ? movie.actor.join(", ")
                  : movie.actor}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("showtime-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                Mua Vé
              </button>
              <button
                onClick={() =>
                  setTrailerModal({
                    open: true,
                    url: normalizeYouTubeEmbed(movie.trailer),
                  })
                }
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg backdrop-blur-sm transition"
              >
                <PlayCircleOutlined /> Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Column */}
        <div className={isSeatSelection ? "lg:col-span-12" : "lg:col-span-8"}>
          {/* Description */}
          {!isSeatSelection && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 uppercase mb-4 border-l-4 border-blue-600 pl-3">
                Nội dung phim
              </h3>
              <p className="text-slate-600 leading-relaxed text-justify">
                {movie.description}
              </p>
            </div>
          )}

          {/* Showtime Picker (Outlet) */}
          <div id="showtime-section" className="mb-12">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        {!isSeatSelection && (
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 uppercase mb-4 border-l-4 border-blue-600 pl-3">
                Phim đang chiếu
              </h3>
              <div className="space-y-4">
                {otherMovies.map((m) => (
                  <Link
                    key={m._id}
                    to={`/showtime/${m._id}`}
                    className="flex gap-4 group"
                  >
                    <img
                      src={m.poster}
                      alt={m.name}
                      className="w-20 h-28 object-cover rounded bg-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition line-clamp-2">
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {m.genreIds?.map((g) => g.name).join(", ")}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                        ⭐ {m.rating || 0}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <Modal
        open={trailerModal.open}
        onCancel={() => setTrailerModal({ open: false, url: null })}
        footer={null}
        width={900}
        centered
        className="p-0 bg-transparent"
        styles={{
          content: { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {trailerModal.url && (
            <iframe
              width="100%"
              height="100%"
              src={trailerModal.url}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ShowtimePage;
