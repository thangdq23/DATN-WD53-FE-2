import React, { useMemo, useState } from "react";
import { motion as FM } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import bannerImg from "../../../../assets/images/banner/banner2.jpg";
import { getAllMovie } from "../../../../common/services/movie.service";
import { getAllGenre } from "../../../../common/services/genre.service";
import MovieCard from "./MovieCard";
import posterFallback from "../../../../assets/images/poster/trai-tim-que-quat.jpg";

const MoviesPage = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["client-movies", selectedGenre],
    queryFn: () => getAllMovie({ status: true }),
  });

  const movies = moviesData?.data || [];

  const filtered = useMemo(() => {
    if (!selectedGenre) return movies;
    return movies.filter((m) =>
      m?.genreIds?.some((g) => g._id === selectedGenre),
    );
  }, [movies, selectedGenre]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative h-[420px] flex items-center justify-center text-center overflow-hidden">
        <img
          src={bannerImg}
          alt="Movies banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <FM.div
          className="relative z-10 max-w-5xl px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
            Phim Đang Chiếu
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Khám phá những bộ phim đỉnh cao đang được chiếu tại rạp
          </p>
        </FM.div>
      </section>

      <div className="" style={{ padding: 20 }}></div>
      {/* Movies grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            Đang tải danh sách phim...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <p className="text-slate-600">Không có phim phù hợp với bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((m) => (
              <FM.div
                key={m._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <MovieCard movie={m} fallback={posterFallback} />
              </FM.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border transition shadow-sm ${
      active
        ? "bg-red-600 text-white border-red-600 shadow-red-900/30"
        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
    }`}
  >
    {label}
  </button>
);

export default MoviesPage;
