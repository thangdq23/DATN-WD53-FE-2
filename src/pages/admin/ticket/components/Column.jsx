import { EyeOutlined } from "@ant-design/icons";
import { Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { ORDER_STATUS } from "../../../../common/constants/order";
import { formatCurrency } from "../../../../common/utils";

export const columnTicket = () => [
  {
    title: "Mã vé",
    dataIndex: "ticketId",
    key: "ticketId",
    width: 120,
    render: (id) => <Tag className="font-mono">{id}</Tag>,
  },
  {
    title: "Khách hàng",
    dataIndex: ["customerInfo", "userName"],
    key: "customer",
    width: 160,
    render: (name, record) => (
      <div>
        <div>{name}</div>
        <div className="text-xs text-gray-500">
          {record.customerInfo?.phone}
        </div>
      </div>
    ),
  },
  {
    title: "Phim",
    dataIndex: "movieName",
    key: "movieName",
    width: 160,
    render: (name) => name,
  },
  {
    title: "Ghế",
    dataIndex: "items",
    key: "items",
    width: 120,
    render: (items, record) => (
      <div>
        <Tag color="blue">
          {items?.map((i) => i.seatLabel).join(", ")}
        </Tag>
        <div className="text-xs text-gray-500">{record.roomName}</div>
      </div>
    ),
  },
  {
    title: "Suất chiếu",
    dataIndex: "startTime",
    key: "startTime",
    width: 140,
    render: (time) => (
      <div>
        <div style={{ color: "orange" }}>
          {dayjs(time).format("HH:mm")}
        </div>
        <div>{dayjs(time).format("YYYY/MM/DD")}</div>
      </div>
    ),
  },
  {
    title: "Ngày mua",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 140,
    render: (time) => (
      <div>
        <div>{dayjs(time).format("HH:mm")}</div>
        <div>{dayjs(time).format("YYYY/MM/DD")}</div>
      </div>
    ),
  },
  {
    title: "Thanh toán",
    dataIndex: "isPaid",
    key: "isPaid",
    width: 120,
    render: (paid, record) => (
      <div>
        <div>{formatCurrency(record.totalAmount || 0)}</div>
        <Tag color={paid ? "green" : "red"}>
          {paid ? "Đã TT" : "Chưa TT"}
        </Tag>
      </div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status) => {
      const st = ORDER_STATUS[status];
      if (!st) return "-";
      return <Tag color={st.color}>{st.label}</Tag>;
    },
  },
  {
    title: "",
    key: "action",
    width: 60,
    render: () => (
      <Space>
        <Tooltip title="Xem chi tiết (sắp làm)">
          <EyeOutlined style={{ color: "#999" }} />
        </Tooltip>
      </Space>
    ),
  },
];
