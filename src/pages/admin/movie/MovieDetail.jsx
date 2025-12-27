import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Spin,
  Card,
  Descriptions,
  Typography,
  Tag,
  Button,
  Space,
  Image,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { getDetailMovie } from "../../../common/services/movie.service";
import { statusRelease } from "../../../common/constants";
import { getAgeBadge } from "../../../common/utils/age";

const { Title } = Typography;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async () => {
    try {
      setLoading(true);

      // 🔹 GỌI ĐÚNG SERVICE LẤY CHI TIẾT PHIM
      const res = await getDetailMovie(id);
      // service trả về { data, message } nên lấy res.data
      setMovie(res.data || res);
    } catch (error) {
      console.error(error);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div
        className="admin-page"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Spin />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="admin-page">
        <Card>
          <Title level={4}>Không tìm thấy phim</Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Card className="admin-card" bordered={false}>
        <Space
          style={{
            marginBottom: 16,
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Chi tiết phim: {movie.name}
            </Title>
          </Space>
        </Space>

        <Space align="start" size={32}>
          {/* Poster */}
          {movie.poster && (
            <Image
              src={movie.poster}
              width={180}
              style={{ borderRadius: 12, objectFit: "cover" }}
            />
          )}

          {/* Thông tin */}
          <Descriptions bordered column={1} style={{ minWidth: 420 }}>
            <Descriptions.Item label="Mã phim">
              {movie._id?.slice(-8)}
            </Descriptions.Item>

            <Descriptions.Item label="Tên phim">
              {movie.name}
            </Descriptions.Item>

            <Descriptions.Item label="Thể loại">
              {movie.genreIds?.map((g) => g.name).join(", ") ||
                "Chưa cập nhật"}
            </Descriptions.Item>

            <Descriptions.Item label="Thời lượng">
              {movie.duration} phút
            </Descriptions.Item>

            <Descriptions.Item label="Ngôn ngữ">
              {movie.language}
              {movie.subTitleLanguage &&
                ` - Phụ đề ${movie.subTitleLanguage}`}
            </Descriptions.Item>

            <Descriptions.Item label="Độ tuổi">
              <Tag>{movie.ageRestriction}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày công chiếu - Ngày kết thúc">
              {dayjs(movie.releaseDate).format("YYYY-MM-DD")} {" - "}
              {dayjs(movie.endDate).format("YYYY-MM-DD")}
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái phim">
              {movie.statusRelease && (
                <Tag color={statusRelease[movie.statusRelease].color}>
                  {statusRelease[movie.statusRelease].label}
                </Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái hoạt động">
              <Tag color={movie.status ? "blue" : "red"}>
                {movie.status ? "Hoạt động" : "Đang khóa"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Mô tả">
              {movie.description || "Chưa có mô tả"}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>
    </div>
  );
};

export default MovieDetail;
