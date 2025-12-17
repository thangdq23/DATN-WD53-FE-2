import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { USER_ROLE } from "../../../../common/constants/user";
import TextWrap from "../../../../components/WrapText";
import { Link } from "react-router";
import {
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import ModalUpdateUser from "./ModalUpdateUser";
import { useAuthSelector } from "../../../../store/useAuthStore";
import ModalDetailUser from "./ModalDetailUser";

export const columnUser = (getSorterProps) => {
  const userId = useAuthSelector((state) => state.user._id);
  return [
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Mã</p>,
      dataIndex: "_id",
      key: "_id",
      width: 30,
      ...getSorterProps("_id"),
      render: (id) => (
        <>
          <p className="uppercase mb-0!">{id.slice(-8)}</p>
        </>
      ),
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Họ và tên</p>,
      dataIndex: "userName",
      key: "userName",
      width: 150,
      ...getSorterProps("userName"),
      render: (name) => (
        <div>
          <TextWrap text={`${name}`} />
        </div>
      ),
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Email</p>,
      dataIndex: "email",
      key: "email",
      width: 150,
      ...getSorterProps("email"),
      render: (email) => <TextWrap text={email} />,
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Số điện thoại</p>,
      dataIndex: "phone",
      key: "phone",
      width: 30,
      render: (phone) => {
        return <TextWrap text={phone} />;
      },
    },
    {
      title: <p style={{ whiteSpace: "nowrap", margin: 0 }}>Vai trò</p>,
      dataIndex: "role",
      key: "role",
      width: 70,
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "red"}>{USER_ROLE[role]}</Tag>
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
        <ModalDetailUser user={record}>
          <Tooltip title="Xem chi tiết">
            <EyeOutlined style={{cursor: "pointer", fontSize: 18}} />
          </Tooltip>
        </ModalDetailUser>

         {/* ----------cập nhật---- */}
         {record._id !==userId && (
          <ModalUpdateUser user={record}> 
          <Tooltip title="Cập nhật"> 
                <EditOutlined style={{ color: "blue" }} />
            </Tooltip>
            </ModalUpdateUser>
         )}
        </Space>
      ),
    },
  ];
};