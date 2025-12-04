import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { RetweetOutlined } from "@ant-design/icons";
import { useTable } from "../../../../../common/hooks/useTable";
import { DAYOFWEEK_LABEL } from "../../../../../common/constants/dayOfWeek";
import { QUERY } from "../../../../../common/constants/queryKey";
import {
  SHOWTIME_STATUS,
  SHOWTIME_STATUS_BADGE,
} from "../../../../../common/constants/showtime";
import { getAllRoom } from "../../../../../common/services/room.service";

const { RangePicker } = DatePicker;

const FilterShowtimeInMovie = () => {
  const { id } = useParams();
  const { query, onFilter, resetFilter } = useTable("showtime");
  const { data } = useQuery({
    queryKey: [QUERY.ROOM],
    queryFn: () => getAllRoom({ status: true }),
  });
  const [date, setDate] = useState([dayjs().startOf("day"), null]);
  const handleChangeRangePicker = (dates) => {
    const startTimeFrom = dates?.[0]
      ? dates[0].startOf("day").toISOString()
      : "";
    const startTimeTo = dates?.[1] ? dates[1].endOf("day").toISOString() : "";
    onFilter({
      startTimeFrom: [startTimeFrom],
      startTimeTo: [startTimeTo],
    });
    setDate(dates ?? [null, null]);
  };
  useEffect(() => {
    setDate([dayjs().startOf("day"), null]);
  }, [id]);
  useEffect(() => {
    setDate([
      dayjs(query.startTimeFrom),
      query.startTimeTo ? dayjs(query.startTimeTo) : null,
    ]);
  }, [query.startTimeFrom, query.startTimeTo]);

  return (
    <div className="mt-6 flex items-end gap-4">
      <div>
        <p className="mb-2">Lọc theo khoảng ngày</p>
        <RangePicker
          value={date}
          allowClear={false}
          placeholder={["Từ ngày", "Đến ngày"]}
          onChange={handleChangeRangePicker}
        />
      </div>
      <div>
        <p className="mb-2">Ngày trong tuần</p>
        <Select
          placeholder="Chọn ngày trong tuần"
          allowClear
          value={query.dayOfWeek}
          onChange={(e) => {
            onFilter({ dayOfWeek: [e] });
          }}
          style={{ width: 150 }}
          options={[
            {
              value: "",
              label: "Tất cả ngày",
            },
            ...Object.entries(DAYOFWEEK_LABEL).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
      </div>
      <div>
        <p className="mb-2">Phòng chiếu</p>
        <Select
          placeholder="Chọn phòng chiếu"
          allowClear
          value={query.roomId}
          onChange={(e) => {
            onFilter({ roomId: [e] });
          }}
          style={{ width: 150 }}
          options={data?.data.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
        />
      </div>
      <div>
        <p className="mb-2">Trạng thái</p>
        <Select
          placeholder="Chọn trạng thái"
          defaultValue={query.status || ""}
          allowClear
          value={query.status}
          onChange={(e) => {
            onFilter({ status: e ? [e] : [] });
          }}
          style={{ width: 150 }}
          options={[
            { value: "", label: "Tất cả trạng thái" },
            ...Object.values(SHOWTIME_STATUS).map((item) => ({
              value: item,
              label: SHOWTIME_STATUS_BADGE[item].label,
            })),
          ]}
        />
      </div>
      <Button onClick={() => resetFilter()} icon={<RetweetOutlined />}>
        Đặt lại
      </Button>
    </div>
  );
};

export default FilterShowtimeInMovie;
