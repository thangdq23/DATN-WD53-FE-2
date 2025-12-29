import { Button, Form, Input } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import { formRules } from "../../../common/utils/formRule";
import { useMutation } from "@tanstack/react-query";
import { registerService } from "../../../common/services/auth.service";
import { useMessage } from "../../../common/hooks/useMessage";
import { Link, useNavigate } from "react-router";
import bannerImg3 from "../../../assets/images/banner/backgourlogin-register.jpg";
import sideImg from "../../../assets/images/banner/background-loginupdate.jpg";

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-100">
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-600 font-bold shadow-lg hover:bg-[#D66D75] hover:text-white transition-all duration-300 hover:scale-105 group"
      >
        <HomeOutlined className="text-lg group-hover:animate-pulse" />
        <span className="text-sm">Trang chủ</span>
      </Link>

      {/* Background Image with Blur */}
      <div 
          className="absolute inset-0 z-0"
          style={{
              backgroundImage: `url(${bannerImg3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(10px)',
              transform: 'scale(1.1)'
          }}
      />
      <div className="absolute inset-0 bg-black/20 z-0" />
      
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden relative z-10 flex flex-col md:flex-row min-h-[750px]">
        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src={sideImg} 
            alt="Register" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Logo Placeholder */}
          <div className="absolute top-10 left-10 text-white font-bold text-3xl tracking-widest flex items-center gap-2">
            MOVIE <span className="text-red-500">STAR</span>
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10">
            <h2 className="text-3xl font-bold mb-2">Gia nhập cộng đồng</h2>
            <p className="text-white/80">Trải nghiệm đặt vé xem phim tiện lợi và nhận nhiều ưu đãi hấp dẫn.</p>
          </div>

          {/* Curve Divider */}
          <div className="absolute top-0 right-0 h-full w-24 translate-x-[1px] pointer-events-none z-20">
             <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="h-full w-full fill-white"
            >
               <path d="M 100 0 L 100 100 L 0 100 C 50 75 50 25 0 0 Z" />
            </svg>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          
          <div className="w-full max-w-md">
            
            <div className="flex justify-center gap-8 mb-8 border-b border-gray-200">
                <Link 
                  to="/auth/login"
                  className="pb-2 font-bold text-xl text-gray-400 hover:text-gray-600 transition-all"
                >
                  Đăng nhập
                </Link>
                <div 
                  className="pb-2 font-bold text-xl text-gray-900 border-b-2 border-red-500 cursor-pointer"
                >
                  Đăng ký
                </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name={"firstName"}
                rules={[
                  formRules.required("Họ"),
                  formRules.textRange("Họ", 2, 12),
                ]}
                className="mb-0"
              >
                <Input
                  className="rounded-full py-2.5 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all"
                  placeholder="Họ"
                />
              </Form.Item>

              <Form.Item
                name={"lastName"}
                rules={[
                  formRules.required("Tên"),
                  formRules.textRange("Tên", 2, 12),
                ]}
                className="mb-0"
              >
                <Input
                  className="rounded-full py-2.5 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all"
                  placeholder="Tên"
                />
              </Form.Item>
            </div>

            <Form.Item
              name={"email"}
              rules={[
                formRules.required("Email"),
                { type: "email", message: "Email không hợp lệ!" },
              ]}
              className="mb-0"
            >
              <Input
                className="rounded-full py-2.5 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name={"phone"}
              rules={[
                formRules.required("Số điện thoại"),
                {
                  pattern: /^(0|\+84)(\d{9})$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
              className="mb-0"
            >
              <Input
                className="rounded-full py-2.5 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all"
                placeholder="Số điện thoại"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name={"password"}
                hasFeedback
                rules={[formRules.required("Mật khẩu")]}
                className="mb-0"
              >
                <Input.Password
                  className="rounded-full py-2.5 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all"
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name={"confirmPassword"}
                rules={[
                  formRules.required("Xác nhận mật khẩu"),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
                className="mb-0"
              >
                <Input.Password
                  className="rounded-full py-2.5 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all"
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>
            </div>

            <Form.Item className="mt-4 mb-2">
              <Button
                disabled={isPending}
                loading={isPending}
                htmlType="submit"
                className="h-12 w-full rounded-full text-lg font-bold text-white bg-[#D66D75] hover:bg-[#E29587] border-0 shadow-lg shadow-red-200 transition-all"
              >
                Đăng ký tài khoản
              </Button>
            </Form.Item>
            
            <div className="text-center">
              <p className="text-gray-500 text-sm font-medium">
                Bạn đã có tài khoản?{" "}
                <Link to={"/auth/login"} className="text-[#D66D75] hover:underline transition-all">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;