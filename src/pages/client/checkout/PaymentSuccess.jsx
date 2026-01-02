import {
  ClockCircleOutlined,
  CreditCardOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  QrcodeOutlined,
  ShoppingCartOutlined,
  StopFilled,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, QRCode } from "antd";
import dayjs from "dayjs";
import { Link, useParams } from "react-router";
import { ORDER_STATUS } from "../../../common/constants/order";
import { QUERY } from "../../../common/constants/queryKey";
import { getDetailOrder } from "../../../common/services/order.service";
import { formatCurrency } from "../../../common/utils";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { useEffect } from "react";
import { useUserStore } from "../../../store/useUserStore";

const PaymentSuccess = () => {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: [QUERY.ORDER, id],
    queryFn: () => getDetailOrder(id),
  });
  const addTicket = useUserStore((s) => s.addTicket);

  useEffect(() => {
    if (data?.data) {
      // Persist ticket to local user ticket history
      addTicket(data.data);
    }
  }, [data?.data]);
  const ticketRef = useRef(null);
  const handleSaveImage = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `ticket-${data?.data?.ticketId || "ticket"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Lưu vé thất bại:", error);
    }
  };
  return (
    <div className="mt-8 py-8">
      <div className="flex items-center flex-col">
        <p className="text-green-500 text-lg text-center">
          Thanh toán thành công vui lòng kiểm tra vé của bạn
        </p>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveImage}
            type="primary"
            icon={<DownloadOutlined />}
          >
            Lưu vé
          </Button>
          <Link to={"/"}>
            <Button>Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
      <div ref={ticketRef}>
        <div
          className="min-h-screen max-w-7xl xl:mx-auto mx-6 grid gap-4"
          style={{ gridTemplateColumns: "2fr 1fr" }}
        >
          <div className="mt-8">
            <Card
              className="shadow-md!"
              title={
                <div className="flex items-center gap-2">
                  <VideoCameraOutlined className="text-blue-500!" />
                  <p className="uppercase font-semibold mb-0!">
                    Thông tin phim
                  </p>
                </div>
              }
            >
              <div className="flex items-start gap-8">
                <img
                  src={data?.data?.moviePoster}
                  className="h-64 w-48 rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-lg">
                    {data?.data?.movieName}
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-400/30 text-blue-500 px-3 py-3 rounded-lg justify-center flex items-center">
                        <EnvironmentOutlined />
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0!">Phòng chiếu</p>
                        <p className="font-semibold mb-0!">
                          {data?.data?.roomName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-400/30 text-blue-500 px-3 py-3 rounded-lg justify-center flex items-center">
                        <ClockCircleOutlined />
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0!">Suất chiếu</p>
                        <p className="font-semibold mb-0!">
                          {dayjs(data?.data?.startTime).format(
                            "HH:mm DD/MM/YYYY",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          backgroundColor:
                            ORDER_STATUS[data?.data?.status]?.bgColor,
                          color: ORDER_STATUS[data?.data?.status]?.color,
                        }}
                        className="bg-orange-400/30 text-orange-500 px-3 py-3 rounded-lg justify-center flex items-center"
                      >
                        <ClockCircleOutlined />
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0!">Trạng thái</p>
                        <p
                          className={`font-semibold mb-0! flex justify-center px-4 rounded-md`}
                          style={{
                            color: ORDER_STATUS[data?.data?.status]?.color,
                            backgroundColor:
                              ORDER_STATUS[data?.data?.status]?.bgColor,
                          }}
                        >
                          {ORDER_STATUS[data?.data?.status]?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              className="shadow-md! mt-6!"
              title={
                <div className="flex items-center gap-2">
                  <StopFilled className="text-blue-500!" />
                  <p className="uppercase font-semibold mb-0!">Ghế đã đặt</p>
                </div>
              }
            >
              <div className="flex items-center gap-4">
                {data?.data?.seats.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 px-2 py-2 rounded-md text-white"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </Card>
            <Card
              className="shadow-md! mt-6!"
              title={
                <div className="flex items-center gap-2">
                  <QrcodeOutlined className="text-blue-500!" />
                  <p className="uppercase font-semibold mb-0!">Mã QR vé</p>
                </div>
              }
            >
              <div className="flex flex-col items-center gap-2">
                <QRCode value={data?.data?.ticketId} />
                <p className="text-gray-500 text-xs">{data?.data?.ticketId}</p>
                <p className="text-gray-500 text-xs">
                  Quét mã QR tại quầy để nhận vé
                </p>
              </div>
            </Card>
          </div>
          <div>
            <Card
              className="shadow-md! mt-6!"
              title={
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-purple-500!" />
                  <p className="uppercase font-semibold mb-0!">
                    Thông tin khách hàng
                  </p>
                </div>
              }
            >
              <div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <UserOutlined />
                    Họ và tên
                  </div>
                  <p className="font-semibold">
                    {data?.data?.customerInfo?.userName}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <PhoneOutlined />
                    Số điện thoại
                  </div>
                  <p className="font-semibold">
                    {data?.data?.customerInfo?.phone}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <MailOutlined />
                    Email
                  </div>
                  <p className="font-semibold">
                    {data?.data?.customerInfo?.email}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <ShoppingCartOutlined />
                    Tổng đơn hàng
                  </div>
                  <p className="font-semibold text-blue-500">
                    {formatCurrency(data?.data?.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card
              className="shadow-md! mt-6!"
              title={
                <div className="flex items-center gap-2">
                  <CreditCardOutlined className="text-purple-500!" />
                  <p className="uppercase font-semibold mb-0!">Thanh toán</p>
                </div>
              }
            >
              <div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    Mã giao dịch
                  </div>
                  <p className="font-semibold ">{data?.data?.codePayment}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    Thời gian đặt vé
                  </div>
                  <p className="font-semibold ">
                    {dayjs(data?.data?.createdAt).format("HH:mm DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
