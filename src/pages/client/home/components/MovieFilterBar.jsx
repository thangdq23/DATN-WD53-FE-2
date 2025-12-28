import React, { useEffect, useState } from "react";
import { Row, Col, Input, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useTable } from "../../../../common/hooks/useTable";
import { getAllGenre } from "../../../../common/services/genre.service";

const { Search } = Input;
const { Option } = Select;

const MovieFilterBar = ({ status }) => {
  const [searchValue, setSearchValue] = useState("");
  const [genre, setGenre] = useState(null);
  const [age, setAge] = useState(null);
  const [isHot, setIsHot] = useState(null);

  const { query, onFilter } = useTable();

  // ✅ Load thể loại từ admin (API)
  const { data: genreData } = useQuery({
    queryKey: ["genreIds"],
    queryFn: getAllGenre,
  });

  useEffect(() => {
    setSearchValue(query.search || "");
  }, [query.search]);

  useEffect(() => {
    onFilter({ search: null, genre: null, age: null, hot: null });
    setGenre(null);
    setAge(null);
    setIsHot(null);
  }, [status]);

  const handleSearch = (value) => {
    setSearchValue(value);
    onFilter({ search: value });
  };

  const handleGenreChange = (value) => {
    setGenre(value);
    onFilter({ genre: value });
  };

  const handleAgeChange = (value) => {
    setAge(value);
    onFilter({ age: value });
  };

  const handleHotChange = (value) => {
    setIsHot(value);
    onFilter({ hot: value });
  };

  const genres = genreData?.data || [];

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
      {/* Search */}
      <Col xs={24} sm={12} md={8}>
        <Search
          placeholder="Tìm tên phim..."
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
        />
      </Col>

      {/* Thể loại (từ API Admin) */}
      <Col xs={12} sm={6} md={4}>
        <Select
          placeholder="Thể loại"
          allowClear
          value={genre}
          onChange={handleGenreChange}
          style={{ width: "100%" }}
        >
          {genres.map((g) => (
            <Option key={g._id} value={g._id}>
              {g.name}
            </Option>
          ))}
        </Select>
      </Col>

      {/* Độ tuổi */}
      <Col xs={12} sm={6} md={4}>
        <Select
          placeholder="Độ tuổi"
          allowClear
          value={age}
          onChange={handleAgeChange}
          style={{ width: "100%" }}
        >
          <Option value="P">P</Option>
          <Option value="C13">C13+</Option>
          <Option value="C16">C16+</Option>
          <Option value="C18">C18+</Option>
        </Select>
      </Col>

      {/* Phim hot */}
      <Col xs={12} sm={6} md={4}>
        <Select
          placeholder="Phim hot"
          allowClear
          value={isHot}
          onChange={handleHotChange}
          style={{ width: "100%" }}
        >
          <Option value={true}>Phim hot</Option>
          <Option value={false}>Bình thường</Option>
        </Select>
      </Col>
    </Row>
  );
};

export default MovieFilterBar;
