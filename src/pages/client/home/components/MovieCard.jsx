import React from "react";
import { Card, Button, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Text, Link } = Typography;

const MovieCard = ({ movie, onBuy, fallback }) => {
  const navigate = useNavigate();

  const styles = {
    posterWrap: {
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      minHeight: 320,
    },
    posterImg: { width: "100%", height: 320, objectFit: "cover" },
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
    buyBtn: {
      background: "#2d9cdb",
      borderColor: "#2d9cdb",
      color: "#fff",
      borderRadius: 6,
      height: 44,
      width: "100%",
      marginTop: 12,
    },
  };

  return (
    <Card bordered={false} bodyStyle={{ paddingTop: 12 }}>
      <Link onClick={() => navigate(`/showtime/${movie._id}`)}>
        <div style={styles.posterWrap}>
          <div style={styles.ageTag}>{movie.age}</div>
          <img
            src={movie.poster}
            alt={movie.title}
            style={styles.posterImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallback;
            }}
          />
        </div>
        <div style={{ paddingTop: 8 }}>
          <p className="text-base font-semibold text-primary line-clamp-1 mb-2!">
            {movie.name}
          </p>
          <div>
            Thể loại:{" "}
            <Text strong>
              {movie?.genreIds?.map((item) => item.name)?.join(", ")}
            </Text>
          </div>
          <div>
            Thời lượng: <Text strong>{movie.duration} phút</Text>
          </div>
          <div style={{ color: "#888" }}>
            Ngày khởi chiếu:{" "}
            <Text strong>{dayjs(movie.releaseDate).format("DD-MM-YYYY")}</Text>
          </div>

          {movie.statusRelease === "nowShowing" && (
            <Button
              icon={<ShoppingCartOutlined />}
              style={styles.buyBtn}
              onClick={() => onBuy(movie)}
            >
              MUA VÉ
            </Button>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default MovieCard;
