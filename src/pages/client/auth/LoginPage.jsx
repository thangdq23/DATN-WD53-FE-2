import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router";
import bannerImg3 from "../../../assets/images/banner/banner4.webp";
import { useMessage } from "../../../common/hooks/useMessage";
import { loginService } from "../../../common/services/auth.service";
import { formRules } from "../../../common/utils/formRule";
import { useAuthSelector } from "../../../store/useAuthStore";

const LoginPage = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { HandleError, antdMessage } = useMessage();
  const login = useAuthSelector((state) => state.doLogin);
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => loginService(payload),
    onSuccess: ({ data, message }) => {
      antdMessage.success(message);
      login(data.accessToken, data.user);
      nav("/");
    },
    onError: (err) => HandleError(err),
  });
  const handleSubmit = async (values) => {
    mutate(values);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#121826] to-[#0b1220] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5">
          <img src={bannerImg3} alt="Login" className="w-full h-full object-cover" />
        </div>

        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-gray-200 px-8 py-7">
          <h3 className="text-3xl font-extrabold m-0">Đăng nhập</h3>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            <Input className="rounded-lg" style={{ height: 45, boxShadow: "none" }} placeholder="Email" />
          </Form.Item>
          <Form.Item
            label={<p className="text-base font-medium">Mật khẩu</p>}
            className="flex-1"
            name={"password"}
            required
            hasFeedback
            rules={[formRules.required("Mật khẩu")]}
          >
            <Input.Password className="rounded-lg" style={{ height: 45, boxShadow: "none" }} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item className="mt-2">
            <Button
              disabled={isPending}
              loading={isPending}
              htmlType="submit"
              type="primary"
              className="h-11 w-full rounded-lg"
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <p className="text-center">
            Bạn đã chưa có?{" "}
            <Link
              to={"/auth/register"}
              className="text-primary cursor-pointer hover:underline"
            >
              Đăng ký
            </Link>
          </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
