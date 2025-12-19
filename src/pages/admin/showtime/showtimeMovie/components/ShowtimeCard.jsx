import {
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import {
  SHOWTIME_STATUS,
  SHOWTIME_STATUS_BADGE,
} from "../../../../../common/constants/showtime";
import { formatCurrency } from "../../../../../common/utils";
import ModalUpdateShowtime from "./ModalUpdateShowtime";

const ShowtimeCard = ({ item }) => {
  const values = item.price.map((p) => Number(p?.value) || 0);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);

  const start = dayjs(item.startTime);
  const end = start.add(item.movieId.duration, "minutes");

  const isCancelled = item.status === SHOWTIME_STATUS.CANCELLED;
  const isInProgress = item.status === SHOWTIME_STATUS.IN_PROGRESS;
  const isEnded = item.status === SHOWTIME_STATUS.ENDED;

  const badge = SHOWTIME_STATUS_BADGE[item.status];

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm shadow-slate-900/10 text-[12px]">
      {/* TOP */}
      <div className="flex items-start justify-between px-3 pt-2 pb-1">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
            <ClockCircleOutlined className="text-emerald-500 text-[11px]" />
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
            Giờ chiếu
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isCancelled && (
            <Tooltip title={`Lý do huỷ: ${item.cancelDescription}`}>
              <Button
                size="small"
                shape="circle"
                icon={<EyeOutlined />}
                className="border-none bg-slate-100 text-slate-700 hover:bg-slate-200"
              />
            </Tooltip>
          )}
          <Tag
            color={badge.color}
            className="m-0 rounded-full px-2 py-px text-[10px] font-semibold"
          >
            {badge.label}
          </Tag>
        </div>
      </div>

      {/* TIME */}
      <div className="px-3">
        <p className="text-[14px] font-semibold">
          {start.format("HH:mm")}
          <span className="mx-1 text-slate-400">→</span>
          {end.format("HH:mm")}
        </p>
      </div>

      {/* INFO + PRICE GỌN LẠI */}
      <div className="mt-2 px-3 space-y-1.5">
        {/* Phòng + ghế trong 1 box mỏng */}
        <div className="rounded-lg bg-slate-50 px-2.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <EnvironmentOutlined className="text-[13px] text-slate-500" />
              <span className="font-medium truncate">{item?.roomId?.name}</span>
            </div>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Ghế trống:{" "}
            <span className="font-semibold text-slate-700">
              0/{item?.roomId?.capacity}
            </span>
          </div>
        </div>

        {/* Giá vé */}
        <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-orange-500">
              Giá vé
            </p>
            <p className="text-[13px] font-semibold text-orange-600">
              {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/90">
            <TagOutlined className="text-white text-[13px]" />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-2 flex border-t border-slate-100 text-[11px] font-medium">
        {!isEnded && (
          <>
            {isInProgress ? (
              <Tooltip
                title={`Không thể chỉnh sửa suất chiếu khi ${
                  item.status === SHOWTIME_STATUS.ENDED
                    ? "suất chiếu đã kết thúc"
                    : "đang trong thời gian chiếu"
                }`}
              >
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  disabled
                  className="flex-1 flex items-center justify-center gap-1 rounded-none rounded-bl-xl border-none bg-white text-slate-400 hover:bg-slate-50"
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>
            ) : (
              <ModalUpdateShowtime showtime={item}>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  className="flex-1 flex items-center justify-center gap-1 rounded-none rounded-bl-xl border-none bg-white text-slate-700 hover:bg-slate-50"
                >
                  Chỉnh sửa
                </Button>
              </ModalUpdateShowtime>
            )}
          </>
        )}

        <Button
          size="small"
          icon={<TeamOutlined />}
          className={`flex-1 flex items-center justify-center gap-1 rounded-none ${
            isEnded ? "rounded-bl-xl" : ""
          } rounded-br-xl border-none bg-white text-slate-700 hover:bg-slate-50`}
        >
          Ghế
        </Button>
      </div>
    </div>
  );
};

export default ShowtimeCard;
