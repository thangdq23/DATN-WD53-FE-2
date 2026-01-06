import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  EyeOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router";

import { QUERYKEY } from "../../../common/constants/queryKey";
import { getAllOrder } from "../../../common/services/order.service";
import { useTable } from "../../../common/hooks/useTable";
import { ORDER_STATUS } from "../../../common/constants/order";
import FilterOrder from "./components/FilterOrder";

const { Text } = Typography;

const ListOrder = () => {
  const { query } = useTable();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.ORDER, query],
    queryFn: () => getAllOrder(query),
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
      render: (v) => v || "-",
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <div>
          <div>{record?.customerInfo?.userName || "-"}</div>
          <Text type="secondary">
            {record?.customerInfo?.phone || ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Suất chiếu",
      key: "showtime",
      render: (_, record) => (
        <div>
          <div>
            {record?.startTime
              ? dayjs(record.startTime).format("HH:mm - DD/MM/YYYY")
              : "-"}
          </div>
          <Text type="secondary">
            {record?.roomName || "-"}
          </Text>
        </div>
      ),
    },
    {
      title: "Ghế ngồi",
      dataIndex: "seats",
      key: "seats",
      render: (seats) =>
        Array.isArray(seats)
          ? seats.map((s) => s.label).join(", ")
          : "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={ORDER_STATUS?.[status]?.color}>
          {ORDER_STATUS?.[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          
          <Link to={`/admin/ticket/detail/${record._id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Danh sách vé
        </h2>

        
        <Link to="/admin/ticket/qr">
          <Button
            type="primary"
            icon={<QrcodeOutlined />}
          >
            Quét QR
          </Button>
        </Link>
      </div>

      
      <FilterOrder />

    
      <div className="mt-4">
        <Table
          bordered
          loading={isLoading}
          columns={columns}
          dataSource={data?.data || []}
          rowKey={(r) => r?._id || r?.id}
          pagination={false} 
        />
      </div>
    </div>
  );
};

export default ListOrder;
