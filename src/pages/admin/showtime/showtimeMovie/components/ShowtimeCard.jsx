import {
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  TeamOutlined,
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
  const values = item.price.map((p) => p.value);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values);

  return (
    <div
      key={item._id}
      className="p-4 border border-gray-500/50 bg-gray-300/5 shadow-md rounded-md"
    >
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">
          {dayjs(item.startTime).format("HH:mm")} -{" "}
          {dayjs(item.startTime)
            .add(item.movieId.duration, "minutes")
            .format("HH:mm")}
        </p>
        {item.status === SHOWTIME_STATUS.CANCELLED ? (
          <div>
            <Tooltip title={`Lý do huỷ: ${item.cancelDescription}`}>
              <Tag className="cursor-pointer!">
                <EyeOutlined />
              </Tag>
            </Tooltip>
            <Tag color={SHOWTIME_STATUS_BADGE[item.status].color}>
              {SHOWTIME_STATUS_BADGE[item.status].label}
            </Tag>
          </div>
        ) : (
          <Tag color={SHOWTIME_STATUS_BADGE[item.status].color}>
            {SHOWTIME_STATUS_BADGE[item.status].label}
          </Tag>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-gray-300/50">
          <EnvironmentOutlined /> {item.roomId.name}
        </p>
        <Tag color="#666666">0/{item.roomId.capacity}</Tag>
      </div>

      <div className="mt-2">
        <p className="text-green-500">
          {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {item.status !== SHOWTIME_STATUS.ENDED && (
          <>
            {item.status === SHOWTIME_STATUS.IN_PROGRESS &&
            item.status !== SHOWTIME_STATUS.ENDED ? (
              <Tooltip
                title={`Không thể chỉnh sửa suất chiếu khi ${
                  item.status === SHOWTIME_STATUS.ENDED
                    ? "suất chiếu đã kết thúc"
                    : "đang trong thời gian chiếu"
                }`}
              >
                <Button className="flex-1" icon={<EditOutlined />} disabled>
                  Chỉnh sửa
                </Button>
              </Tooltip>
            ) : (
              <ModalUpdateShowtime showtime={item}>
                <Button className="flex-1" icon={<EditOutlined />}>
                  Chỉnh sửa
                </Button>
              </ModalUpdateShowtime>
            )}
          </>
        )}
        <Button className="flex-1" icon={<TeamOutlined />}>
          Ghế
        </Button>
      </div>
    </div>
  );
};

export default ShowtimeCard;
