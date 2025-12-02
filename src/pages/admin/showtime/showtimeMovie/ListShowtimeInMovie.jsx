import {
  CalendarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Pagination, Spin, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { QUERY } from "../../../../common/constants/queryKey";
import { SHOWTIME_STATUS_BADGE } from "../../../../common/constants/showtime";
import { formatCurrency } from "../../../../common/utils";
import { useTable } from "../../../../common/hooks/useTable";
import { getAgeBadge } from "../../../../common/utils/age";
import FilterShowtimeInMovie from "./components/FilterShowtimeInMovie";
import { DAYOFWEEK_LABEL } from "../../../../common/constants/dayOfWeek";
import { getShowtimeWeekday } from "../../../../common/services/showtime.service";
import { getDetailMovie } from "../../../../common/services/movie.service";

const ListShowtimeInMovie = () => {
  const { id: movieId } = useParams();
  const { query, onSelectPaginateChange } = useTable("showtime");
  const { data: movieData, isLoading: isLoadingMovie } = useQuery({
    queryKey: [QUERY.MOVIE, movieId],
    queryFn: () => getDetailMovie(movieId),
  });
  const movie = movieData?.data || {};
  const { data, isLoading } = useQuery({
    queryKey: [
      QUERY.SHOWTIME,
      movieId,
      ...Object.values(query),
      ...Object.keys(query),
    ],
    queryFn: () =>
      getShowtimeWeekday({
        movieId,
        sort: "startTime",
        order: "asc",
        limit: 2,
        startTimeFrom: dayjs().startOf("day").toISOString(),
        ...query,
      }),
    enabled: !!movie,
  });
  const { color, label, description, text } = getAgeBadge(movie.ageRequire);
  return (
    <div>
      {isLoadingMovie && movie ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Spin />
        </div>
      ) : (
        <>
          <div className="bg-primary/5 gap-6 py-6 px-8 border-b-gray-700/80 border-b">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "1fr 4fr" }}
            >
              <div className="rounded-md h-58 w-full overflow-hidden">
                <Image src={movie.poster} className="object-cover" />
              </div>
              <div>
                <h3 className="line-clamp-1 text-xl font-semibold">
                  {movie.name}
                </h3>
                <p className="line-clamp-3 mt-2 text-black">
                  {movie.description}
                </p>
                <p className="mt-2 text-black line-clamp-1">
                  <span className="text-black">Thời lượng:</span>{" "}
                  {movie.duration} phút
                </p>
                <p className="mt-2 text-black line-clamp-1">
                  <span className="text-black">Thể loại:</span>{" "}
                  {movie.genreIds
                    .filter((c) => c.status)
                    .map((c) => c.name)
                    .join(", ") || "Chưa cập nhật"}
                </p>
                <Tooltip title={description} className="mt-2! cursor-pointer!">
                  <Tag color={color}>
                    {label} - {text}
                  </Tag>
                </Tooltip>
              </div>
            </div>
            <FilterShowtimeInMovie />
          </div>
          {isLoading ? (
            <div className="flex min-h-[20vh] items-center justify-center">
              <Spin size="default" />
            </div>
          ) : (
            <div className="px-8 py-4">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-lg font-medium">Lịch chiếu</p>
                  <p className="text-xs  mt-2">
                    {data?.meta?.total} Ngày chiếu
                  </p>
                </div>
                <div>
                  <Button>Thêm lịch chiếu</Button>
                </div>
              </div>
              {data?.data && Object.entries(data?.data).length === 0 && (
                <div className="min-h-[35vh] flex items-center justify-center">
                  <p className="text-red-500">Không có lịch chiếu nào</p>
                </div>
              )}
              {data?.data &&
                Object.entries(data.data).length !== 0 &&
                Object.entries(data.data).map(([date, showtimes]) => (
                  <div key={date} className="mb-6">
                    <div className="text-base flex items-center gap-2">
                      <CalendarOutlined className="text-primary!" />
                      <p className="font-medium mb-0!">
                        {DAYOFWEEK_LABEL[dayjs(date).day()]},{" "}
                        {dayjs(date).format("DD/MM")}
                      </p>
                    </div>
                    <div
                      className="grid gap-4 mt-4"
                      style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                    >
                      {showtimes.map((item) => {
                        const values = item.price.map((item) => item.value);
                        const minPrice = Math.min(...values);
                        const maxPrice = Math.max(...values);
                        return (
                          <div
                            key={item._id}
                            className="p-4  border border-gray-500/50 bg-gray-300/5 shadow-md rounded-md"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-base font-semibold mb-0!">
                                {dayjs(item.startTime).format("HH:mm")}
                              </p>
                              <Tag
                                color={SHOWTIME_STATUS_BADGE[item.status].color}
                              >
                                {SHOWTIME_STATUS_BADGE[item.status].label}
                              </Tag>
                            </div>
                            <div className="flex items-center justify-between mt-2 ">
                              <p className="mb-0!">
                                <EnvironmentOutlined />
                                {item.roomId.name}
                              </p>
                              <Tag color="#666666">
                                0/{item.roomId.capacity}
                              </Tag>
                            </div>
                            <div className="mt-2">
                              <p className="text-green-500">
                                {formatCurrency(minPrice)} -{" "}
                                {formatCurrency(maxPrice)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                className="flex-1"
                                icon={<EditOutlined />}
                              >
                                Chỉnh sửa
                              </Button>
                              <Button
                                className="flex-1"
                                icon={<TeamOutlined />}
                              >
                                Ghế
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              <div>
                <Pagination
                  onChange={onSelectPaginateChange}
                  current={data?.meta?.page}
                  align="end"
                  total={data?.meta?.total}
                  pageSize={data?.meta?.limit}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListShowtimeInMovie;