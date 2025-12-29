import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router";
import { GoogleOutlined, FacebookOutlined, HomeOutlined } from "@ant-design/icons";
import bannerImg3 from "../../../assets/images/banner/backgourlogin-register.jpg";
import sideImg from "../../../assets/images/banner/background-loginupdate.jpg";
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

      {/* Main Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden relative z-10 flex flex-col md:flex-row min-h-[750px]">
        
        {/* Left Side - Image with Curve Overlay */}
        <div className="hidden md:block w-1/2 relative">
          <img src={sideImg} alt="Login Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Logo Placeholder */}
          <div className="absolute top-10 left-10 text-white font-bold text-3xl tracking-widest flex items-center gap-2">
            MOVIE <span className="text-red-500">STAR</span>
          </div>

          {/* Curve Divider - Placed on the right edge of the left column */}
          <div className="absolute top-0 right-0 h-full w-24 translate-x-[1px] pointer-events-none">
             <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="h-full w-full fill-white"
            >
               {/* This path creates a curve that bulges into the image (left) */}
               <path d="M 100 0 L 100 100 L 0 100 C 50 75 50 25 0 0 Z" />
            </svg>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          
          <div className="w-full max-w-md">
            
            <div className="flex justify-center gap-8 mb-8 border-b border-gray-200">
                <div 
                  className="pb-2 font-bold text-xl text-gray-900 border-b-2 border-red-500 cursor-pointer"
                >
                  Đăng nhập
                </div>
                <Link 
                  to="/auth/register"
                  className="pb-2 font-bold text-xl text-gray-400 hover:text-gray-600 transition-all"
                >
                  Đăng ký
                </Link>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="flex flex-col gap-4">
              
              <Form.Item
                name={"email"}
                rules={[
                  formRules.required("Email hoặc số điện thoại"),
                ]}
                className="mb-2"
              >
                <Input 
                  className="rounded-full py-3 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all" 
                  placeholder="Email hoặc số điện thoại" 
                />
              </Form.Item>

              <Form.Item
                name={"password"}
                rules={[formRules.required("Mật khẩu")]}
                className="mb-2"
              >
                <Input.Password 
                  className="rounded-full py-3 px-5 border-gray-200 bg-gray-50 hover:bg-white focus:bg-white transition-all" 
                  placeholder="Mật khẩu" 
                />
              </Form.Item>

              <Form.Item className="mt-4 mb-2">
                <Button
                  disabled={isPending}
                  loading={isPending}
                  htmlType="submit"
                  className="w-full h-12 rounded-full text-white font-bold text-lg bg-[#D66D75] hover:bg-[#E29587] border-0 shadow-lg shadow-red-200 transition-all"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-400">Ghi nhớ mật khẩu</Checkbox>
                </Form.Item>
                <Link to="/auth/forgot-password" className="text-gray-400 hover:text-gray-600">
                  Quên mật khẩu?
                </Link>
              </div>
            </Form>

            <div className="relative flex items-center justify-center mb-6 mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative bg-white px-4 text-sm font-bold text-gray-900">HOẶC</span>
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
               <Button shape="circle" size="large" className="border-gray-300 text-blue-600 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center">
                  <FacebookOutlined className="text-xl" />
               </Button>
               <Button shape="circle" size="large" className="border-gray-300 text-red-500 hover:border-red-500 hover:bg-red-50 flex items-center justify-center">
                  <GoogleOutlined className="text-xl" />
               </Button>
            </div>

            <div className="text-center text-sm font-medium text-gray-900">
               Bạn chưa có tài khoản? <Link to="/auth/register" className="text-[#D66D75] hover:underline">Đăng ký</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
