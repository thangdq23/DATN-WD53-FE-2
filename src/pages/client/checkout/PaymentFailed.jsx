import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    message.error("Thanh toán đã bị hủy hoặc thất bại");
    navigate("/");
  }, [navigate]);

  return <div>Đang chuyển hướng...</div>;
};
export default PaymentFailed;