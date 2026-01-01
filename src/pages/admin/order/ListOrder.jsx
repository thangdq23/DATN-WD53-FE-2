import { useQuery } from "@tanstack/react-query";
import { QUERYKEY } from "../../../common/constants/queryKey";
import { getAllOrder } from "../../../common/services/order.service";
import { useTable } from "../../../common/hooks/useTable";
import { Button, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";
import { EyeOutlined } from "@ant-design/icons";
import { ORDER_STATUS } from "../../../common/constants/order";
import FilterOrder from "./components/FilterOrder";
const { Title, Text } = Typography;

const ListOrder = () => {
  const { query } = useTable();
  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.ORDER, query],
    queryFn: () =>
      getAllOrder({
        ...query,
        searchFields: [
          "customerInfo.userName",
          "customerInfo.phone",
          "customerInfo.email",
          "movieName",
          "ticketId",
        ],
      }),
  });
  const columns = [
    {
      title: "Mã vé",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (ticketId) => <Text strong>{ticketId}</Text>,
    },
    {
      title: "Phim",
      dataIndex: "movieName",
      key: "movieName",
    },
    {
      title: "Khách hàng",
      render: (_, record) => (
        <div>
          <div>{record.customerInfo.userName}</div>
          <Text type="secondary">{record.customerInfo.phone}</Text>
        </div>
      ),
    },
    {
      title: "Suất chiếu",
      render: (_, record) => (
        <div>
          <div>{dayjs(record.startTime).format("HH:mm - DD/MM/YYYY")}</div>
          <Text type="secondary">{record.roomName}</Text>
        </div>
      ),
    },
    {
      title: "Ghế ngồi",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => seats.map((item) => item.label).join(","),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totelAmount",
      render: (amout) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amout),
      align: "right",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={ORDER_STATUS[status]?.color}>
          {ORDER_STATUS[status]?.label}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/ticket/${record._id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <FilterOrder />
      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          loading={isLoading}
          rowKey="_id"
          bordered
        />
      </div>
    </div>
  );
};
export default ListOrder;
