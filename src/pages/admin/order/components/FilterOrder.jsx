import { DatePicker, Input, Select } from "antd";
import { useTable } from "../../../../common/hooks/useTable";
import { useEffect, useState } from "react";
import { ORDER_OPTIONS_STATUS } from "../../../../common/constants/order";
import dayjs from "dayjs";
import { getAllRoom } from "../../../../common/services/room.service";
import { useQuery } from "@tanstack/react-query";
import { getAllMovie } from "../../../../common/services/movie.service";
import { QUERYKEY } from "../../../../common/constants/queryKey";
const { RangePicker } = DatePicker;

const FilterOrder = () => {
  const { query, onFilter } = useTable();
  const [timeSelect, setTimeSelect] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const { data } = useQuery({
    queryKey: [QUERYKEY.MOVIE],
    queryFn: () => getAllMovie({ status: true }),
  });
  const { data: roomData } = useQuery({
    queryKey: [QUERYKEY.ROOM],
    queryFn: () => getAllRoom({ status: true }),
  });
  useEffect(() => {
    if (query.search) {
      setSearchValue(query.search);
    }
  }, []);
  const movies = data?.data;
  const rooms = roomData?.data;
  return (
    <div className="mt-4 flex items-center gap-4">
      <div>
        <p className="mb-2">Tìm kiếm</p>
        <Input.Search
          value={searchValue}
          allowClear
          onSearch={(e) => onFilter({ search: [e] })}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (!e.target.value) onFilter({ search: null });
          }}
          placeholder="Tìm kiếm theo mã vé, thông tin người dùng"
        />
      </div>
      <div>
        <p className="mb-2">Thời gian</p>
        <Select
          defaultValue={query.createdAt || ""}
          allowClear
          placeholder="Chọn thời gian hiển thị"
          onChange={(e) => {
            if (e !== "range") {
              onFilter({
                createdAtFrom: e
                  ? [dayjs(e).startOf("day").toISOString()]
                  : null,
                createdAtTo: e ? [dayjs(e).endOf("day").toISOString()] : null,
              });
            } else {
              onFilter({ createdAtFrom: null, createdAtTo: null });
            }
            setTimeSelect(e);
          }}
          options={[
            { value: "", label: "Tất cả thời gian" },
            { value: "range", label: "Khoảng thời gian" },
            {
              value: dayjs().format("YYYY-MM-DD"),
              label: "Hôm nay",
            },
          ]}
          style={{ width: 150 }}
        />
      </div>
      {timeSelect === "range" && (
        <div>
          <p className="mb-2">Khoảng thời gian</p>
          <RangePicker
            placeholder={["Bắt đầu", "Kết thúc"]}
            onChange={(e) => {
              onFilter({
                createdAtFrom: e
                  ? [dayjs(e[0]).startOf("day").toISOString()]
                  : null,
                createdAtTo: e
                  ? [dayjs(e[1]).endOf("day").toISOString()]
                  : null,
              });
            }}
          />
        </div>
      )}
      <div>
        <p className="mb-2">Trạng thái vé</p>
        <Select
          defaultValue={query.status || ""}
          placeholder="Chọn trạng thái vé"
          options={[
            {
              value: "",
              label: "Tất cả trạng thái",
            },
            ...Object.entries(ORDER_OPTIONS_STATUS).map(([key, value]) => ({
              label: value,
              value: key,
            })),
          ]}
          allowClear
          onChange={(e) => onFilter({ status: [e] })}
          style={{ width: 150 }}
        />
      </div>
      {movies && (
        <div>
          <p className="mb-2">Lọc theo phim</p>
          <Select
            showSearch
            placeholder="Chọn phim"
            defaultValue={query.movieId || ""}
            allowClear
            style={{ width: 200 }}
            onChange={(e) => onFilter({ movieId: [e] })}
            optionFilterProp="label"
            optionLabelProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          >
            <Select.Option value="" label="Tất cả phim">
              Tất cả phim
            </Select.Option>
            <Select.OptGroup label="Đang chiếu">
              {movies
                ?.filter((m) => m.statusRelease === "nowShowing")
                .map((movie) => (
                  <Select.Option
                    key={movie._id}
                    value={movie._id}
                    label={movie.name}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={movie.poster}
                        className="w-8 h-10 object-cover rounded"
                        alt={movie.name}
                      />
                      <span className="truncate">{movie.name}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select.OptGroup>
            <Select.OptGroup label="Sắp chiếu">
              {movies
                ?.filter((m) => m.statusRelease === "upcoming")
                .map((movie) => (
                  <Select.Option
                    key={movie._id}
                    value={movie._id}
                    label={movie.name}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={movie.poster}
                        className="w-8 h-10 object-cover rounded"
                        alt={movie.name}
                      />
                      <span className="truncate">{movie.name}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select.OptGroup>
            <Select.OptGroup label="Đã chiếu">
              {movies
                ?.filter((m) => m.statusRelease === "released")
                .map((movie) => (
                  <Select.Option
                    key={movie._id}
                    value={movie._id}
                    label={movie.name}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={movie.poster}
                        className="w-8 h-10 object-cover rounded"
                        alt={movie.name}
                      />
                      <span className="truncate">{movie.name}</span>
                    </div>
                  </Select.Option>
                ))}
            </Select.OptGroup>
          </Select>
        </div>
      )}
      {rooms && (
        <div>
          <p className="mb-2">Phòng chiếu</p>
          {rooms && (
            <Select
              defaultValue={query.createdAt || ""}
              allowClear
              onChange={(e) => onFilter({ roomName: [e] })}
              placeholder="Chọn phòng chiếu"
              options={[
                {
                  label: "Tất cả phòng chiếu",
                  value: "",
                },
                ...rooms.map((item) => ({
                  label: item.name,
                  value: item.name,
                })),
              ]}
              style={{ width: 150 }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FilterOrder;
