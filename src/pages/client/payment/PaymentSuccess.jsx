import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetailOrder } from "../../../common/services/order.service";

const PaymentSuccess = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => getDetailOrder(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi tải đơn hàng</p>;

  return <div>Thanh toán thành công</div>;
};

export default PaymentSuccess;
