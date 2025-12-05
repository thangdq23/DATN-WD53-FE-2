import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import { getShowtimeWeekday } from "../../../../../common/services/showtime.service";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DAYOFWEEK_LABEL } from "../../../../../common/constants/dayOfWeek";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useTableHook } from "../../../../../common/hooks/useTableHook";

const ShowtimePicker = () => {
  const { id } = useParams();
  const [dateSelect, setDateSelect] = useState("");
  const [showtime, setShowtime] = useState(null);
  const { query, onSelectPaginateChange } = useTableHook("time");

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

  return (
    <section>
      <div className="bg-[#1a1d23] h-24 relative flex items-center justify-center">
        
        {data?.meta && data.meta.page !== 1 && (
          <button
            onClick={() =>
              onSelectPaginateChange(data.meta.page - 1, data.meta.limit)
            }
            className="px-5 bg-[#dc2626] h-full absolute left-0 hover:opacity-80 transition cursor-pointer"
          >
            <LeftOutlined />
          </button>
        )}

        {data?.data &&
          Object.entries(data.data).map(([date, list]) => (
            <div
              key={date}
              onClick={() => {
                setDateSelect(date);
                setShowtime(list);
              }}
              className={`${
                date === dateSelect ? "bg-[#dc2626]" : ""
              } cursor-pointer h-full justify-center w-22 flex flex-col items-center`}
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
                onSelectPaginateChange(data.meta.page + 1, data.meta.limit)
              }
              className="px-5 bg-[#dc2626] h-full absolute right-0 hover:opacity-80 transition cursor-pointer"
            >
              <RightOutlined />
            </button>
          )}
      </div>

      {!isLoading && (
        <div className="grid mt-8 grid-cols-5 gap-6 max-w-7xl mx-6 xl:mx-auto">
          {showtime?.map((item) => (
            <button
              key={item._id}
              className="border border-gray-500/50 hover:bg-gray-500/50 transition cursor-pointer py-4 rounded-full"
            >
              {dayjs(item.startTime).format("HH:mm")}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShowtimePicker;
