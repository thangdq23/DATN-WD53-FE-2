import { Input, Select } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useTable } from "../../../../common/hooks/useTable";
import { debounce } from 'lodash';

const FilterRoom = () => {
  const { query, onFilter, onChangeSearchInput } = useTable();
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    setSearch(query.search || "");
  }, [query.search]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      onChangeSearchInput(value, { 
        enableOnChangeSearch: true,
        prefix: ''
      });
    }, 500),
    [onChangeSearchInput]
  );
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === '' || value.length > 2) {
      debouncedSearch(value);
    }
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <Input.Search
        value={search}
        onChange={handleSearchChange}
        onSearch={(e)=> onFilter({search: [e]})}
        placeholder="Tìm kiếm phòng chiếu..."
        style={{ height: 35, width: 300 }}
        allowClear
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