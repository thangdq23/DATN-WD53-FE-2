import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Input, Typography, Select } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import GenreForm from "./GenreForm";
import { useMessage } from "../../../common/hooks/useMessage";

const { Title } = Typography;

const GenrePage = () => {
  const { antdMessage, HandleError } = useMessage();

  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/genre");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setGenres(data);
      setFilteredGenres(data);
    } catch (error) {
      HandleError(error, { fallback: "Lỗi khi tải danh sách thể loại!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSearch = (value = searchText, status = statusFilter) => {
    setSearchText(value);
    setStatusFilter(status);

    let filtered = [...genres];

    if (value) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      );
    }

    if (status !== "all") {
      const isActive = status === "active";
      filtered = filtered.filter((item) => item.status === isActive);
    }

    setFilteredGenres(filtered);
  };

  const toggleStatus = async (genre) => {
    try {
      await axios.patch(`http://localhost:8000/api/genre/status/${genre._id}`, {
        status: !genre.status,
      });
      antdMessage.success("Cập nhật trạng thái thành công!");
      fetchGenres();
    } catch (error) {
      HandleError(error, { fallback: "Cập nhật trạng thái thất bại!" });
    }
  };

  const columns = [
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status ? "green" : "red", fontWeight: 500 }}>
          {status ? "Hoạt động" : "Đang khóa"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingGenre(record);
              setOpenModal(true);
            }}
          />
          <Button
            size="small"
            danger={record.status}
            icon={record.status ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => toggleStatus(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Quản lý thể loại phim</Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Tìm kiếm theo tên thể loại..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value, statusFilter)}
          allowClear
          style={{ width: 300 }}
        />

        <Select
          value={statusFilter}
          onChange={(value) => handleSearch(searchText, value)}
          style={{ width: 180 }}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "active", label: "Hoạt động" },
            { value: "inactive", label: "Đang khóa" },
          ]}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingGenre(null);
            setOpenModal(true);
          }}
        >
          Thêm thể loại mới
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredGenres}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />

      <Modal
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        title={editingGenre ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
        destroyOnClose
      >
        <GenreForm
          genre={editingGenre}
          onClose={() => setOpenModal(false)}
          refresh={fetchGenres}
          antdMessage={antdMessage}
          HandleError={HandleError}
        />
      </Modal>
    </div>
  );
};

export default GenrePage;
