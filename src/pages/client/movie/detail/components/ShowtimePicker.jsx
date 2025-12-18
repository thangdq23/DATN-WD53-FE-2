import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import { useTable } from "../../../../../common/hooks/useTable";
import { getShowtimeWeekday } from "../../../../../common/services/showtime.service";
import SeatPicker from "./seatPicker";

const ShowtimePicker = () => {
  const nav = useNavigate();
  const { id, roomId, showtimeId } = useParams();
  const [dateSelect, setDateSelect] = useState();
  const [showtime, setShowtime] = useState(null);
  const { query } = useTable("time");

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SHOWTIME, id, ...Object.values(query)],
    queryFn: () =>
      getShowtimeWeekday({
        status: "scheduled",
        movieId: id,
        sort: "startTime",
        order: "asc",
        limit: 100,
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
      {/* Chưa chọn showtime ⇒ render danh sách giờ chiếu */}
      {!roomId || !showtimeId ? (
        <>
          {/* List showtimes removed */}
        </>
      ) : (
        <SeatPicker />
      )}
    </section>
  );
};

export default ShowtimePicker;
