import { useQuery } from "@tanstack/react-query";
import { Button, Input, Select, Table } from "antd";
import { Link } from "react-router";
import { QUERY } from "../../../common/constants/queryKey";
import { getAllUser } from "../../../common/services/user.service";
import { useTable } from "../../../common/hooks/useTable";
import { columnUser } from "./components/Column";
import { USER_ROLE } from "../../../common/constants/user";
import ModalCreateUser  from "./components/ModalCreateUser";
import FilterUser from "./components/FilterUser";

const ListUser = () => {
  const { query, getSorterProps, onFilter } = useTable();
  const { data } = useQuery({
    queryKey: [QUERY.USER, ...Object.values(query)],
    queryFn: () =>
      getAllUser({
        pagination: true,
        searchFields: ["userName", "email"],
        ...query,
      }),
  });
  const onChangeTable = (_, filters, sorter) => {
    onFilter(filters, sorter);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quản lý người dùng</h3>
        <ModalCreateUser>
          <Button type="primary">Thêm người dùng</Button>
        </ModalCreateUser>
      </div>
      <FilterUser />

      <div className="mt-4">
        <Table
          bordered
          columns={columnUser(getSorterProps)}
          dataSource={data?.data}
          onChange={onChangeTable}
        />
      </div>
    </div>
  );
};

export default ListUser;