import { Button, Form, Input } from "antd";
import { formRules } from "../../../common/utils/formRule";
import { useMutation } from "@tanstack/react-query";
import { registerService } from "../../../common/services/auth.service";
import { useMessage } from "../../../common/hooks/useMessage";
import { Link, useNavigate } from "react-router";

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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-gray-200 px-8 py-7">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 m-0">Đăng ký</h3>
          <p className="text-sm text-gray-500 mt-1">Tạo tài khoản để đặt vé nhanh hơn</p>
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
  );
};

export default RegisterPage;
