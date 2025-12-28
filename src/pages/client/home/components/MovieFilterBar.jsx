import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Input, Select } from "antd";
import { useTable } from "../../../../common/hooks/useTable";

const { Search } = Input;

const MovieFilterBar = ({ status, movies = [] }) => {
  const [searchValue, setSearchValue] = useState("");
  const [genre, setGenre] = useState(undefined);
  const [age, setAge] = useState(undefined);

  const { query, onFilter } = useTable();

  // ✅ Derive thể loại từ movies.genreIds (client-side, không gọi API genre)
  const genreOptions = useMemo(() => {
    const map = new Map();

    movies.forEach((m) => {
      if (Array.isArray(m?.genreIds)) {
        m.genreIds.forEach((g) => {
          if (g?._id && g?.name) {
            map.set(String(g._id), g.name);
          }
        });
      }
    });

    return Array.from(map.entries())
      .map(([id, name]) => ({ value: id, label: name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [movies]);

  // Sync input Reidirect theo query
  useEffect(() => {
    setSearchValue(query.search || "");
  }, [query.search]);

  // Reset filter khi đổi tab status
  useEffect(() => {
    onFilter({ search: null, genre: null, age: null });
    setSearchValue("");
    setGenre(undefined);
    setAge(undefined);
  }, [status]);

  const handleSearch = (value) => {
    setSearchValue(value);
    onFilter({ search: value || null });
  };

  const handleGenreChange = (value) => {
    setGenre(value);
    onFilter({ genre: value || null });
  };

  const handleAgeChange = (value) => {
    setAge(value);
    onFilter({ age: value || null });
  };

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

      {/* Thể loại (derive từ movies) */}
      <Col xs={12} sm={6} md={4}>
        <Select
          placeholder="Thể loại"
          allowClear
          value={genre}
          onChange={handleGenreChange}
          style={{ width: "100%" }}
          options={genreOptions}
        />
      </Col>

      {/* Độ tuổi (value theo backend: P/C13/C16/C18) */}
      <Col xs={12} sm={6} md={4}>
        <Select
          placeholder="Độ tuổi"
          allowClear
          value={age}
          onChange={handleAgeChange}
          style={{ width: "100%" }}
          options={[
            { value: "P", label: "P" },
            { value: "C13", label: "C13+" },
            { value: "C16", label: "C16+" },
            { value: "C18", label: "C18+" },
          ]}
        />
      </Col>
    </Row>
  );
};

export default MovieFilterBar;
