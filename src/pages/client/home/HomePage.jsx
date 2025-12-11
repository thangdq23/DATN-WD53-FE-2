import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Spin } from "antd";
import { useState, useMemo } from "react";

import bannerImg2 from "../../../assets/images/banner/banner3.png";
import bannerImg3 from "../../../assets/images/banner/banner4.png";

import posterTraiTim from "../../../assets/images/poster/trai-tim-que-quat.jpg";
import { getAllMovie } from "../../../common/services/movie.service";

import BannerSection from "./components/BannerSection";
import MovieCard from "./components/MovieCard";
import MovieTabs from "./components/MovieTabs";
import MovieFilterBar from "./components/MovieFilterBar";
import { useTable } from "../../../common/hooks/useTable";

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

      const parts = dateStr.toString().split(/[-\/.]/);
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

  const bannerList = [bannerImg2, bannerImg3];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#121826] to-[#0b1220] text-white pb-24">
      <BannerSection images={bannerList} interval={3000} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
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
                <MovieCard movie={m} fallback={posterTraiTim} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomePage;
