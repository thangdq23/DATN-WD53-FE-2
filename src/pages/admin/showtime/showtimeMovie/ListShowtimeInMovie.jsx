import { CalendarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Pagination, Spin, Tag } from "antd";
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
    setQuery((prev) => ({ ...prev, page }));
  };

  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(([_, v]) => v !== undefined && v !== null && v !== "")
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
    <div className="bg-[#f5f7fb] min-h-screen p-8">
      {isLoadingMovie ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow p-8 mb-10 flex justify-between gap-10">
            <div className="flex gap-10">
              <div className="w-[260px] h-[360px] rounded-xl overflow-hidden shadow-md border">
                <Image src={movie.poster} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col gap-3 pt-3">
                <h2 className="text-3xl font-semibold">{movie.name}</h2>

                <p className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 w-fit">
                  Phim rất hay
                </p>

                <p className="px-3 py-1 rounded-md bg-green-50 text-green-600 w-fit">
                  Thời lượng: {movie.duration} phút
                </p>

                <p className="px-3 py-1 rounded-md bg-purple-50 text-purple-600 w-fit">
                  Thể loại:{" "}
                  {(movie?.category || [])
                    .map((c) => c.name)
                    .join(", ") || "Chưa cập nhật"}
                </p>

                {movie.ageRestriction && (
                  <p className="px-3 py-1 rounded-md bg-orange-50 text-orange-600 w-fit">
                    {movie.ageRestriction}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <CreateShowtimeModal movie={movie}>
                <Button type="primary" size="large" className="px-6 rounded-xl">
                  Thêm lịch chiếu
                </Button>
              </CreateShowtimeModal>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border">
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
                    className="bg-white p-6 rounded-2xl border shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-xl font-semibold text-gray-900 mb-6">
                      <CalendarOutlined className="text-blue-500 text-2xl" />
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
                          className="transition transform hover:-translate-y-1 hover:shadow-xl rounded-xl"
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
                className="pt-6 flex justify-end"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListShowtimeInMovie;
