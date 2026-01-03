import {
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
  StopFilled,
  UserOutlined,
  VideoCameraOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Card, Empty, Collapse, QRCode } from "antd";
import { useUserSelector } from "../../../store/useUserStore";
import dayjs from "dayjs";
import { ORDER_STATUS } from "../../../common/constants/order";
import { formatCurrency } from "../../../common/utils";

const MyTicketsPage = () => {
  const tickets = useUserSelector((s) => s.tickets || []);

  return (
    <div className="mt-8 py-8">
      {tickets.length === 0 ? (
        <Card title="Lịch sử vé">
          <Empty description="Bạn chưa có vé nào" />
        </Card>
      ) : (
        <Card title="Lịch sử vé">
          <Collapse accordion={false}>
            {tickets.map((item, idx) => (
              <Collapse.Panel
                key={item?.ticketId || idx}
                header={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <img
                        src={item?.moviePoster}
                        className="h-16 w-12 rounded-md object-cover"
                        alt=""
                      />
                      <div>
                        <div className="font-semibold">{item?.movieName}</div>
                        <div className="text-sm text-gray-500">
                          {item?.roomName} • {item?.ticketId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {dayjs(item?.startTime).format("HH:mm DD/MM/YYYY")}
                      </div>
                      <div className="mt-1">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor:
                              ORDER_STATUS[item?.status]?.bgColor,
                            color: ORDER_STATUS[item?.status]?.color,
                          }}
                        >
                          {ORDER_STATUS[item?.status]?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              >
                <div
                  className="min-h-screen max-w-7xl xl:mx-auto mx-0 grid gap-4"
                  style={{ gridTemplateColumns: "2fr 1fr" }}
                >
                  <div>
                    <Card className="shadow-md!">
                      <div className="flex items-start gap-8">
                        <img
                          src={item?.moviePoster}
                          className="h-64 w-48 rounded-lg object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-semibold text-lg">
                            {item?.movieName}
                          </p>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-400/30 text-blue-500 px-3 py-3 rounded-lg justify-center flex items-center">
                                <EnvironmentOutlined />
                              </div>
                              <div>
                                <p className="text-gray-500 mb-0!">
                                  Phòng chiếu
                                </p>
                                <p className="font-semibold mb-0!">
                                  {item?.roomName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-400/30 text-blue-500 px-3 py-3 rounded-lg justify-center flex items-center">
                                <ClockCircleOutlined />
                              </div>
                              <div>
                                <p className="text-gray-500 mb-0!">
                                  Suất chiếu
                                </p>
                                <p className="font-semibold mb-0!">
                                  {dayjs(item?.startTime).format(
                                    "HH:mm DD/MM/YYYY",
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                style={{
                                  backgroundColor:
                                    ORDER_STATUS[item?.status]?.bgColor,
                                  color: ORDER_STATUS[item?.status]?.color,
                                }}
                                className="px-3 py-3 rounded-lg justify-center flex items-center"
                              >
                                <ClockCircleOutlined />
                              </div>
                              <div>
                                <p className="text-gray-500 mb-0!">
                                  Trạng thái
                                </p>
                                <p
                                  className={`font-semibold mb-0! flex justify-center px-4 rounded-md`}
                                  style={{
                                    color: ORDER_STATUS[item?.status]?.color,
                                    backgroundColor:
                                      ORDER_STATUS[item?.status]?.bgColor,
                                  }}
                                >
                                  {ORDER_STATUS[item?.status]?.label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card className="shadow-md! mt-6!">
                      <div className="flex items-center gap-4">
                        {item?.seats?.map((s, i) => (
                          <div
                            key={i}
                            className="bg-blue-500 px-2 py-2 rounded-md text-white"
                          >
                            {s.label}
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="shadow-md! mt-6!">
                      <div className="flex flex-col items-center gap-2">
                        <QRCode value={item?.ticketId} />
                        <p className="text-gray-500 text-xs">
                          {item?.ticketId}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Quét mã QR tại quầy để nhận vé
                        </p>
                      </div>
                    </Card>
                  </div>
                  <div>
                    <Card className="shadow-md! mt-6!">
                      <div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <UserOutlined />
                            Họ và tên
                          </div>
                          <p className="font-semibold">
                            {item?.customerInfo?.userName}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <UserOutlined />
                            Số điện thoại
                          </div>
                          <p className="font-semibold">
                            {item?.customerInfo?.phone}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <UserOutlined />
                            Email
                          </div>
                          <p className="font-semibold">
                            {item?.customerInfo?.email}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <ShoppingCartOutlined />
                            Tổng đơn hàng
                          </div>
                          <p className="font-semibold text-blue-500">
                            {formatCurrency(item?.totalAmount || 0)}
                          </p>
                        </div>
                      </div>
                    </Card>
                    <Card className="shadow-md! mt-6!">
                      <div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            Mã giao dịch
                          </div>
                          <p className="font-semibold ">{item?.codePayment}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            Thời gian đặt vé
                          </div>
                          <p className="font-semibold ">
                            {dayjs(item?.createdAt).format("HH:mm DD/MM/YYYY")}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Collapse.Panel>
            ))}
          </Collapse>
        </Card>
      )}
    </div>
  );
};

export default MyTicketsPage;
