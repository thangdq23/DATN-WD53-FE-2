import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import {
  getAllShowtime,
  getShowtimeWeekday,
} from "../../../../../common/services/showtime.service";
import SeatPicker from "./seatPicker";

const ShowtimePicker = () => {
  dayjs.locale("vi");
  const nav = useNavigate();
  const { id, roomId, showtimeId } = useParams();

  // 1. Fetch ALL future showtimes for this movie to determine available dates
  const { data: allShowtimesData } = useQuery({
    queryKey: [QUERYKEY.SHOWTIME, "all-dates", id],
    queryFn: () =>
      getAllShowtime({
        movieId: id,
        status: "scheduled",
        startTimeFrom: dayjs().startOf("day").toISOString(),
        limit: 1000,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Generate days from actual showtimes
  const days = useMemo(() => {
    const raw = allShowtimesData?.data?.docs || allShowtimesData?.data || [];
    const uniqueDates = new Set();
    const sortedDays = [];
    if (Array.isArray(raw)) {
      raw.forEach((s) => {
        const d = dayjs(s.startTime).startOf("day");
        // Only show future dates (including today)
        if (d.isBefore(dayjs().startOf("day"))) return;
        const key = d.format("YYYY-MM-DD");
        if (!uniqueDates.has(key)) {
          uniqueDates.add(key);
          sortedDays.push(d);
        }
      });
    }
    sortedDays.sort((a, b) => a.valueOf() - b.valueOf());
    return sortedDays;
  }, [allShowtimesData]);

  const [selectedDate, setSelectedDate] = useState(null);

  // Update selectedDate when days change or showtimeId changes
  useEffect(() => {
    let newDate = null;

    // 1. Try to sync with showtimeId
    if (showtimeId && allShowtimesData) {
      const raw = allShowtimesData?.data?.docs || allShowtimesData?.data || [];
      const currentShowtime = raw.find((s) => s._id === showtimeId);
      if (currentShowtime) {
        newDate = dayjs(currentShowtime.startTime).startOf("day");
      }
    }

    // 2. Fallback to existing logic
    if (!newDate) {
      if (days.length > 0) {
        if (selectedDate && days.some((d) => d.isSame(selectedDate, "day"))) {
          newDate = selectedDate;
        } else {
          newDate = days[0];
        }
      }
    }

    // 3. Update state if different
    if (newDate) {
      if (!selectedDate || !newDate.isSame(selectedDate, "day")) {
        setSelectedDate(newDate);
      }
    } else {
      if (selectedDate) setSelectedDate(null);
    }
  }, [days, showtimeId, allShowtimesData, selectedDate]);

  // Ensure selectedDate is valid before querying
  const queryDate = selectedDate || dayjs();

  // Fetch showtimes for the selected date
  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SHOWTIME, id, queryDate.format("YYYY-MM-DD")],
    queryFn: () =>
      getShowtimeWeekday({
        status: "scheduled",
        movieId: id,
        sort: "startTime",
        order: "asc",
        limit: 100,
        startTimeFrom: queryDate.startOf("day").toISOString(),
        startTimeTo: queryDate.endOf("day").toISOString(),
      }),
    enabled: !!selectedDate || (!selectedDate && days.length === 0), // Allow fetching if no days (to show empty state) or if selected
  });

  // Group showtimes by Room
  const showtimesByRoom = useMemo(() => {
    const raw = data?.data || [];
    let list = [];
    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === "object") {
      list = Object.values(raw).flat();
    }

    // Filter only future showtimes if it's today
    const now = dayjs();
    list = list.filter((s) => dayjs(s.startTime).isAfter(now));

    // Group by Room ID
    const grouped = {};
    list.forEach((s) => {
      const rId = s.roomId?._id || s.roomId;
      if (!grouped[rId]) {
        grouped[rId] = {
          room: s.roomId, // object with name
          showtimes: [],
        };
      }
      grouped[rId].showtimes.push(s);
    });
    return Object.values(grouped);
  }, [data]);

  return (
    <section id="seat-picker-container" className="mt-8">
      {!roomId || !showtimeId ? (
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
            <h3 className="text-xl font-bold text-slate-800 uppercase m-0">
              Lịch Chiếu
            </h3>
          </div>

          {/* Date Picker + Filters */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Date Carousel */}
              <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-200 relative">
                {days.length > 0 && selectedDate && (
                  <>
                    <button
                      className="p-3 text-slate-400 hover:text-blue-600 transition disabled:opacity-30"
                      onClick={() => {
                        const idx = days.findIndex((d) =>
                          d.isSame(selectedDate, "day"),
                        );
                        if (idx > 0) setSelectedDate(days[idx - 1]);
                      }}
                      disabled={days[0].isSame(selectedDate, "day")}
                    >
                      <LeftOutlined />
                    </button>

                    <div className="flex-1 overflow-x-auto flex justify-center scrollbar-hide">
                      {days.map((d) => {
                        const isSelected = d.isSame(selectedDate, "day");
                        const dayName = d.format("dddd"); // Thứ Năm...
                        // Capitalize first letter of day name
                        const dayNameCap =
                          dayName.charAt(0).toUpperCase() + dayName.slice(1);

                        return (
                          <div
                            key={d.toISOString()}
                            onClick={() => setSelectedDate(d)}
                            className={`shrink-0 w-24 text-center py-3 px-1 cursor-pointer transition-colors border-r border-slate-100 last:border-0 ${
                              isSelected
                                ? "bg-[#003366] text-white"
                                : "bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`text-xs font-medium mb-1 ${
                                isSelected ? "text-white/80" : "text-slate-500"
                              }`}
                            >
                              {dayNameCap}
                            </div>
                            <div className="text-lg font-bold">
                              {d.format("DD/MM")}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      className="p-3 text-slate-400 hover:text-blue-600 transition disabled:opacity-30"
                      onClick={() => {
                        const idx = days.findIndex((d) =>
                          d.isSame(selectedDate, "day"),
                        );
                        if (idx < days.length - 1)
                          setSelectedDate(days[idx + 1]);
                      }}
                      disabled={days[days.length - 1].isSame(
                        selectedDate,
                        "day",
                      )}
                    >
                      <RightOutlined />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Showtime List */}
          {isLoading ? (
            <div className="py-12 text-center text-slate-500">
              Đang tải lịch chiếu...
            </div>
          ) : showtimesByRoom.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Chưa có lịch chiếu cho ngày này</p>
            </div>
          ) : (
            <div className="space-y-6">
              {showtimesByRoom.map((group) => (
                <div
                  key={group.room?._id}
                  className="bg-white rounded-none border-b border-slate-200 pb-6 last:border-0"
                >
                  <h4 className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                    {group.room?.name || "Rạp chiếu"}
                  </h4>

                  <div className="flex items-start gap-6">
                    <div className="w-32 text-sm text-slate-500 font-medium pt-2">
                      2D Phụ đề
                    </div>
                    <div className="flex-1 flex flex-wrap gap-3">
                      {group.showtimes.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => {
                            nav(
                              `/showtime/${id}/${s._id}/${
                                s.roomId?._id || s.roomId
                              }?hour=${dayjs(s.startTime).format(
                                "HH:mm",
                              )}&movieId=${id}`,
                            );
                          }}
                          className="min-w-20 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition bg-white"
                        >
                          <span
                            className={`font-semibold ${
                              dayjs(s.startTime).isBefore(dayjs())
                                ? ""
                                : "text-blue-700 group-hover:text-white"
                            }`}
                          >
                            {dayjs(s.startTime).format("HH:mm")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <SeatPicker days={days} selectedDate={selectedDate} />
      )}
    </section>
  );
};

export default ShowtimePicker;
