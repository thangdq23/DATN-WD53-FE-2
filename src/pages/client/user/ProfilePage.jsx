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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useUserSelector, useUserStore } from "../../../store/useUserStore";
import { useAuthSelector } from "../../../store/useAuthStore";

const ProfilePage = () => {
  const profile = useUserSelector((s) => s.profile);
  const [form] = Form.useForm();
  const setProfile = useUserStore((s) => s.setProfile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const authUser = useAuthSelector((s) => s.user);

  useEffect(() => {
    if (!profile && authUser) setProfile(authUser);
  }, [authUser]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile]);

  const onFinish = async (values) => {
    try {
      const payload = { ...profile, ...values };
      const res = await updateProfile(payload);
      if (res?.data) {
        message.success("Cập nhật thông tin thành công");
      }
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <div className="max-w-5xl mx-auto">
          <Row gutter={24}>
            <Col span={8}>
              <div className="flex flex-col items-center">
                <Avatar size={120} src={profile?.avatar} className="mb-4">
                  {profile?.userName ? profile.userName[0] : "U"}
                </Avatar>
                <p className="font-semibold text-lg mb-0">
                  {profile?.userName}
                </p>
                <p className="text-gray-500 mb-4">{profile?.email}</p>
                <Upload showUploadList={false} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Tải ảnh đại diện</Button>
                </Upload>
                <Divider />
                <div className="w-full text-left">
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-semibold">{profile?.phone}</p>
                </div>
              </div>
            </Col>
            <Col span={16}>
              <h3 className="text-lg font-semibold mb-4">
                Chỉnh sửa thông tin
              </h3>
              <Card size="small">
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Form.Item name="userName" label="Họ và tên">
                    <Input placeholder="Nhập họ tên" />
                  </Form.Item>
                  <Form.Item name="phone" label="Số điện thoại">
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                  <div className="flex justify-end">
                    <Space>
                      <Button
                        onClick={() => {
                          setProfile(authUser || null);
                          form.setFieldsValue(authUser || {});
                        }}
                      >
                        Đặt lại
                      </Button>
                      <Button htmlType="submit" type="primary">
                        Lưu thay đổi
                      </Button>
                    </Space>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
