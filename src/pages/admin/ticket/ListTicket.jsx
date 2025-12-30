import { QrcodeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { QUERYKEY } from "../../../common/constants/queryKey";
import { useTableHook } from "../../../common/hooks/useTableHook";
import { getAllTicket } from "../../../common/services/ticket.service";
import FilterTicket from "./components/FilterTicket";
import { columnTicket } from "./components/Column";

const ListTicket = () => {
  const { query } = useTableHook();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.TICKET, query], // ✅ FIX Ở ĐÂY
    queryFn: () =>
      getAllTicket({
        pagination: true,
        searchFields: ["ticketId"],
        ...query,
      }),
  });

  return (
    <div className="bg-[#121822] w-full min-h-[87vh] rounded-md shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base">Quản lý vé</h3>
        <Link to={"/admin/ticket/qr"}>
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
