import React, { useMemo, useState } from "react";
import { Row, Col, Input, Select } from "antd";
import { motion as FM } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import bannerImg from "../../../../assets/images/banner/banner2.jpg";
import { getAllMovie } from "../../../../common/services/movie.service";
import MovieCard from "./MovieCard";
import posterFallback from "../../../../assets/images/poster/trai-tim-que-quat.jpg";

const { Search } = Input;

const AGE_MAP = {
  P: ["P"],
  K: ["P", "K"],
  T13: ["P", "K", "T13", "C13", "C13+"],
  T16: ["P", "K", "T13", "C13", "C13+", "T16", "C16", "C16+"],
  T18: ["P", "K", "T13", "C13", "C13+", "T16", "C16", "C16+", "T18", "C18", "C18+"],
};

const MoviesPage = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(undefined);
  const [age, setAge] = useState(undefined);

  
  const { data: moviesRaw, isLoading, error } = useQuery({
    queryKey: ["client-movies"],
    queryFn: () => getAllMovie({ status: true }),
  });

  
  const movies = useMemo(() => {
    if (!moviesRaw) return [];

    if (Array.isArray(moviesRaw)) return moviesRaw;

    if (Array.isArray(moviesRaw.data)) return moviesRaw.data;

    if (Array.isArray(moviesRaw.data?.data)) return moviesRaw.data.data;

    return [];
  }, [moviesRaw]);

  
  const genreOptions = useMemo(() => {
    const map = new Map();

    movies.forEach((m) => {
      if (Array.isArray(m?.genreIds)) {
        m.genreIds.forEach((g) => {
         
          if (g && typeof g === "object") {
            const id = g?._id;
            const name = g?.name;
            if (id && name) map.set(String(id), name);
          }
        });
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ value: id, label: name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [movies]);

 
  console.log("[MoviesPage] isLoading =", isLoading);
  console.log("[MoviesPage] error =", error);
  console.log("[MoviesPage] moviesRaw =", moviesRaw);
  console.log("[MoviesPage] movies.length =", movies.length);
  console.log("[MoviesPage] firstMovie =", movies[0]);
  console.log("[MoviesPage] firstMovie.genreIds =", movies?.[0]?.genreIds);
  console.log("[MoviesPage] genreOptions =", genreOptions);
  console.log("[MoviesPage] genreOptions.length =", genreOptions.length);
  console.log("[MoviesPage] selected genre =", genre);
  console.log("[MoviesPage] selected age =", age);

  const filteredMovies = useMemo(() => {
    let list = movies;

    
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter((m) => (m?.name || "").toLowerCase().includes(q));
    }

   
    if (genre) {
      list = list.filter(
        (m) =>
          Array.isArray(m?.genreIds) &&
          m.genreIds.some((g) => String(g?._id) === String(genre))
      );
    }

    
    if (age) {
      const allowed = AGE_MAP[age] || [];
      list = list.filter((m) => allowed.includes(m?.ageRestriction));
    }

    return list;
  }, [movies, search, genre, age]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
     
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
            Danh sách phim
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Khám phá những bộ phim đỉnh cao đang được chiếu tại rạp
          </p>
        </FM.div>
      </section>

      
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <Search
              placeholder="Tìm tên phim..."
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={(v) => setSearch(v || "")}
            />
          </Col>

          <Col xs={12} md={5}>
            <Select
              placeholder="Thể loại"
              allowClear
              value={genre}
              onChange={setGenre}
              style={{ width: "100%" }}
              options={genreOptions}
              notFoundContent={
                <span style={{ color: "#999" }}>
                  No data (genreOptions.length = {genreOptions.length})
                </span>
              }
            />
          </Col>

          <Col xs={12} md={5}>
            <Select
              placeholder="Độ tuổi"
              allowClear
              value={age}
              onChange={setAge}
              style={{ width: "100%" }}
              options={[
                { value: "P", label: "P" },
                { value: "K", label: "K" },
                { value: "T13", label: "T13" },
                { value: "T16", label: "T16" },
                { value: "T18", label: "T18" },
              ]}
            />
          </Col>
        </Row>

        
        <div style={{ marginTop: 8, color: "#999", fontSize: 12 }}>
          debug: movies={movies.length} | genres={genreOptions.length}
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            Đang tải danh sách phim...
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <p className="text-slate-600">Không có phim phù hợp với bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((m) => (
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

export default MoviesPage;
