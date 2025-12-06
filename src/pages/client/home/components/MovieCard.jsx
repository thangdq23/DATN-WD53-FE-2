import React from "react";
import { Card, Button, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";


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
          <p className="text-base md:text-lg font-semibold text-white line-clamp-1 mb-2!">
            {movie.name}
          </p>
          <div className="text-xs text-gray-300">
            Thể loại: {" "}
            <Text strong className="text-gray-200">
              {movie?.genreIds?.map((item) => item.name)?.join(", ")}
            </Text>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Thời lượng: <Text strong className="text-gray-200">{movie.duration} phút</Text>
          </div>

          {/* Suất chiếu hôm nay (tối đa 3) */}
          <ShowtimeToday movieId={movie._id} />

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
  const todayKey = Object.keys(payload).find((d) => dayjs(d).isSame(dayjs(), "day"));
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
