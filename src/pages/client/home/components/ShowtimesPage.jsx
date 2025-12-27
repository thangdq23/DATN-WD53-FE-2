import React, { useMemo, useState } from "react";
import { motion as FM } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Spin, Tag } from "antd";
import { getAllRoom } from "../../../../common/services/room.service";
import {
  getMovieHasShowtime,
  getShowtimeWeekday,
} from "../../../../common/services/showtime.service";
import { getAgeBadge } from "../../../../common/utils/age";

const ShowtimesPage = () => {
  dayjs.locale("vi");
  const navigate = useNavigate();
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day")),
    [],
  );
  const [selected, setSelected] = useState(days[0]);
  const selectedRoom = null;

  const { data, isLoading } = useQuery({
    queryKey: ["client-showtimes", selected.toISOString(), selectedRoom],
    queryFn: () =>
      getMovieHasShowtime({
        limit: 100,
        startTimeFrom: selected.isSame(dayjs(), "day")
          ? selected.add(1, "hour").toISOString()
          : selected.startOf("day").toISOString(),
        startTimeTo: selected.endOf("day").toISOString(),
        roomId: selectedRoom,
      }),
  });

  const movies = data?.data || [];

  const VI_DAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const formatDayChip = (d) => d.format("DD-MM-YYYY");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold flex items-center gap-3 uppercase text-blue-600">
            <span className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50"></span>
            Phim đang chiếu
          </h2>
        </div>

        <FM.div
          className="flex gap-3 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {days.map((d) => {
            const isActive = d.isSame(selected, "day");
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={`px-4 py-2 rounded-xl transition shadow-sm font-semibold ${
                  isActive
                    ? "text-white"
                    : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                }`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(90deg, #003366, #003366)",
                        border: "none",
                        color: "#fff",
                      }
                    : undefined
                }
              >
                {formatDayChip(d)}
              </button>
            );
          })}
        </FM.div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <Spin size="small" /> Đang tải lịch chiếu...
            </div>
          ) : movies.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <p className="text-slate-600">Không có suất chiếu cho ngày này</p>
            </div>
          ) : (
            <div className="space-y-6">
              {movies.map((m) => {
                const age = getAgeBadge(m.ageRequire || m.age || m.ageRestriction);
                return (
                  <FM.div
                    key={m._id}
                    className="rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/showtime/${m._id}`)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={m.poster}
                        alt={m.name}
                        className="w-40 h-56 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="pr-3">
                            <p className="text-xl font-semibold truncate text-white">
                              {m.name}
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                              {m.duration} phút
                            </p>
                          </div>
                          <div className="px-2 py-1 rounded-md border border-white/20 text-white text-xs">
                            2D
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-300">
                          <p>
                            Xuất xứ:{" "}
                            {m.origin || m.country || m.language || "Việt Nam"}
                          </p>
                          <p>Khởi chiếu: {formatReleaseDate(m)}</p>
                          <p className="text-red-400">
                            {ageText(age, m.ageRequire || m.age)}
                          </p>
                        </div>
                        <MovieTimes movieId={m._id} selected={selected} roomId={selectedRoom} />
                      </div>
                    </div>
                  </FM.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MovieTimes = ({ movieId, selected, roomId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["movie-times", movieId, selected.toISOString(), roomId],
    queryFn: () =>
      getShowtimeWeekday({
        movieId,
        sort: "startTime",
        order: "asc",
        startTimeFrom: selected.isSame(dayjs(), "day")
          ? selected.add(1, "hour").toISOString()
          : selected.startOf("day").toISOString(),
        startTimeTo: selected.endOf("day").toISOString(),
        roomId,
      }),
    enabled: !!selected,
  });
  const grouped = data?.data || {};
  const times = Object.values(grouped).flat();
  if (isLoading)
    return <div className="text-xs text-gray-400">Đang tải giờ chiếu...</div>;
  if (!times || times.length === 0)
    return (
      <div className="text-xs text-gray-400">Không có giờ chiếu trong ngày</div>
    );
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {times.map((s) => {
        const values = Array.isArray(s.price)
          ? s.price.map((p) => p.value)
          : [];
        const minPrice = values.length ? Math.min(...values) : null;
        const start = dayjs(s.startTime);
        const isToday = dayjs(selected).isSame(dayjs(), "day");
        const isPast = isToday && start.isBefore(dayjs());
        const baseClass = isPast
          ? "border-white/10 text-gray-500 pointer-events-none"
          : "border-blue-500 text-blue-500 hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-[#1d4ed8] hover:text-white hover:border-[#3b82f6] shadow-blue-500/20 shadow-sm";
        const roomId = s.roomId?._id || s.roomId;
        return (
          <Link
            key={s._id}
            to={`/showtime/${movieId}/${s._id}/${roomId}?hour=${start.format("HH:mm")}&movieId=${movieId}`}
            className={`min-w-[84px] px-3 py-2 rounded-lg text-sm flex flex-col items-center border transition-all ${baseClass} group`}
            title={
              minPrice ? `Giá từ ${minPrice.toLocaleString()}đ` : undefined
            }
            onClick={(e) => {
              if (isPast) e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className={`font-semibold ${isPast ? "" : "text-blue-500 group-hover:text-white"}`}>{start.format("HH:mm")}</span>
          </Link>
        );
      })}
    </div>
  );
};

// Helpers for text mapping
const formatReleaseDate = (m) => {
  const dateStr = m?.releaseDate || m?.startDate || m?.ngayKhoiChieu;
  if (!dateStr) return "";
  try {
    return dayjs(dateStr).format("DD/MM/YYYY");
  } catch {
    return String(dateStr);
  }
};

const ageText = (ageBadge, raw) => {
  const label = (ageBadge?.label || raw || "P").toString().toUpperCase();
  if (label.startsWith("K")) return "K - Phim dành cho mọi độ tuổi";
  if (label.includes("13"))
    return "T13 - Phim được phổ biến đến người xem từ đủ 13 tuổi trở lên (13+)";
  if (label.includes("16"))
    return "T16 - Phim được phổ biến đến người xem từ đủ 16 tuổi trở lên (16+)";
  if (label.includes("18"))
    return "T18 - Chỉ dành cho khán giả từ đủ 18 tuổi trở lên (18+)";
  return "Phim dành cho mọi độ tuổi";
};

// Helpers removed in white layout

export default ShowtimesPage;
