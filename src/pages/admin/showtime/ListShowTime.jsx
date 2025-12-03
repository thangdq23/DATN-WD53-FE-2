import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Pagination, Select, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Link, Outlet, useLocation, useParams } from "react-router";
import { statusRelease } from "../../../common/constants";
import { QUERY } from "../../../common/constants/queryKey";
import { useTable } from "../../../common/hooks/useTable";
import { getMovieHasShowtime } from "../../../common/services/showtime.service";
import { getAgeBadge } from "../../../common/utils/age";
import TextWrap from "../../../components/WrapText";

const ListShowtime = () => {
  const { query, onFilter } = useTable("movie");
  const { id: movieId } = useParams();
  const { pathname } = useLocation();
  const { data } = useQuery({
    queryKey: [QUERY.SHOWTIME, ...Object.values(query)],
    queryFn: () =>
      getMovieHasShowtime({
        limit: 3,
        ...query,
      }),
  });
  const equalDynamicRoute = ["/admin/showtimes/create"];
  return (
    <div className=" w-full min-h-[87vh] rounded-md shadow-md px-6 py-4">
      <h3 className="text-base">Quản Lý Lịch Chiếu</h3>
      <div className="flex flex-col  mt-4 gap-4">
        <div className="shadow-lg px-4 py-4 rounded-md h-[35vh]">
          <div className="flex items-start justify-between ">
            <div>
              <h3>Danh Sách Phim</h3>
            </div>
            <Link to={"/admin/showtimes/create"}>
              <Button className="text-xs!">Thêm suất chiếu</Button>
            </Link>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <Input.Search
              className="flex-1"
              placeholder="Tìm kiếm tên phim"
              allowClear
              onChange={(e) => {
                if (!e.target.value) onFilter({ search: null });
              }}
              onSearch={(e) => onFilter({ search: [e] })}
            />
            <Select
              style={{ width: 150 }}
              allowClear
              onChange={(e) => onFilter({ statusRelease: [e] })}
              placeholder="Chọn trạng thái"
              options={[
                ...Object.entries(statusRelease).map(([key, value]) => ({
                  value: key,
                  label: value.label,
                })),
              ]}
            />
          </div>
          {data?.data && data.data.length !== 0 && (
            <>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {data?.data?.map((item) => {
                  const { color, description, label, text } = getAgeBadge(
                    item.ageRequire,
                  );
                  return (
                    <Link
                      to={`/admin/showtimes/movie/${
                        item._id
                      }?showtime_startTimeFrom=${dayjs()
                        .startOf("day")
                        .toISOString()}`}
                      className="w-full text-white!"
                    >
                      <div
                        className={`flex items-start text-black gap-2 px-2 py-2 border border-gray-700/80 rounded-md w-full cursor-pointer duration-300 ${
                          movieId === item._id
                            ? "border border-primary/70 bg-primary/5"
                            : "hover:border-gray-300/50 "
                        }`}
                      >
                        <img src={item.poster} className="w-18! rounded-md!" />
                        <div className="flex flex-col">
                          <TextWrap
                            text={item.name}
                            style={{ fontWeight: 600, fontSize: 14 }}
                          />
                          <p className="line-clamp-1 text-xs mb-0!">
                            {item.genreIds
                              .filter((c) => c.status)
                              .map((c) => c.name)
                              .join(", ") || "Chưa cập nhật"}
                          </p>
                          <div className=" text-xs flex items-center justify-between">
                            <p className="flex items-center gap-1 mb-0!">
                              <ClockCircleOutlined />
                              {item.duration} phút
                            </p>
                            <p className="mb-0">
                              {item.showtimeCount} suất chiếu
                            </p>
                          </div>
                          <div className="">
                            <Tooltip title={description}>
                              <Tag color={color} className="cursor-pointer">
                                {label} - {text}
                              </Tag>
                            </Tooltip>
                            <Tag
                              color={statusRelease[item.statusRelease].color}
                            >
                              {statusRelease[item.statusRelease].label}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4">
                <Pagination
                  align="end"
                  size="small"
                  current={data?.meta?.page}
                  total={data?.meta?.total}
                  pageSize={data?.meta?.limit}
                />
              </div>
            </>
          )}
          {data?.data && data.data.length === 0 && (
            <div className="flex justify-center min-h-[30vh] items-center">
              <p>Chưa có suất chiếu nào</p>
            </div>
          )}
        </div>
        <div className="shadow-lg rounded-md overflow-hidden">
          {movieId || equalDynamicRoute.includes(pathname) ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center gap-4 justify-center min-h-[35vh]">
              <div className="text-7xl  px-8 py-8 rounded-full">
                <CalendarOutlined />
              </div>
              <p className="font-semibold text-2xl">Vui lòng chọn phim</p>
              <p className="text-base">
                Chọn một bộ phim từ danh sách bên trên để xem lịch chiếu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListShowtime;
