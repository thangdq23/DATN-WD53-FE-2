import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useTable } from "../../../../common/hooks/useTable";

const FilterMovie = () => {
  const { query, onFilter, onChangeSearchInput } = useTable();
  const [search, setSearch] = useState("");
  const [statusRelease, setStatus] = useState("");
  const handleChangeStatusRelease = (value) => {
    switch (value) {
      case "released":
        onFilter({
          releaseDateTo: [dayjs().format("YYYY-MM-DD")],
          releaseDateFrom: null,
        });
        setStatus(value);
        break;
      case "upcoming":
        onFilter({
          releaseDateFrom: [dayjs().format("YYYY-MM-DD")],
          releaseDateTo: null,
        });
        setStatus(value);
        break;
      default:
        onFilter({
          releaseDateTo: null,
          releaseDateFrom: null,
        });
        setStatus("");
        break;
    }
  };
  useEffect(() => {
    if (query.search) {
      setSearch(query.search);
    }
  }, []);
  useEffect(() => {
    if (query.releaseDateFrom) {
      setStatus("upcoming");
    }
    if (query.releaseDateTo) {
      setStatus("released");
    }
  }, [query.releaseDateFrom, query.releaseDateTo, setStatus]);
  return (
    <div className="mt-4 flex items-center gap-3">
      <Input
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          onChangeSearchInput(value, { enableOnChangeSearch: true });
        }}
        placeholder="Tìm kiếm phim"
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
      <Select
        style={{ height: 35, minWidth: 200 }}
        value={statusRelease || ""}
        onChange={(e) => handleChangeStatusRelease(e)}
        allowClear
        placeholder="Lọc trạng thái"
        options={[
          { value: "", label: "Tất cả trạng thái phim" },
          { value: "released", label: "Phim đã chiếu" },
          { value: "upcoming", label: "Phim chưa chiếu" },
        ]}
      />
      <Select
        style={{ height: 35, minWidth: 150 }}
        value={query.isHot || ""}
        onChange={(e) => onFilter({ isHot: e })}
        allowClear
        placeholder="Lọc phim nổi bật"
        options={[
          { value: "", label: "Tất cả phim" },
          { value: "true", label: "Phim nổi bật" },
          { value: "false", label: "Phim thường" },
        ]}
      />
    </div>
  );
};

export default FilterMovie;