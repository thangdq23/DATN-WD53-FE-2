import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Upload,
  Tabs,
  Typography,
  Tag,
  Progress,
  Badge,
  Modal,
  Spin,
  Empty,
  Collapse,
  QRCode,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  LockOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
  StopFilled,
  VideoCameraOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import * as htmlToImage from "html-to-image";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
import { useEffect, useState, useRef } from "react";
import useUserStore, { useUserSelector } from "../../../store/useUserStore";
import { useAuthSelector } from "../../../store/useAuthStore";
import { ORDER_STATUS } from "../../../common/constants/order";
import { formatCurrency } from "../../../common/utils";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../../common/hooks/useMessage";
import { changePassword as apiChangePassword } from "../../../common/services/user.service";

const ProfilePage = () => {
  const navigate = useNavigate();
  const profile = useUserSelector((s) => s.profile);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [ticketLoading, setTicketLoading] = useState(false);
  const tickets = useUserSelector((s) => s.tickets || []);
  const panelRefs = useRef({});
  const setProfile = useUserStore((s) => s.setProfile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const authUser = useAuthSelector((s) => s.user);
  const { showMessage, HandleError } = useMessage();
  // Fetch tickets when component mounts
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        await useUserStore.getState().fetchMyTickets();
      } catch (e) {
        // ignore
      }
      setLoading(false);
    };

    fetch();
  }, []);
  useEffect(() => {
    const fetchTickets = async () => {
      setTicketLoading(true);
      try {
        await useUserStore.getState().fetchMyTickets();
      } catch (e) {
        console.error("Error fetching tickets:", e);
      }
      setTicketLoading(false);
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    if (!profile && authUser) setProfile(authUser);
  }, [authUser]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile]);

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const res = await apiChangePassword(payload);
      if (res?.success) {
        showMessage({ type: "success", title: "Đổi mật khẩu thành công" });
        setChangePasswordVisible(false);
        passwordForm.resetFields();
      } else {
        showMessage({
          type: "error",
          title: res?.message || "Đổi mật khẩu thất bại",
        });
      }
    } catch (error) {
      console.error("Change password error:", error);
      HandleError(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...profile,
        ...values,
        avatar: avatarUrl || profile?.avatar,
        email: profile?.email,
      };
      const res = await updateProfile(payload);
      if (res?.success) {
        showMessage({
          type: "success",
          title: "Cập nhật thông tin thành công",
        });
        setProfile({
          ...profile,
          ...values,
          avatar: avatarUrl || profile?.avatar,
        });
      } else {
        showMessage({
          type: "error",
          title: res?.message || "Cập nhật thất bại",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      HandleError(error);
    } finally {
      setLoading(false);
    }
  };
  const cardStyle = {
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    border: "1px solid #f0f0f0",
  };

  const profileHeaderStyle = {
    background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
    padding: "40px 24px 120px",
    position: "relative",
    marginBottom: "80px",
    borderRadius: "0 0 40% 40%",
    overflow: "hidden",
  };

  const avatarContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  };

  const avatarStyle = {
    width: "120px",
    height: "120px",
    border: "4px solid #fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    marginBottom: "16px",
    background: "#f0f2f5",
  };

  const handleAvatarChange = async (info) => {
    if (info.file) {
      try {
        setAvatarLoading(true);

        const mockUpload = (file) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const url = e.target.result;
                setAvatarUrl(url);
                resolve(url);
              };
              reader.readAsDataURL(file);
            }, 1000);
          });
        };

        await mockUpload(info.file);
        showMessage({
          type: "success",
          title: "Cập nhật ảnh đại diện thành công",
        });
      } catch (error) {
        console.error("Upload error:", error);
        HandleError(error);
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const editButtonStyle = {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
      <div style={profileHeaderStyle}>
        <div style={avatarContainerStyle}>
          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Bạn chỉ có thể tải lên file ảnh!");
                return Upload.LIST_IGNORE;
              }
              const isLt5M = file.size / 1024 / 1024 < 5;
              if (!isLt5M) {
                message.error("Kích thước ảnh không được vượt quá 5MB!");
                return Upload.LIST_IGNORE;
              }
              handleAvatarChange({ file });
              return false;
            }}
          >
            <Badge
              count={
                <div style={editButtonStyle}>
                  {avatarLoading ? <Spin size="small" /> : <EditOutlined />}
                </div>
              }
            >
              <Avatar
                size={120}
                src={avatarUrl || profile?.avatar}
                style={avatarStyle}
                icon={<UserOutlined style={{ fontSize: "48px" }} />}
              >
                {profile?.userName?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </Badge>
          </Upload>
          <Title level={3} style={{ color: "#fff", margin: "16px 0 4px" }}>
            {profile?.userName || "Người dùng"}
          </Title>
          <Text type="secondary" style={{ color: "rgba(255,255,255,0.8)" }}>
            {profile?.email}
          </Text>
          {((authUser && authUser.role === "admin") ||
            profile?.role === "admin") && (
            <div style={{ marginTop: 12 }}>
              <Button
                type="primary"
                onClick={() => navigate("/admin")}
                icon={<VideoCameraOutlined />}
              >
                Trang quản trị
              </Button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <Card style={cardStyle}>
          <Tabs defaultActiveKey="1" type="card" size="large">
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  Thông tin cá nhân
                </span>
              }
              key="1"
            >
              <Row gutter={[24, 24]} style={{ marginTop: "16px" }}>
                <Col xs={24} md={8}>
                  <Card
                    title="Thông tin tài khoản"
                    bordered={false}
                    headStyle={{
                      border: "none",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    <div style={{ marginBottom: "24px" }}>
                      <Text type="secondary" style={{ fontSize: "13px" }}>
                        Email
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <MailOutlined
                          style={{ color: "#1890ff", marginRight: "8px" }}
                        />
                        <Text strong>{profile?.email || "Chưa cập nhật"}</Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: "13px" }}>
                        Số điện thoại
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <PhoneOutlined
                          style={{ color: "#52c41a", marginRight: "8px" }}
                        />
                        <Text strong>{profile?.phone || "Chưa cập nhật"}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={16}>
                  <Card
                    title="Cập nhật thông tin"
                    bordered={false}
                    headStyle={{
                      border: "none",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    <Form layout="vertical" form={form} onFinish={onFinish}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="userName"
                            label="Họ và tên"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập họ tên",
                              },
                            ]}
                          >
                            <Input
                              prefix={
                                <UserOutlined style={{ color: "#1890ff" }} />
                              }
                              placeholder="Nhập họ tên"
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số điện thoại",
                              },
                              {
                                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                message: "Số điện thoại không hợp lệ",
                              },
                            ]}
                          >
                            <Input
                              prefix={
                                <PhoneOutlined style={{ color: "#52c41a" }} />
                              }
                              placeholder="Nhập số điện thoại"
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: "email", message: "Email không hợp lệ" },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined style={{ color: "#faad14" }} />}
                          placeholder="Nhập email"
                          size="large"
                          disabled
                        />
                      </Form.Item>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: "24px",
                        }}
                      >
                        <Space>
                          <Button
                            onClick={() => {
                              setProfile(authUser || null);
                              form.setFieldsValue(authUser || {});
                            }}
                            size="large"
                          >
                            Đặt lại
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{
                              background:
                                "linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)",
                              border: "none",
                              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                            }}
                          >
                            {loading ? <Spin /> : "Cập nhật thông tin"}
                          </Button>
                        </Space>
                      </div>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <LockOutlined />
                  Bảo mật
                </span>
              }
              key="2"
            >
              <Card style={{ marginTop: "16px" }}>
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                  <div style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <Text strong>Mật khẩu</Text>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => setChangePasswordVisible(true)}
                      >
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </div>
                  <Divider />
                </div>
              </Card>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <HistoryOutlined />
                  Lịch sử đặt vé
                </span>
              }
              key="3"
            >
              <div className="mt-8 py-8">
                {loading ? (
                  <Card loading />
                ) : tickets.length === 0 ? (
                  <Card>
                    <Empty description="Bạn chưa có vé nào" />
                  </Card>
                ) : (
                  <Card>
                    <Collapse accordion={false}>
                      {tickets.map((item, idx) => (
                        <Collapse.Panel
                          key={item?.ticketId || idx}
                          header={
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-4">
                                <img
                                  src={item?.moviePoster}
                                  className="h-16 w-12 rounded-md object-cover"
                                  alt=""
                                />
                                <div>
                                  <div className="font-semibold">
                                    {item?.movieName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item?.roomName} • {item?.ticketId}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">
                                  {dayjs(item?.startTime).format(
                                    "HH:mm DD/MM/YYYY",
                                  )}
                                </div>
                                <div className="mt-1">
                                  <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{
                                      backgroundColor:
                                        ORDER_STATUS[item?.status]?.bgColor,
                                      color: ORDER_STATUS[item?.status]?.color,
                                    }}
                                  >
                                    {ORDER_STATUS[item?.status]?.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <div
                            ref={(el) => {
                              if (!item?.ticketId) return;
                              if (!panelRefs.current) panelRefs.current = {};
                              panelRefs.current[item.ticketId] = el;
                            }}
                            className="min-h-screen max-w-7xl xl:mx-auto mx-0 grid gap-4"
                            style={{ gridTemplateColumns: "2fr 1fr" }}
                          >
                            <div>
                              <Card className="shadow-md!">
                                <div className="flex items-start gap-8">
                                  <img
                                    src={item?.moviePoster}
                                    className="h-64 w-48 rounded-lg object-cover"
                                    alt=""
                                  />
                                  <div>
                                    <p className="font-semibold text-lg">
                                      {item?.movieName}
                                    </p>
                                    <div className="flex flex-col gap-4">
                                      <div className="flex items-center gap-2">
                                        <div className="bg-blue-400/30 text-blue-500 px-3 py-3 rounded-lg justify-center flex items-center">
                                          <EnvironmentOutlined />
                                        </div>
                                        <div>
                                          <p className="text-gray-500 mb-0!">
                                            Phòng chiếu
                                          </p>
                                          <p className="font-semibold mb-0!">
                                            {item?.roomName}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="bg-blue-400/30 text-blue-500 px-3 py-3 rounded-lg justify-center flex items-center">
                                          <ClockCircleOutlined />
                                        </div>
                                        <div>
                                          <p className="text-gray-500 mb-0!">
                                            Suất chiếu
                                          </p>
                                          <p className="font-semibold mb-0!">
                                            {dayjs(item?.startTime).format(
                                              "HH:mm DD/MM/YYYY",
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div
                                          style={{
                                            backgroundColor:
                                              ORDER_STATUS[item?.status]
                                                ?.bgColor,
                                            color:
                                              ORDER_STATUS[item?.status]?.color,
                                          }}
                                          className="px-3 py-3 rounded-lg justify-center flex items-center"
                                        >
                                          <ClockCircleOutlined />
                                        </div>
                                        <div>
                                          <p className="text-gray-500 mb-0!">
                                            Trạng thái
                                          </p>
                                          <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-2">
                                              <p
                                                className={`font-semibold mb-0! flex justify-center px-4 rounded-md`}
                                                style={{
                                                  color:
                                                    ORDER_STATUS[item?.status]
                                                      ?.color,
                                                  backgroundColor:
                                                    ORDER_STATUS[item?.status]
                                                      ?.bgColor,
                                                }}
                                              >
                                                {
                                                  ORDER_STATUS[item?.status]
                                                    ?.label
                                                }
                                              </p>
                                              {item?.status === "pending" &&
                                                (() => {
                                                  const ticketCreatedAt = dayjs(
                                                    item?.createdAt,
                                                  );
                                                  const fiveMinutesAgo =
                                                    dayjs().subtract(
                                                      5,
                                                      "minute",
                                                    );
                                                  const isExpired =
                                                    ticketCreatedAt.isBefore(
                                                      fiveMinutesAgo,
                                                    );

                                                  if (isExpired) {
                                                    return (
                                                      <p className="text-red-500 text-sm">
                                                        Đã quá thời gian thanh
                                                        toán
                                                      </p>
                                                    );
                                                  }

                                                  return (
                                                    <Button
                                                      type="primary"
                                                      size="small"
                                                      onClick={() => {
                                                        const showtimeId =
                                                          item?.showtimeId ||
                                                          "";
                                                        const roomId =
                                                          item?.roomId || "";
                                                        const movieId =
                                                          item?.movieId || "";
                                                        const hour =
                                                          item?.startTime
                                                            ? dayjs(
                                                                item.startTime,
                                                              ).format("HH:mm")
                                                            : "";
                                                        const selectedSeats =
                                                          item?.seats
                                                            ?.map(
                                                              (seat) =>
                                                                seat.label,
                                                            )
                                                            .join(",") || "";

                                                        navigate(
                                                          `/checkout/${showtimeId}/${roomId}?movieId=${movieId}&hour=${hour}&seats=${encodeURIComponent(
                                                            selectedSeats,
                                                          )}`,
                                                        );
                                                      }}
                                                      style={{
                                                        background: "#52c41a",
                                                        borderColor: "#52c41a",
                                                      }}
                                                    >
                                                      Thanh toán ngay
                                                    </Button>
                                                  );
                                                })()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                              {item?.status !== "PENDING" && (
                                <Card className="shadow-md! mt-6!">
                                  <div className="flex items-center gap-4">
                                    {item?.seats?.map((s, i) => (
                                      <div
                                        key={i}
                                        className="bg-blue-500 px-2 py-2 rounded-md text-white"
                                      >
                                        {s.label}
                                      </div>
                                    ))}
                                  </div>
                                </Card>
                              )}
                              {item?.status !== "PENDING" && (
                                <Card className="shadow-md! mt-6!">
                                  <div className="flex flex-col items-center gap-2">
                                    <QRCode value={item?.ticketId} />
                                    <p className="text-gray-500 text-xs">
                                      {item?.ticketId}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      Quét mã QR tại quầy để nhận vé
                                    </p>
                                  </div>
                                </Card>
                              )}
                            </div>
                            <div>
                              <Card className="shadow-md! mt-6!">
                                <div>
                                  <div className="flex flex-col gap-1">
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                      <ShoppingCartOutlined />
                                      Tổng đơn hàng
                                    </div>
                                    <p className="font-semibold text-blue-500">
                                      {formatCurrency(item?.totalAmount || 0)}
                                    </p>
                                  </div>
                                  {item?.status !== "PENDING" && (
                                    <>
                                      <div className="flex flex-col gap-1 mt-4">
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                          <UserOutlined />
                                          Họ và tên
                                        </div>
                                        <p className="font-semibold">
                                          {item?.customerInfo?.userName}
                                        </p>
                                      </div>
                                      <div className="flex flex-col gap-1 mt-2">
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                          <UserOutlined />
                                          Số điện thoại
                                        </div>
                                        <p className="font-semibold">
                                          {item?.customerInfo?.phone}
                                        </p>
                                      </div>
                                      <div className="flex flex-col gap-1 mt-2">
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                          <UserOutlined />
                                          Email
                                        </div>
                                        <p className="font-semibold">
                                          {item?.customerInfo?.email}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </Card>
                              <Card className="shadow-md! mt-6!">
                                <div className="space-y-4">
                                  <div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                      Mã giao dịch
                                    </div>
                                    <p className="font-semibold">
                                      {item?.codePayment}
                                    </p>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                      Thời gian đặt vé
                                    </div>
                                    <p className="font-semibold">
                                      {dayjs(item?.createdAt).format(
                                        "HH:mm DD/MM/YYYY",
                                      )}
                                    </p>
                                  </div>

                                  <div className="space-y-2 mt-4">
                                    {item?.status === "PENDING" && (
                                      <Button
                                        type="primary"
                                        block
                                        size="large"
                                        onClick={() =>
                                          navigate(`/payment/${item?.ticketId}`)
                                        }
                                        icon={<CreditCardOutlined />}
                                      >
                                        Thanh toán ngay
                                      </Button>
                                    )}

                                    <Button
                                      block
                                      size="large"
                                      onClick={async () => {
                                        try {
                                          const node =
                                            panelRefs.current?.[item?.ticketId];
                                          if (!node) return;
                                          const dataUrl =
                                            await htmlToImage.toPng(node, {
                                              backgroundColor: "#1435a1ff",
                                              cacheBust: true,
                                            });
                                          const a = document.createElement("a");
                                          a.href = dataUrl;
                                          a.download = `${
                                            item?.ticketId || "ticket"
                                          }.png`;
                                          document.body.appendChild(a);
                                          a.click();
                                          a.remove();
                                          message.success(
                                            "Đã lưu vé thành công",
                                          );
                                        } catch (e) {
                                          console.error(e);
                                          message.error("Có lỗi khi lưu vé");
                                        }
                                      }}
                                      icon={<DownloadOutlined />}
                                    >
                                      Lưu vé
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </Card>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <Modal
        title="Đổi mật khẩu"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setChangePasswordVisible(false)}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background:
                    "linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)",
                  border: "none",
                }}
              >
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
