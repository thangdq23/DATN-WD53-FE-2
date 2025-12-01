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
    <div className="flex justify-center">
      <div className="flex flex-col px-12 flex-1 max-w-3xl bg-white shadow-xl my-12 rounded-lg py-6">
        <h3 className="text-2xl text-start">Đăng ký</h3>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex items-center gap-4">
            <Form.Item
              label={<p className="text-base font-medium">Họ</p>}
              className="flex-1"
              name={"firstName"}
              required
              rules={[
                formRules.required("Họ"),
                formRules.textRange("Họ", 2, 12),
              ]}
            >
              <Input
                style={{ height: 45, boxShadow: "none" }}
                placeholder="Tên"
              />
            </Form.Item>
            <Form.Item
              label={<p className="text-base font-medium">Tên</p>}
              className="flex-1"
              name={"lastName"}
              required
              rules={[
                formRules.required("Tên"),
                formRules.textRange("Tên", 2, 12),
              ]}
            >
              <Input
                style={{ height: 45, boxShadow: "none" }}
                placeholder="Tên"
              />
            </Form.Item>
          </div>
          <Form.Item
            label={<p className="text-base font-medium">Email</p>}
            className="flex-1"
            name={"email"}
            required
            rules={[
              formRules.required("email"),
              { type: "email", message: "Vui lòng nhập đúng định dạng email!" },
            ]}
          >
            <Input
              style={{ height: 45, boxShadow: "none" }}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            label={<p className="text-base font-medium">Số điện thoại</p>}
            className="flex-1"
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
              style={{ height: 45, boxShadow: "none" }}
              placeholder="Số điện thoại"
            />
          </Form.Item>
          <div className="flex items-center gap-6">
            <Form.Item
              label={<p className="text-base font-medium">Mật khẩu</p>}
              className="flex-1"
              name={"password"}
              required
              hasFeedback
              rules={[formRules.required("Mật khẩu")]}
            >
              <Input.Password
                style={{ height: 45, boxShadow: "none" }}
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item
              label={<p className="text-base font-medium">Xác nhận mật khẩu</p>}
              className="flex-1"
              name={"confirmPassword"}
              required
              rules={[
                formRules.required("Xác nhận mật khẩu"),
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                style={{ height: 45, boxShadow: "none" }}
                placeholder="Xác nhận mật khẩu"
              />
            </Form.Item>
          </div>
          <Form.Item className="mt-4!">
            <Button
              disabled={isPending}
              loading={isPending}
              htmlType="submit"
              style={{
                background: `var(--color-primary)`,
                height: 45,
                width: "100%",
                color: "black",
              }}
            >
              Đăng ký
            </Button>
          </Form.Item>
          <p className="text-center">
            Bạn đã có tài khoản?{" "}
            <span className="text-primary cursor-pointer hover:underline">
              <Link
               to={"/auth/login"}
               className="text-primary cursor-pointer hover:underline">
              Đăng nhập
              </Link>
            </span>
          </p>
        </Form> 
      </div>
    </div>
  );
};

export default RegisterPage;