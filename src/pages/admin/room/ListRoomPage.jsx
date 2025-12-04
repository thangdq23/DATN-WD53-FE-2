import { Button, Pagination, Table } from "antd";
import { columnRoom } from "./components/Column";
import { useTable } from "../../../common/hooks/useTable";
import { useQuery } from "@tanstack/react-query";
import { QUERY } from "../../../common/constants/queryKey";
import { getAllRoom } from "../../../common/services/room.service";
import { Link } from "react-router";
import { FileAddOutlined } from "@ant-design/icons";
import FilterRoom from "./components/FilterRoom";

const ListRoomPage = () => {
  const { query, getSorterProps, onSelectPaginateChange } = useTable();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY.ROOM, ...Object.values(query)],
    queryFn: () => getAllRoom({ searchFields: ['name'] ,pagination: true, ...query }),
  });
  return (
    <div>
      <h3 className="text-lg font-semibold">Danh sách phòng chiếu</h3>
      <div className="flex items-center justify-between">
        <FilterRoom />
        <Link to={"/admin/rooms/create"}>
          <Button
            style={{ height: 35 }}
            type="primary"
            icon={<FileAddOutlined />}
          >
            Thêm phòng chiếu
          </Button>
        </Link>
      </div>
      <div className="mt-4">
        <Table
          scroll={{
            x: "horizontal",
          }}
          bordered
          columns={columnRoom(getSorterProps)}
          pagination={false}
          loading={isLoading}
          dataSource={data?.data || []}
        />
        {!isLoading && data?.data?.length > 0 && (
          <Pagination
            total={data?.meta?.total}
            current={data?.meta?.page}
            pageSize={data?.meta?.limit}
            onChange={onSelectPaginateChange}
            align="end"
            className="mt-6!"
          />
        )}
      </div>
    </div>
  );
};

export default ListRoomPage;