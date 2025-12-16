import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DAYOFWEEK_LABEL } from "../../../../../common/constants/dayOfWeek";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import { useTable } from "../../../../../common/hooks/useTable";
import { getShowtimeWeekday } from "../../../../../common/services/showtime.service";
import ModalSelectRoom from "./ModalSelectRoom";
import SeatPicker from "./seatPicker";

const ShowtimePicker = () => {
  const nav = useNavigate();
  const { id, roomId, showtimeId } = useParams();
  const [dateSelect, setDateSelect] = useState();
  const [showtime, setShowtime] = useState(null);
  const { query, onSelectPaginateChange } = useTable("time");

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SHOWTIME, id, ...Object.values(query)],
    queryFn: () =>
      getShowtimeWeekday({
        status: "scheduled",
        movieId: id,
        sort: "startTime",
        order: "asc",
        limit: 7,
        groupTime: true,
        startTimeFrom: dayjs()
          .add(2, "hour")
          .second(0)
          .millisecond(0)
          .toISOString(),
        ...query,
      }),
  });

  useEffect(() => {
    if (data?.data) {
      const firstKey = Object.keys(data.data)[0];
      const firstValues = Object.values(data.data)[0];
      setDateSelect(firstKey);
      setShowtime(firstValues);
    }
  }, [data?.data]);

  useEffect(() => {
    if (showtimeId && roomId) {
      const seatPickerElement = document.getElementById("seat-picker-container");
      if (seatPickerElement) {
        seatPickerElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [showtimeId, roomId]);

  return (
    <section id="seat-picker-container">
      <div className="bg-[#1a1d23] h-24 relative flex items-center justify-center">
        {data?.meta && data.meta.page !== 1 && (
          <button
            onClick={() =>
              onSelectPaginateChange(
                data.meta.page - 1,
                data.meta.limit
              )
            }
            className="px-5 bg-[#dc2626] h-full absolute left-0 hover:opacity-80 transition cursor-pointer"
          >
            <LeftOutlined />
          </button>
        )}

        {data?.data &&
          Object.entries(data.data).map(([date, showtime]) => (
            <div
              key={date}
              onClick={() => {
                if (showtimeId && roomId) return;
                setDateSelect(date);
                setShowtime(showtime);
              }}
              className={`${date === dateSelect && "bg-[#dc2626]"} cursor-pointer h-full justify-center w-22 flex flex-col items-center`}
            >
              <p>{dayjs(date).format("[Thg.] MM")}</p>
              <p className="font-semibold text-2xl">
                {dayjs(date).format("DD")}
              </p>
              <p>{DAYOFWEEK_LABEL[dayjs(date).day()]}</p>
            </div>
          ))}

        {data?.meta &&
          data.meta.limit < data.meta.total &&
          data.meta.page !== data.meta.totalPages && (
            <button
              onClick={() =>
                onSelectPaginateChange(
                  data.meta.page + 1,
                  data.meta.limit
                )
              }
              className="px-5 bg-[#dc2626] h-full absolute right-0 hover:opacity-80 transition cursor-pointer"
            >
              <RightOutlined />
            </button>
          )}
      </div>

      {/* Chưa chọn showtime ⇒ render danh sách giờ chiếu */}
      {!roomId || !showtimeId ? (
        <>
          {!isLoading && (
            <div className="grid mt-8 grid-cols-5 gap-6 max-w-7xl mx-6 xl:mx-auto">
              {showtime?.map((item) =>
                item.externalRoom?.length > 1 ? (
                  <ModalSelectRoom
                    showtime={item}
                    room={item.externalRoom}
                    key={item._id}
                  >
                    <button className="border border-gray-500/50 hover:bg-gray-500/50 transition cursor-pointer py-4 rounded-full">
                      {dayjs(item.startTime).format("HH:mm")}
                    </button>
                  </ModalSelectRoom>
                ) : (
                  <button
                    onClick={() => {
                      nav(`/showtime/${id}/${item._id}/${item.roomId._id}?hour=${dayjs(item.startTime).format("HH:mm")}&movieId=${item.movieId._id}`);
                    }}
                    key={item._id}
                    className="border border-gray-500/50 hover:bg-gray-500/50 w-full text-white transition cursor-pointer py-4 rounded-full"
                  >
                    {dayjs(item.startTime).format("HH:mm")}
                  </button>
                )
              )}
            </div>
          )}
        </>
      ) : (
        <SeatPicker />
      )}
    </section>
  );
};

export default ShowtimePicker;
