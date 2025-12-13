import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Spin, Tag } from "antd";
import { getMovieHasShowtime, getShowtimeWeekday } from "../../../../common/services/showtime.service";
import { getAgeBadge } from "../../../../common/utils/age";

const ShowtimesPage = () => {
  dayjs.locale("vi");
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day").startOf("day")),
    [],
  );
  const [selected, setSelected] = useState(days[0]);

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
    <div className="min-h-screen bg-gradient-to-b from-[#06161d] via-[#0b1a25] to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-teal-300 tracking-wide">Lịch chiếu</h1>
          <p className="text-white/70 mt-1">Chọn ngày để xem các phim có suất chiếu</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {days.map((d) => {
            const isActive = d.isSame(selected, "day");
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={`px-4 py-2 rounded-xl border transition shadow-sm ${
                  isActive
                    ? "bg-teal-900 border-teal-500 text-teal-300 shadow-teal-900/30"
                    : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                }`}
              >
                {formatDayChip(d)}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-300">
              <Spin size="small" /> Đang tải lịch chiếu...
            </div>
          ) : movies.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <p className="text-gray-300">Không có suất chiếu cho ngày này</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((m) => {
                const age = getAgeBadge(m.ageRequire);
                return (
                  <div
                    key={m._id}
                    className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-teal-400/50 transition"
                  >
                    <img
                      src={m.poster}
                      alt={m.name}
                      className="w-full h-60 object-cover"
                    />
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold truncate">{m.name}</p>
                        <Tag color={age.color}>{age.label}</Tag>
                      </div>
                      <p className="text-sm text-gray-300">
                        {m.duration} phút • {m.showtimeCount} suất chiếu
                      </p>
                      <MovieTimes movieId={m._id} selected={selected} />
                      <Link
                        to={`/showtime/${m._id}`}
                        className="inline-block mt-2 px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded-lg shadow-md font-medium"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MovieTimes = ({ movieId, selected }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["movie-times", movieId, selected.toISOString()],
    queryFn: () =>
      getShowtimeWeekday({
        movieId,
        sort: "startTime",
        order: "asc",
        startTimeFrom: selected.startOf("day").toISOString(),
        startTimeTo: selected.endOf("day").toISOString(),
      }),
    enabled: !!movieId && !!selected,
  });
  const grouped = data?.data || {};
  const times = Object.values(grouped).flat();
  if (isLoading) return <div className="text-xs text-gray-400">Đang tải giờ chiếu...</div>;
  if (!times || times.length === 0)
    return <div className="text-xs text-gray-400">Không có giờ chiếu trong ngày</div>;
  return (
    <div className="flex flex-wrap gap-2">
      {times.map((s) => (
        <span
          key={s._id}
          className="px-3 py-1 bg-red-600/80 hover:bg-red-700 rounded-lg shadow text-sm"
        >
          {dayjs(s.startTime).format("HH:mm")}
        </span>
      ))}
    </div>
  );
};

export default ShowtimesPage;
