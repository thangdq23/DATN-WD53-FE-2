import { Table, Input, Select, Button, Tag, Tooltip } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { QUERY } from "../../../common/constants/queryKey";
import { useTable } from "../../../common/hooks/useTable";
import { getMovieHasShowtime } from "../../../common/services/showtime.service";
import { statusRelease } from "../../../common/constants";
import { getAgeBadge } from "../../../common/utils/age";
import TextWrap from "../../../components/WrapText";

const ListShowtime = () => {
  const { query, onFilter } = useTable("movie");
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: [QUERY.SHOWTIME, ...Object.values(query)],
    queryFn: () =>
      getMovieHasShowtime({
        limit: 100,
        ...query,
      }),
  });

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      width: 100,
      render: (poster) => (
        <img
          src={poster}
          alt="poster"
          className="w-[60px] h-[85px] object-cover rounded"
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "name",
      width: 250,
      render: (text) => <TextWrap text={text} style={{ fontWeight: 600 }} />,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      width: 120,
      render: (d) => <span>{d} phút</span>,
    },
    {
      title: "Suất chiếu",
      dataIndex: "showtimeCount",
      width: 110,
      render: (count) => <span className="font-medium">{count}</span>,
    },
    {
      title: "Độ tuổi",
      dataIndex: "ageRequire",
      width: 120,
      render: (_, record) => {
        const age = record.ageRequire || record.age || record.ageRestriction;
        const { color, label, description } = getAgeBadge(age);
        return (
          <Tooltip title={description}>
            <Tag color={color}>{label}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "statusRelease",
      width: 130,
      render: (_, record) => {
        const now = dayjs();
        const releaseDate = dayjs(record.releaseDate);
        const endDate = dayjs(record.endDate);
        
        let status = "nowShowing";
        if (now.isBefore(releaseDate)) {
          status = "upcoming";
        } else if (now.isAfter(endDate)) {
          status = "released";
        }

        const statusInfo = statusRelease[status] || statusRelease.released;
        
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.label}
          </Tag>
        );
      },
    },
  ];

  const dataSource =
    data?.data?.map((item) => ({
      key: item._id,
      ...item,
    })) || [];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quản lý lịch chiếu</h3>

        <Link to={"/admin/showtimes/create"}>
          <Button type="primary">Thêm suất chiếu</Button>
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <Input.Search
          allowClear
          placeholder="Tìm kiếm phim"
          className="w-[260px]"
          onChange={(e) => {
            if (!e.target.value) onFilter({ search: null });
          }}
          onSearch={(e) => onFilter({ search: [e] })}
        />

        <Select
          allowClear
          placeholder="Trạng thái"
          className="w-[180px]"
          onChange={(e) => onFilter({ statusRelease: [e] })}
          options={[
            ...Object.entries(statusRelease).map(([key, value]) => ({
              value: key,
              label: value.label,
            })),
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        rowClassName={(record) =>
          record._id === movieId ? "bg-blue-50" : "cursor-pointer"
        }
        onRow={(record) => ({
          onClick: () => {
            navigate(
              `/admin/showtimes/movie/${
                record._id
              }?showtime_startTimeFrom=${dayjs().startOf("day").toISOString()}`,
            );
          },
        })}
        scroll={{ y: "60vh" }}
        className="rounded-lg shadow border"
      />
    </div>
  );
};

export default ListShowtime;
