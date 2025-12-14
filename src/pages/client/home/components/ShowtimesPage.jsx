import React, { useMemo, useState } from "react";
import { motion as FM } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Spin, Tag } from "antd";
import { getMovieHasShowtime, getShowtimeWeekday } from "../../../../common/services/showtime.service";
import { getAgeBadge } from "../../../../common/utils/age";
import { getAllRoom } from "../../../../common/services/room.service";
import bannerHero from "../../../../assets/images/banner/banner4.png";

const ShowtimesPage = () => {
  dayjs.locale("vi");
  const navigate = useNavigate();
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day").startOf("day")),
    [],
  );
  const [selected, setSelected] = useState(days[0]);
  const { data: roomsRes } = useQuery({
    queryKey: ["rooms-active"],
    queryFn: () => getAllRoom({ status: true }),
  });
  const rooms = roomsRes?.data || [];
  const [selectedRoom, setSelectedRoom] = useState(null);
  const selectedDateLabel = selected.format("dddd, DD [tháng] MM [năm] YYYY");

  const { data, isLoading } = useQuery({
    queryKey: ["client-showtimes", selected.toISOString()],
    queryFn: () =>
      getMovieHasShowtime({
        limit: 100,
        startTimeFrom: selected.startOf("day").toISOString(),
        startTimeTo: selected.endOf("day").toISOString(),
      }),
  });

  const movies = data?.data || [];

  const VI_DAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const formatDayChip = (d) => `${VI_DAY[d.day()]}, ${d.format("DD/MM")}`;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative h-[360px] flex items-center justify-center text-center overflow-hidden">
        <img src={bannerHero} alt="Showtimes banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-5xl px-6">
          <h1 className="text-5xl font-extrabold text-white mb-2">Phim</h1>
          <p className="text-white/90">{selectedDateLabel}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-wide">Chọn ngày chiếu</h2>
          <p className="text-slate-600 mt-1">Chọn ngày để xem các phim có suất chiếu</p>
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
                className={`px-4 py-2 rounded-xl border transition shadow-sm ${
                  isActive
                    ? "bg-red-600 border-red-600 text-white shadow-red-900/30"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {formatDayChip(d)}
              </button>
            );
          })}
        </FM.div>

        {/* Chọn rạp chiếu phim */}
        <div className="mt-8">
          <p className="text-xl font-semibold mb-4">Chọn rạp chiếu phim.</p>
          <FM.div
            className="flex gap-4 overflow-x-auto pb-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {rooms.map((r) => {
              const isActive = selectedRoom === r._id;
              return (
                <button
                  key={r._id}
                  onClick={() => setSelectedRoom(r._id)}
                  className={`min-w-[280px] text-left px-5 py-4 rounded-xl border transition shadow-sm ${
                    isActive
                      ? "bg-red-600 text-white border-red-600 shadow-red-900/30"
                      : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-lg font-semibold m-0">{r.name}</p>
                  <p className="text-sm opacity-80 m-0">Sức chứa: {r.capacity} ghế</p>
                </button>
              );
            })}
          </FM.div>
        </div>

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
                const age = getAgeBadge(m.ageRequire);
                return (
                  <FM.div
                    key={m._id}
                    className="rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden cursor-pointer"
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
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-semibold truncate">{m.name}</p>
                          <Tag color={age.color}>{age.label}</Tag>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {m.duration} phút • {m.showtimeCount} suất chiếu
                        </p>
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
        startTimeFrom: selected.startOf("day").toISOString(),
        startTimeTo: selected.endOf("day").toISOString(),
        roomId: roomId || undefined,
      }),
    enabled: !!movieId && !!selected,
  });
  const grouped = data?.data || {};
  const times = Object.values(grouped).flat();
  if (isLoading) return <div className="text-xs text-gray-400">Đang tải giờ chiếu...</div>;
  if (!times || times.length === 0)
    return <div className="text-xs text-gray-400">Không có giờ chiếu trong ngày</div>;
  return (
    <div className="flex flex-wrap gap-3">
      {times.map((s) => {
        const values = Array.isArray(s.price) ? s.price.map((p) => p.value) : [];
        const minPrice = values.length ? Math.min(...values) : null;
        const start = dayjs(s.startTime);
        const isToday = dayjs(selected).isSame(dayjs(), "day");
        const isPast = isToday && start.isBefore(dayjs());
        const baseClass = isPast
          ? "bg-slate-200 text-slate-500"
          : "bg-red-600 text-white hover:bg-red-700";
        return (
          <div
            key={s._id}
            className={`min-w-[84px] px-3 py-2 rounded-lg shadow text-sm flex flex-col items-center ${baseClass}`}
            title={minPrice ? `Giá từ ${minPrice.toLocaleString()}đ` : undefined}
          >
            <span className="font-semibold">{start.format("HH:mm")}</span>
            <span className="text-[11px] opacity-90">{minPrice ? `${minPrice.toLocaleString()}đ` : ""}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ShowtimesPage;
