import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Select } from "antd";
import dayjs from "dayjs";
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
    if (!dates) {
      onFilter({
        startTimeFrom: [],
        startTimeTo: [],
      });
      setDate(null);
      return;
    }

    const [start, end] = dates;

    const startTimeFrom = start ? start.startOf("day").toISOString() : "";
    const startTimeTo = end ? end.endOf("day").toISOString() : "";

    onFilter({
      startTimeFrom: startTimeFrom ? [startTimeFrom] : [],
      startTimeTo: startTimeTo ? [startTimeTo] : [],
    });

    setDate(dates);
  };

  useEffect(() => {
    setDate([dayjs().startOf("day"), null]);
  }, [id]);

  useEffect(() => {
    if (!query.startTimeFrom && !query.startTimeTo) {
      setDate(null);
      return;
    }

    const start = query.startTimeFrom ? dayjs(query.startTimeFrom) : null;
    const end = query.startTimeTo ? dayjs(query.startTimeTo) : null;
    setDate([start, end]);
  }, [query.startTimeFrom, query.startTimeTo]);

  return (
    <div className="mt-4 flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-700">Lọc theo khoảng ngày</p>
        <RangePicker
          value={date}
          allowClear
          placeholder={["Từ ngày", "Đến ngày"]}
          onChange={handleChangeRangePicker}
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#94a3b8",
            color: "#0f172a",
            borderRadius: 8,
            padding: "4px 12px",
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-700">Ngày trong tuần</p>
        <Select
          placeholder="Chọn ngày trong tuần"
          allowClear
          value={query.dayOfWeek}
          onChange={(e) => {
            onFilter({ dayOfWeek: e ? [e] : [] });
          }}
          style={{
            width: 180,
            backgroundColor: "#ffffff",
            borderColor: "#94a3b8",
            color: "#0f172a",
            borderRadius: 8,
          }}
          dropdownStyle={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
          }}
          options={[
            { value: "", label: "Tất cả ngày" },
            ...Object.entries(DAYOFWEEK_LABEL).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-700">Phòng chiếu</p>
        <Select
          placeholder="Chọn phòng chiếu"
          allowClear
          value={query.roomId}
          onChange={(e) => {
            onFilter({ roomId: e ? [e] : [] });
          }}
          style={{
            width: 180,
            backgroundColor: "#ffffff",
            borderColor: "#94a3b8",
            color: "#0f172a",
            borderRadius: 8,
          }}
          dropdownStyle={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
          }}
          options={
            data?.data.map((item) => ({
              value: item._id,
              label: item.name,
            })) ?? []
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-700">Trạng thái</p>
        <Select
          placeholder="Chọn trạng thái"
          allowClear
          value={query.status}
          onChange={(e) => {
            onFilter({ status: e ? [e] : [] });
          }}
          style={{
            width: 180,
            backgroundColor: "#ffffff",
            borderColor: "#94a3b8",
            color: "#0f172a",
            borderRadius: 8,
          }}
          dropdownStyle={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
          }}
          options={[
            { value: "", label: "Tất cả trạng thái" },
            ...Object.values(SHOWTIME_STATUS).map((item) => ({
              value: item,
              label: SHOWTIME_STATUS_BADGE[item].label,
            })),
          ]}
        />
      </div>

      <Button
        onClick={() => {
          resetFilter();
          setDate([dayjs().startOf("day"), null]);
        }}
        icon={<RetweetOutlined />}
        style={{
          backgroundColor: "#ffffff",
          borderColor: "#94a3b8",
          color: "#0f172a",
          borderRadius: 8,
        }}
      >
        Đặt lại
      </Button>
    </div>
  );
};

export default FilterShowtimeInMovie;
