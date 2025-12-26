import React, { useState } from "react";
import { Card, Button, Typography, Tag } from "antd";
import { ShoppingCartOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getShowtimeWeekday } from "../../../../common/services/showtime.service";

const { Text, Link } = Typography;

const MovieCard = ({ movie, onBuy = () => {}, fallback }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    posterWrap: {
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      minHeight: 320,
      cursor: "pointer",
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
      zIndex: 2,
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
      zIndex: 2,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      opacity: isHovered ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
      pointerEvents: isHovered ? "auto" : "none",
      zIndex: 1,
    },
    overlayBtn: {
      width: "80%",
      height: 40,
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
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
      <div>
        <div 
          style={styles.posterWrap}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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

          <div style={styles.overlay}>
           
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              style={{
                ...styles.overlayBtn,
                background: "#52c41a",
                borderColor: "#52c41a",
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/showtime/${movie._id}`);
              }}
            >
              Mua vé ngay
            </Button>
          </div>
        </div>

        <Link onClick={() => navigate(`/showtime/${movie._id}`)}>
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

            <ShowtimeToday movieId={movie._id} />
          </div>
        </Link>
      </div>
    </Card>
  );
};

const ShowtimeToday = ({ movieId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["movie-showtimes-card", movieId],
    queryFn: () =>
      getShowtimeWeekday({
        movieId,
        sort: "startTime",
        order: "asc",
        startTimeFrom: dayjs().startOf("day").toISOString(),
      }),
    enabled: !!movieId,
  });

  const payload = data?.data || {};
  const todayKey = Object.keys(payload).find((d) =>
    dayjs(d).isSame(dayjs(), "day")
  );
  const times = todayKey ? payload[todayKey] : [];
  const firstThree = Array.isArray(times) ? times.slice(0, 3) : [];

  return (
    <div className="mt-3">
      {isLoading ? (
        <p className="text-[12px] text-gray-400">Đang tải suất chiếu...</p>
      ) : firstThree.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {firstThree.map((s) => (
            <span
              key={s._id}
              className="px-2 py-1 text-[12px] rounded-md bg-red-600/80 text-white"
            >
              {dayjs(s.startTime).format("HH:mm")}
            </span>
          ))}
          <span className="text-[12px] text-blue-300 ml-1">Xem tất cả</span>
        </div>
      ) : (
        <p className="text-[12px] text-gray-400">Không có suất chiếu hôm nay</p>
      )}
    </div>
  );
};

export default MovieCard;
