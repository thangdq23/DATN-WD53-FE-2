import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useTable } from "../../../../common/hooks/useTable";

const FilterRoom = () => {
  const { query, onFilter, onChangeSearchInput } = useTable();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (query.search) {
      setSearch(query.search);
    }
  }, [query.search]);

  return (
    <div className="mt-4 flex items-center gap-3">
      <Input
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          onChangeSearchInput(value, { enableOnChangeSearch: true });
        }}
        placeholder="Tìm kiếm phòng chiếu"
        style={{ height: 35, width: 300 }}
      />
      <Select
        style={{ height: 35, minWidth: 150 }}
        value={query.status || ""}
        onChange={(e) => onFilter({ status: [e] })}
        allowClear
        placeholder="Lọc trạng thái"
        options={[
          { value: "", label: "Tất cả trạng thái" },
          { value: "true", label: "Hoạt động" },
          { value: "false", label: "Đang khóa" },
        ]}
      />
    </div>
  );
};

export default FilterRoom;