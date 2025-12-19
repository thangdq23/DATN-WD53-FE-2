import React from "react";
import { Card, Button, Typography, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text, Link } = Typography;

const MovieCard = ({ movie, onBuy = () => {}, fallback }) => {
  const navigate = useNavigate();

  const styles = {
    posterWrap: {
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      minHeight: 320,
    },
    posterImg: { width: "100%", height: 320, objectFit: "cover" },
    ratingTag: {
      position: "absolute",
      top: 10,
      right: 10,
      background: "#1F6FEB",
      color: "#fff",
      fontWeight: 700,
      borderRadius: 8,
      padding: "2px 8px",
      fontSize: 12,
      boxShadow: "0 2px 6px rgba(0,0,0,.2)",
    },
    ageTag: {
      position: "absolute",
      bottom: 10,
      right: 10,
      background: "#ffcf33",
      color: "#112",
      fontWeight: 700,
      borderRadius: 8,
      padding: "2px 8px",
      fontSize: 12,
      boxShadow: "0 2px 6px rgba(0,0,0,.2)",
    },
    buyBtn: {
      background: "#2d9cdb",
      borderColor: "#2d9cdb",
      color: "#fff",
      borderRadius: 8,
      height: 40,
      width: "100%",
      marginTop: 10,
    },
  };

  return (
    <Card
      hoverable
      styles={{ body: { paddingTop: 12 } }}
      className="rounded-2xl"
    >
      <Link onClick={() => navigate(`/showtime/${movie._id}`)}>
        <div style={styles.posterWrap}>
          {typeof movie.rating === "number" || typeof movie.imdb === "number" ? (
            <div style={styles.ratingTag}>
              {(() => {
                const score = typeof movie.rating === "number" ? movie.rating : movie.imdb;
                return typeof score === "number" ? score.toFixed(1) : score;
              })()}
            </div>
          ) : null}
          <div style={styles.ageTag}>{movie.age}</div>

          <img
            src={movie.poster}
            alt={movie.name}
            style={styles.posterImg}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallback;
            }}
          />
        </div>

        <div style={{ paddingTop: 8 }}>
          <p className="text-base md:text-lg font-semibold text-slate-900 line-clamp-1 mb-2">
            {movie.name}
          </p>

          <div className="text-xs text-gray-600">
            Thể loại: {" "}
            <Text strong className="text-slate-800">
              {movie?.genreIds?.map((item) => item.name).join(", ")}
            </Text>
          </div>

          <div className="text-xs text-gray-600 mt-1">
            Thời lượng: {" "}
            <Text strong className="text-slate-800">{movie.duration} phút</Text>
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
