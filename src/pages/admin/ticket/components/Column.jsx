import { EyeOutlined } from "@ant-design/icons";
import { Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import {
  TICKET_STATUS,
  TICKET_STATUS_COLOR,
} from "../../../../common/constants/ticket";
import { formatCurrency } from "../../../../common/utils";
import TextNowWrap from "../../../../components/TextNowWrap";
import ModalDetailTicket from "./ModalDetailTicket";

export const columnTicket = () => [
  {
    title: "Mã vé",
    dataIndex: "ticketId",
    key: "ticketId",
    width: 120,
    render: (id) => (
      <Tag className="font-mono">
        <TextNowWrap text={id} />
      </Tag>
    ),
  },
  {
    title: "Khách hàng",
    dataIndex: ["customerInfo", "userName"],
    key: "customer",
    width: 160,
    render: (name, record) => (
      <div>
        <TextNowWrap text={name} />
        <div className="text-xs text-gray-500">
          <TextNowWrap text={record?.customerInfo?.phone} />
        </div>
      </div>
    ),
  },
  {
    title: "Phim",
    dataIndex: "movieName",
    key: "movieName",
    width: 160,
    render: (name) => <TextNowWrap text={name} />,
  },
  {
    title: "Ghế",
    dataIndex: "items",
    key: "items",
    width: 110,
    render: (items = [], record) => (
      <div>
        <Tag color="blue">
          <TextNowWrap
            text={items.map((i) => i.seatLabel).join(", ")}
          />
        </Tag>
        <TextNowWrap text={record?.roomName} />
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
        <TextNowWrap
          text={dayjs(time).format("HH:mm")}
          style={{ color: "orange" }}
        />
        <TextNowWrap text={dayjs(time).format("YYYY/MM/DD")} />
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
        <TextNowWrap text={dayjs(time).format("HH:mm")} />
        <TextNowWrap text={dayjs(time).format("YYYY/MM/DD")} />
      </div>
    ),
  },
  {
    title: "Thanh toán",
    dataIndex: "isPaid",
    key: "isPaid",
    width: 100,
    render: (paid, record) => (
      <div>
        <p>{formatCurrency(record?.totalPrice)}</p>
        <Tag color={paid ? "green" : "red"}>
          <TextNowWrap text={paid ? "Đã TT" : "Chưa TT"} />
        </Tag>
      </div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 110,
    render: (status) => (
      <Tag color={TICKET_STATUS_COLOR[status]}>
        <TextNowWrap text={TICKET_STATUS[status]} />
      </Tag>
    ),
  },
  {
    title: "",
    key: "action",
    width: 60,
    render: (_, record) => (
      <Space>
        <ModalDetailTicket ticket={record}>
          <Tooltip title="Xem chi tiết">
            <EyeOutlined />
          </Tooltip>
        </ModalDetailTicket>
      </Space>
    ),
  },
];
