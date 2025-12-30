import { QrcodeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { QUERYKEY } from "../../../common/constants/queryKey";
import { useTable } from "../../../common/hooks/useTable";
import { getAllOrder } from "../../../common/services/order.service";
import FilterTicket from "./components/FilterTicket";
import { columnTicket } from "./components/Column";

const ListTicket = () => {
  const { query } = useTable();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.ORDER, query],
    queryFn: () =>
      getAllOrder({
        pagination: true,
        searchFields: ["ticketId"],
        ...query,
      }),
  });

  return (
    <div className="bg-[#121822] w-full min-h-[87vh] rounded-md shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base">Quản lý vé</h3>
        <Link to="/admin/ticket/qr">
          <Button type="primary" icon={<QrcodeOutlined />}>
            Quét vé
          </Button>
        </Link>
      </div>

      <FilterTicket />

      <div className="mt-4">
        <Table
          loading={isLoading}
          columns={columnTicket()}
          dataSource={data?.data}
          rowKey="_id"
        />
      </div>
    </div>
  );
};

export default ListTicket;
