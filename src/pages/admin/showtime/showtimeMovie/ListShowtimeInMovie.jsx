import { CalendarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Pagination, Spin } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { useState } from "react";
import { DAYOFWEEK_LABEL } from "../../../../common/constants/dayOfWeek";
import { QUERYKEY } from "../../../../common/constants/queryKey";
import { getDetailMovie } from "../../../../common/services/movie.service";
import { getShowtimeWeekday } from "../../../../common/services/showtime.service";
import FilterShowtimeInMovie from "./components/FilterShowtimeInMovie";
import ShowtimeCard from "./components/ShowtimeCard";
import CreateShowtimeModal from "./create/CreateShowtimeModal";

const ListShowtimeInMovie = () => {
  const { id: movieId } = useParams();

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
  });

  const updateFilter = (payload) => {
    setQuery((prev) => ({
      ...prev,
      ...payload,
      page: 1,
    }));
  };

  const onSelectPaginateChange = (page) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));
  };

  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const { data: movieData, isLoading: isLoadingMovie } = useQuery({
    queryKey: [QUERYKEY.MOVIE, movieId],
    queryFn: () => getDetailMovie(movieId),
    enabled: !!movieId,
  });

  const movie = movieData?.data || {};

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SHOWTIME, movieId, ...Object.values(cleanedQuery)],
    queryFn: () =>
      getShowtimeWeekday({
        movieId,
        sort: "startTime",
        order: "asc",
        ...cleanedQuery,
      }),
    enabled: !!movieId,
  });

  return (
    <div className="min-h-screen px-8 py-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {isLoadingMovie ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="mb-10 flex justify-between gap-10 rounded-2xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/40">
            <div className="flex gap-10">
              <div className="h-[360px] w-[260px] overflow-hidden rounded-xl border border-slate-700 shadow-lg shadow-black/50">
                <Image
                  src={movie.poster}
                  alt={movie.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 text-white">
                <h2 className="text-3xl font-semibold">{movie.name}</h2>

                <p className="w-fit rounded-md bg-blue-50 px-3 py-1 text-blue-600">
                  Phim rất hay
                </p>

                <p className="w-fit rounded-md bg-green-50 px-3 py-1 text-green-600">
                  Thời lượng: {movie.duration} phút
                </p>

                <p className="w-fit rounded-md bg-purple-50 px-3 py-1 text-purple-600">
                  Thể loại:{" "}
                  {(movie?.category || [])
                    .map((c) => c.name)
                    .join(", ") || "Chưa cập nhật"}
                </p>

                {movie.ageRestriction && (
                  <p className="w-fit rounded-md bg-orange-50 px-3 py-1 text-orange-600">
                    {movie.ageRestriction}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <CreateShowtimeModal movie={movie}>
                <Button
                  type="primary"
                  size="large"
                  className="rounded-xl bg-blue-500 px-6 font-semibold shadow-lg shadow-blue-500/40 hover:bg-blue-600"
                >
                  Thêm lịch chiếu
                </Button>
              </CreateShowtimeModal>
            </div>
          </div>

          <div
            className="
              mb-8 rounded-2xl border border-slate-700 bg-slate-900/90 p-6
              shadow-lg shadow-black/40
              [&_.ant-picker]:bg-slate-900
              [&_.ant-picker]:border-slate-700
              [&_.ant-picker-input>input]:text-slate-100
              [&_.ant-picker-input>input::placeholder]:text-slate-400
              [&_.ant-select-selector]:bg-slate-900
              [&_.ant-select-selector]:border-slate-700
              [&_.ant-select-selection-item]:text-slate-100
              [&_.ant-select-selection-placeholder]:text-slate-400
              [&_.ant-btn-default]:bg-slate-900
              [&_.ant-btn-default]:border-slate-700
              [&_.ant-btn-default]:text-slate-100
            "
          >
            <FilterShowtimeInMovie updateFilter={updateFilter} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <Spin size="large" />
            </div>
          ) : (
            <div className="space-y-10">
              {data?.data &&
                Object.entries(data.data).map(([date, showtimes]) => (
                  <div
                    key={date}
                    className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl shadow-black/40"
                  >
                    <div className="mb-6 flex items-center gap-3 text-xl font-semibold text-slate-50">
                      <CalendarOutlined className="text-2xl text-blue-400" />
                      {DAYOFWEEK_LABEL[dayjs(date).day()]},{" "}
                      {dayjs(date).format("DD/MM")}
                    </div>

                    <div
                      className="grid gap-6"
                      style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                    >
                      {showtimes.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-xl transition transform hover:-translate-y-1 hover:shadow-2xl"
                        >
                          <ShowtimeCard item={item} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              <Pagination
                onChange={onSelectPaginateChange}
                current={data?.meta?.page}
                total={data?.meta?.total}
                pageSize={data?.meta?.limit}
                className="flex justify-end pt-6 text-white [&_.ant-pagination-item-active]:border-blue-500! [&_.ant-pagination-item-active]:bg-blue-500! [&_.ant-pagination-item-active_a]:text-white! [&_.ant-pagination-prev_button]:text-white! [&_.ant-pagination-next_button]:text-white!"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListShowtimeInMovie;
