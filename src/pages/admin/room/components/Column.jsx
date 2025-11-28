import { EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { Link } from "react-router";
import { updateStatusRoom } from "../../../../common/services/room.service";
import TextWrap from "../../../../components/WrapText";
import { useMessage } from "../../../../common/hooks/useMessage";
import { QUERY } from "../../../../common/constants/queryKey";

export const columnRoom = (getSorterProps) => {
  const { antdMessage, HandleError } = useMessage();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id) => updateStatusRoom(id),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(QUERY.ROOM),
      });
    },
    onError: (err) => HandleError(err),
  });
  return [
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Mã phòng</p>,
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
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Tên phòng</p>,
      dataIndex: "name",
      key: "name",
      width: 150,
      ...getSorterProps("name"),
      render: (name) => <TextWrap text={`${name}`} />,
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Mô tả phòng</p>,
      dataIndex: "description",
      key: "description",
      width: 150,
      render: (description) => (
        <TextWrap text={description || "Chưa cập nhật"} />
      ),
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Số lượng ghế</p>,
      dataIndex: "capacity",
      key: "capacity",
      width: 150,
      render: (capacity) => (
        <>
          <p className="uppercase mb-0!">{capacity}</p>
        </>
      ),
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Trạng thái</p>,
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag color={status ? "blue" : "red"}>
          {status ? "Hoạt động" : "Đang khoá"}
        </Tag>
      ),
    },
    {
      title: <p style={{ whiteSpace: "nowrap" }}>Thao tác</p>,
      key: "action",
      width: 80,
      render: (_, record) => (
        <Space style={{ display: "flex", gap: 12 }}>
          <Space>
            <Tooltip title="Cập nhật">
              <Link className="mx-1" to={`/admin/rooms/update/${record._id}`}>
                <EditOutlined style={{ color: "blue" }} />
              </Link>
            </Tooltip>

            {record.status ? (
              <Popconfirm
                placement="bottomLeft"
                title="Bạn chắc chắn muốn khóa?"
                onConfirm={() => mutate(record._id)}
              >
                <Button
                  loading={isPending}
                  disabled={isPending}
                  type="text"
                  danger
                  icon={<LockOutlined />}
                  size="small"
                />
              </Popconfirm>
            ) : (
              <Button
                onClick={() => mutate(record._id)}
                type="text"
                icon={<UnlockOutlined />}
                size="small"
              />
            )}
          </Space>
        </Space>
      ),
    },
  ];
};
