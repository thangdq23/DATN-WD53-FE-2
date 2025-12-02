import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Spin } from "antd";
import { useState } from "react";
import bannerImg from "../../../assets/images/banner/banner.png";
import posterTraiTim from "../../../assets/images/poster/trai-tim-que-quat.jpg";
import { QUERY } from "../../../common/constants/queryKey";
import { useTable } from "../../../common/hooks/useTable";
import { getAllMovie } from "../../../common/services/movie.service";
import BannerSection from "./components/BannerSection";
import MovieCard from "./components/MovieCard";
import MovieTabs from "./components/MovieTabs";
import MovieFilterBar from "./components/MovieFilterBar";

const DEFAULT_BANNER = bannerImg;
const DEFAULT_POSTER = posterTraiTim;

const HomePage = () => {
  const { query, onFilter } = useTable();
  const { data, isLoading } = useQuery({
    queryKey: [
      QUERY.MOVIE,
      "CLIENT",
      ...Object.values(query),
      ...Object.keys(query),
    ],
    queryFn: () =>
      getAllMovie({
        status: true,
        searchFields: ["name"],
        ...query,
      }),
  });
  const [tabKey, setTabKey] = useState("nowShowing");
  const handleChangeTab = (e) => {
    onFilter({ statusRelease: [e] });
    setTabKey(e);
  };

  return (
    <div>
      <BannerSection src={bannerImg} fallback={DEFAULT_BANNER} />
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <MovieTabs tabKey={tabKey} onChange={handleChangeTab} />
        <MovieFilterBar status={tabKey} />
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Spin />
          </div>
        ) : (
          <>
            {data?.data?.length === 0 ? (
              <Empty description="Không có phim" />
            ) : (
              <Row gutter={[24, 28]}>
                {data?.data?.map((m) => (
                  <Col key={m.id} xs={12} sm={12} md={18} lg={6}>
                    <MovieCard movie={m} fallback={DEFAULT_POSTER} />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
