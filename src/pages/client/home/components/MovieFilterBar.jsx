import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select, Button } from "antd";
import { useTable } from "../../../../common/hooks/useTable";
const { Search } = Input;
const { Option } = Select;

const MovieFilterBar = ({ status }) => {
  const [searchValue, setSearchValue] = useState(null);
  const { query, onFilter } = useTable();
  useEffect(() => {
    setSearchValue(query.search);
  }, [query.search]);
  useEffect(() => {
    onFilter({ search: null });
  }, [status]);
  return <Row gutter={[12, 12]} style={{ marginBottom: 12 }}></Row>;
};

export default MovieFilterBar;
