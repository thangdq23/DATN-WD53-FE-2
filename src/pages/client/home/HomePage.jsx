import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Empty,
  Tabs,
  Typography,
} from "antd";
import bannerImg from "../../../assets/images/banner/banner.png";
import posterTraiTim from "../../../assets/images/poster/trai-tim-que-quat.jpg";
import posterTruyTim from "../../../assets/images/poster/truy-tim-long-dien-huong.jpg";
import posterBayTien from "../../../assets/images/poster/bay-tien.jpg";
import posterPhongTro from "../../../assets/images/poster/phong-tro-ma-bau.png";
import posterQuanKy from "../../../assets/images/poster/quan-ky-nam.jpg";
import posterHoangTu from "../../../assets/images/poster/hoang-tu-quy.png";
import posterBaDung from "../../../assets/images/poster/ba-dung-buon-con.png";
import posterCoHau from "../../../assets/images/poster/co-hau-gai.jpg";

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Link } = Typography;

const DEFAULT_POSTER = posterTraiTim;
const DEFAULT_BANNER = bannerImg;

const BANNER_URL = bannerImg;

const sampleMovies = [
  {
    id: 1,
    title: "Trái Tim Quê Quặt",
    genres: ["Hồi hộp", "Ly kỳ", "Tâm lý"],
    poster: posterTraiTim,
    duration: "120 phút",
    releaseDate: "07/11/2025",
    age: "T18",
  },
  {
    id: 2,
    title: "Truy Tìm Long Điền Hương",
    genres: ["Hành động", "Hài hước"],
    poster: posterTruyTim,
    duration: "120 phút",
    releaseDate: "14/11/2025",
    age: "T16",
  },
  {
    id: 3,
    title: "Bẫy Tiền",
    genres: ["Giật gân", "Tâm lý"],
    poster: posterBayTien,
    duration: "120 phút",
    releaseDate: "21/11/2025",
    age: "T16",
  },
  {
    id: 4,
    title: "Phòng Trọ Ma Bấu",
    genres: ["Kinh dị", "Hài hước"],
    poster: posterPhongTro,
    duration: "120 phút",
    releaseDate: "28/11/2025",
    age: "T18",
  },
  {
    id: 5,
    title: "Quân Kỳ Nam",
    genres: ["Lãng mạn", "Tâm lý"],
    poster: posterQuanKy,
    duration: "120 phút",
    releaseDate: "28/11/2025",
    age: "T16",
  },
  {
    id: 6,
    title: "Hoàng Tử Quỷ",
    genres: ["Kinh dị"],
    poster: posterHoangTu,
    duration: "120 phút",
    releaseDate: "05/12/2025",
    age: "T16",
  },
  {
    id: 7,
    title: "Bà Đừng Buồn Con",
    genres: ["Gian dâm", "Tâm lý"],
    poster: posterBaDung,
    duration: "120 phút",
    releaseDate: "12/12/2025",
    age: "T15",
  },
  {
    id: 8,
    title: "Cô Hầu Gái",
    genres: ["Kinh dị", "Giật gân"],
    poster: posterCoHau,
    duration: "120 phút",
    releaseDate: "26/12/2025",
    age: "T16",
  },
];

const styles = {
  bannerWrap: {
    width: "100%",
    height: 700,
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  bannerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  contentWrap: {
    width: "100%",
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  posterWrap: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
    minHeight: 320,
  },
  posterImg: {
    width: "100%",
    height: 320,
    objectFit: "cover",
    display: "block",
  },
  ageTag: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#ffcf33",
    color: "#112",
    fontWeight: 700,
    borderRadius: 6,
    padding: "2px 6px",
    fontSize: 12,
  },
  cardBody: { paddingTop: 12 },
  titleLink: {
    color: "#0b5fff",
    fontWeight: 700,
    display: "block",
    marginBottom: 6,
  },
  metaSmall: { color: "#6c6c6c", fontSize: 13, marginBottom: 6 },
  metaSmallMuted: { color: "#8a8a8a", fontSize: 12 },
  cardNoShadow: {
    boxShadow: "none",
    border: "none",
    background: "transparent",
  },
};

const HomePage = () => {
  const [tabKey, setTabKey] = useState("coming");
  const [movies] = useState(sampleMovies);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("popular");

  const genres = useMemo(() => {
    const setG = new Set();
    movies.forEach((m) => m.genres.forEach((g) => setG.add(g)));
    return ["All", ...Array.from(setG)];
  }, [movies]);

  const filtered = useMemo(() => {
    let list = movies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase()),
    );
    if (genre !== "All") list = list.filter((m) => m.genres.includes(genre));
    let sorted = [...list];
    if (sort === "year_desc")
      sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sort === "year_asc")
      sorted.sort((a, b) => (a.year || 0) - (b.year || 0));
    if (sort === "rating")
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted;
  }, [movies, query, genre, sort]);

  return (
    <div>
      <div style={styles.bannerWrap}>
        <img
          src={BANNER_URL}
          alt="Banner"
          style={styles.bannerImg}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_BANNER;
          }}
        />
      </div>

      <div style={styles.contentWrap}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Tabs activeKey={tabKey} onChange={(k) => setTabKey(k)} centered>
            <TabPane tab={<b>PHIM SẮP CHIẾU</b>} key="coming" />
            <TabPane tab={<b>PHIM ĐANG CHIẾU</b>} key="now" />
            <TabPane tab={<b>SUẤT CHIẾU ĐẶC BIỆT</b>} key="special" />
          </Tabs>
        </div>

        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={12} md={10} lg={8}>
            <Search
              placeholder="Tìm theo tiêu đề..."
              allowClear
              enterButton
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <Select
              style={{ width: "100%" }}
              value={genre}
              onChange={(v) => setGenre(v)}
            >
              {genres.map((g) => (
                <Option key={g} value={g}>
                  {g}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={6} md={6} lg={6}>
            <Select
              style={{ width: "100%" }}
              value={sort}
              onChange={(v) => setSort(v)}
            >
              <Option value="popular">Mặc định</Option>
              <Option value="rating">Đánh giá cao</Option>
              <Option value="year_desc">Năm giảm dần</Option>
              <Option value="year_asc">Năm tăng dần</Option>
            </Select>
          </Col>

          <Col xs={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                setQuery("");
                setGenre("All");
                setSort("popular");
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>

        {filtered.length === 0 ? (
          <Empty description="Không có phim" />
        ) : (
          <Row gutter={[24, 28]}>
            {filtered.map((m) => (
              <Col key={m.id} xs={12} sm={12} md={8} lg={6}>
                <Card style={styles.cardNoShadow} bodyStyle={styles.cardBody}>
                  <div style={styles.posterWrap}>
                    <div style={styles.ageTag}>{m.age}</div>
                    <img
                      src={m.poster}
                      alt={m.title}
                      style={styles.posterImg}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_POSTER;
                      }}
                    />
                  </div>

                  <div style={{ paddingTop: 8 }}>
                    <Link
                      style={styles.titleLink}
                      onClick={() => alert(`Mở chi tiết: ${m.title}`)}
                    >
                      {m.title}
                    </Link>
                    <div style={styles.metaSmall}>
                      Thể loại: <Text strong>{m.genres.join(", ")}</Text>
                    </div>
                    <div style={styles.metaSmall}>
                      Thời lượng: <Text strong>{m.duration}</Text>
                    </div>
                    <div style={styles.metaSmallMuted}>
                      Ngày khởi chiếu: <Text strong>{m.releaseDate}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomePage;
