import {
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, Image, Popconfirm, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom"; // ✔ Sửa đúng import
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessage } from "../../../../common/hooks/useMessage";
import { updateStatusMovie } from "../../../../common/services/movie.service";
import { QUERY } from "../../../../common/constants/queryKey";
import TextWrap from "../../../../components/WrapText";
import { statusRelease } from "../../../../common/constants";
import { getAgeBadge } from "../../../../common/utils/age";

export const columnMovie = (getSorterProps) => {
  const queryClient = useQueryClient();
  const { antdMessage, HandleError } = useMessage();

  const { mutate } = useMutation({
    mutationFn: (id) => updateStatusMovie(id),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(QUERY.MOVIE),
      });
    },
    onError: (err) => {
      HandleError(err);
    },
  });

  return [
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Mã phim</p>,
      dataIndex: "_id",
      key: "_id",
      width: 30,
      ...getSorterProps("_id"),
      render: (id, record) => (
        <>
          <p className="uppercase mb-0!">{id.slice(-8)}</p>
          {record.isHot && <Tag color="red">Phim nổi bật</Tag>}
        </>
      ),
    },

    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Poster</p>,
      dataIndex: "poster",
      key: "poster",
      width: 30,
      render: (poster) => (
        <div className="flex items-center justify-center h-16">
          <Image src={poster} className="w-12!" alt="" />
        </div>
      ),
    },

    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Tên phim</p>,
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (name, record) => (
        <div>
          <TextWrap text={`${name}`} />
          <div className="flex items-center">
            <Tag className="mt-1!" color="blue">
              Thời gian: {record.duration} Phút
            </Tag>
          </div>
        </div>
      ),
    },

    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Thể loại</p>,
      dataIndex: "genreIds",
      key: "genreIds",
      width: 130,
      render: (category) => (
        <TextWrap
          text={
            category?.map((item) => item.name).join(", ") || "Chưa cập nhật"
          }
        />
      ),
    },

    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Ngôn ngữ</p>,
      dataIndex: "language",
      key: "language",
      width: 100,
      render: (language, record) => {
        return (
          <>
            <p className="mb-0!">{language}</p>
            {record.subTitleLanguage && (
              <TextWrap
                text={`Phụ đề ${record.subTitleLanguage}`}
              ></TextWrap>
            )}
          </>
        );
      },
    },

    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Độ tuổi</p>,
      dataIndex: "ageRestriction",
      key: "ageRestriction",
      width: 30,
      render: (age) => {
        return (
          <div className="flex justify-center">
            <Tooltip title="Giới hạn độ tuổi">
              <Tag>{age}</Tag>
            </Tooltip>
          </div>
        );
      },
    },

    {
      title: (
        <p style={{ whiteSpace: "nowrap", margin: 0 }}>
          Ngày công chiếu - Ngày kết thúc
        </p>
      ),
      dataIndex: "releaseDate",
      key: "releaseDate",
      width: 100,
      ...getSorterProps("releaseDate"),
      render: (releaseDate, record) => {
        return (
          <div>
            <div className="flex items-center gap-2">
              <TextWrap text={dayjs(releaseDate).format("YYYY-MM-DD")} />
              -
              <TextWrap text={dayjs(record.endDate).format("YYYY-MM-DD")} />
            </div>
            <Tag
              color={statusRelease[record.statusRelease].color}
              className="mt-1!"
            >
              {statusRelease[record.statusRelease].label}
            </Tag>
          </div>
        );
      },
    },

    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Trạng thái</p>,
      dataIndex: "status",
      key: "status",
      width: 70,
      render: (status) => (
        <Tag color={status ? "blue" : "red"}>
          {status ? "Hoạt động" : "Đang khoá"}
        </Tag>
      ),
    },

    // ⭐ THAO TÁC
    {
      title: <p style={{ whiteSpace: "nowrap" }}>Thao tác</p>,
      key: "action",
      width: 80,
      render: (_, record) => (
        <Space style={{ display: "flex", gap: 12 }}>
          {/* ------------------ Xem chi tiết ------------------ */}
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/movies/${record._id}`}>
              <EyeOutlined style={{ cursor: "pointer", fontSize: 18 }} />
            </Link>
          </Tooltip>

          <Space>
            {/* ------------------ Cập nhật ------------------ */}
            <Tooltip title="Cập nhật">
              <Link
                className="mx-1"
                to={`/admin/movies/update/${record._id}`}
              >
                <EditOutlined style={{ color: "blue" }} />
              </Link>
            </Tooltip>

            {/* ------------------ Khoá / mở khoá ------------------ */}
            {record.status ? (
              <Popconfirm
                placement="bottomLeft"
                title="Bạn chắc chắn muốn khóa?"
                onConfirm={() => mutate(record._id)}
              >
                <Button
                  type="text"
                  danger
                  icon={<LockOutlined />}
                  size="small"
                />
              </Popconfirm>
            ) : (
              <Button
                type="text"
                icon={<UnlockOutlined />}
                onClick={() => mutate(record._id)}
                size="small"
              />
            )}
          </Space>
        </Space>
      ),
    },
  ];
};
