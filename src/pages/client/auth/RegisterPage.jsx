import { Button, Form, Input } from "antd";
import { formRules } from "../../../common/utils/formRule";
import { useMutation } from "@tanstack/react-query";
import { registerService } from "../../../common/services/auth.service";
import { useMessage } from "../../../common/hooks/useMessage";
import { Link, useNavigate } from "react-router";
import bannerImg3 from "../../../assets/images/banner/banner4.webp";

const RegisterPage = () => {
  const nav= useNavigate();
  const [form] = Form.useForm();
  const { HandleError, antdMessage } = useMessage();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => registerService(payload),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      nav("/auth/login");
    },
    onError: (err) => HandleError(err),
  });
  const handleSubmit = async (values) => {
    const { confirmPassword, firstName, lastName, ...payload } = values;
    void confirmPassword;
    const userName = `${firstName} ${lastName}`;
    mutate({ userName, ...payload });
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#121826] to-[#0b1220] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5">
          <img src={bannerImg3} alt="Register" className="w-full h-full object-cover" />
        </div>

        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-gray-200 px-8 py-7">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold m-0">Tạo tài khoản mới</h1>
            <p className="text-sm text-gray-600 mt-1">Đăng ký để nhận ưu đãi và đặt vé nhanh chóng</p>
          </div>

          <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 px-4 py-3 text-sm">
            Để kích hoạt đầy đủ tính năng đăng nhập/đăng ký, vui lòng cấu hình hệ thống xác thực.
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<p className="text-sm font-medium text-gray-700 m-0">Họ</p>}
              name={"firstName"}
              required
              rules={[
                formRules.required("Họ"),
                formRules.textRange("Họ", 2, 12),
              ]}
            >
              <Input
                className="rounded-lg"
                style={{ height: 42, boxShadow: "none" }}
                placeholder="Họ"
              />
            </Form.Item>

            <Form.Item
              label={<p className="text-sm font-medium text-gray-700 m-0">Tên</p>}
              name={"lastName"}
              required
              rules={[
                formRules.required("Tên"),
                formRules.textRange("Tên", 2, 12),
              ]}
            >
              <Input
                className="rounded-lg"
                style={{ height: 42, boxShadow: "none" }}
                placeholder="Tên"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<p className="text-sm font-medium text-gray-700 m-0">Email</p>}
            name={"email"}
            required
            rules={[
              formRules.required("email"),
              { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
            ]}
          >
            <Input
              className="rounded-lg"
              style={{ height: 42, boxShadow: "none" }}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            label={<p className="text-sm font-medium text-gray-700 m-0">Số điện thoại</p>}
            name={"phone"}
            required
            rules={[
              formRules.required("số điện thoại"),
              {
                pattern: /^(0|\+84)(\d{9})$/,
                message: "Vui lòng nhập số điện thoại hợp lệ!",
              },
            ]}
          >
            <Input
              className="rounded-lg"
              style={{ height: 42, boxShadow: "none" }}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<p className="text-sm font-medium text-gray-700 m-0">Mật khẩu</p>}
              name={"password"}
              required
              hasFeedback
              rules={[formRules.required("Mật khẩu")]}
            >
              <Input.Password
                className="rounded-lg"
                style={{ height: 42, boxShadow: "none" }}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item
              label={<p className="text-sm font-medium text-gray-700 m-0">Xác nhận mật khẩu</p>}
              name={"confirmPassword"}
              required
              rules={[
                formRules.required("Xác nhận mật khẩu"),
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                className="rounded-lg"
                style={{ height: 42, boxShadow: "none" }}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>
          </div>

          <Form.Item className="mt-2">
            <Button
              disabled={isPending}
              loading={isPending}
              htmlType="submit"
              type="primary"
              className="h-11 w-full rounded-lg"
            >
              Đăng ký
            </Button>
          </Form.Item>
          <p className="text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link to={"/auth/login"} className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
