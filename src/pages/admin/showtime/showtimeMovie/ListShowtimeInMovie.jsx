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
    <div className="px-6 py-4">
      {isLoadingMovie ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT – Thông tin phim */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              {/* Poster */}
              <Image
                src={movie.poster}
                className="rounded-lg object-cover w-full aspect-[3/4]"
                preview={false}
              />

              {/* Tên phim */}
              <h3 className="text-lg font-semibold mt-3 text-center">
                {movie.name}
              </h3>

              {/* Mô tả */}
              <p className="text-gray-600 text-sm mt-2 line-clamp-4 text-center">
                {movie.description}
              </p>

              {/* Info list */}
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold">⏱ Thời lượng:</span>{" "}
                  {movie.duration} phút
                </p>

                <p>
                  <span className="font-semibold">🎬 Thể loại:</span>{" "}
                  {movie.genreIds
                    ?.filter((c) => c.status)
                    .map((c) => c.name)
                    .join(", ") || "Chưa cập nhật"}
                </p>
              </div>

              {/* Age badge */}
              <div className="flex justify-center mt-4">
                <Tooltip title={description}>
                  <Tag
                    color={color}
                    className="px-3 py-[2px] text-sm rounded-md"
                  >
                    {label} – {text}
                  </Tag>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* RIGHT – Lịch chiếu + filter ngang */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filter ngang */}
            <FilterShowtimeInMovie horizontal />

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[30vh]">
                <Spin size="large" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mt-15">
                  <div>
                    <p className="text-xl font-semibold">Lịch chiếu</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {data?.meta?.total || 0} Ngày chiếu
                    </p>
                  </div>
                  <Button type="primary">Thêm lịch chiếu</Button>
                </div>

                {/* No data */}
                {data?.data && Object.keys(data.data).length === 0 && (
                  <div className="flex justify-center items-center min-h-[30vh]">
                    <p className="text-red-500">Không có lịch chiếu nào</p>
                  </div>
                )}

                {/* Date Sections */}
                {data?.data &&
                  Object.entries(data.data).map(([date, showtimes]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-primary" />
                        <p className="font-medium">
                          {DAYOFWEEK_LABEL[dayjs(date).day()]},{" "}
                          {dayjs(date).format("DD/MM/YYYY")}
                        </p>
                      </div>

                      {/* Showtime grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {showtimes.map((item) => {
                          const prices = item.price.map((p) => p.value);
                          const minPrice = Math.min(...prices);
                          const maxPrice = Math.max(...prices);

                          return (
                            <div
                              key={item._id}
                              className="
                                bg-white 
                                p-3
                                rounded-xl
                                border border-gray-200
                                shadow-sm
                                hover:shadow-md
                                transition-all
                                flex flex-col gap-2
                                text-[13px]
                              "
                            >
                              {/* Time + Status */}
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-[14px]">
                                  {dayjs(item.startTime).format("HH:mm")}
                                  <span className="text-gray-400"> – </span>
                                  {dayjs(item.endTime).format("HH:mm")}
                                </p>

                                <Tag
                                  color={
                                    SHOWTIME_STATUS_BADGE[item.status].color
                                  }
                                  className="rounded-full px-2 py-[1px] text-[10px]"
                                >
                                  {SHOWTIME_STATUS_BADGE[item.status].label}
                                </Tag>
                              </div>

                              {/* Room */}
                              <div className="flex items-center text-gray-600 gap-1 text-[12px]">
                                <EnvironmentOutlined className="text-[12px]" />
                                <span>{item.roomId.name}</span>
                              </div>

                              {/* Price */}
                              <p className="text-green-600 font-semibold text-[13px]">
                                {formatCurrency(minPrice)} –{" "}
                                {formatCurrency(maxPrice)}
                              </p>

                              {/* Capacity */}
                              <div className="flex justify-end">
                                <Tag className="rounded-full text-gray-500 text-[10px] px-2 py-[1px]">
                                  {`0/${item.roomId.capacity}`}
                                </Tag>
                              </div>

                              {/* Buttons */}
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <Button
                                  icon={<EditOutlined />}
                                  className="rounded-lg py-[3px] text-[12px] h-7"
                                  block
                                >
                                  Sửa
                                </Button>

                                <Button
                                  icon={<TeamOutlined />}
                                  className="rounded-lg py-[3px] text-[12px] h-7"
                                  block
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

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  <Pagination
                    onChange={onSelectPaginateChange}
                    current={data?.meta?.page}
                    total={data?.meta?.total}
                    pageSize={data?.meta?.limit}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListShowtimeInMovie;
