import { Button, Card, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useUserSelector, useUserStore } from "../../../store/useUserStore";
import { useAuthSelector } from "../../../store/useAuthStore";

const ProfilePage = () => {
  const profile = useUserSelector((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const authUser = useAuthSelector((s) => s.user);

  useEffect(() => {
    if (!profile && authUser) setProfile(authUser);
  }, [authUser]);

  const onFinish = async (values) => {
    try {
      const payload = { ...profile, ...values };
      const res = await updateProfile(payload);
      if (res?.data) {
        message.success("Cập nhật thông tin thành công");
      }
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="mt-8">
      <Card title="Thông tin người dùng">
        <Form
          layout="vertical"
          initialValues={profile || {}}
          onFinish={onFinish}
        >
          <Form.Item name="userName" label="Họ và tên">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <div className="flex gap-2">
            <Button htmlType="submit" type="primary">
              Lưu
            </Button>
            <Button
              onClick={() => {
                setProfile(authUser || null);
              }}
            >
              Đặt lại
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
