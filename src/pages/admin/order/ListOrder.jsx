import { useQuery } from "@tanstack/react-query";
import { Button, Space, Table, Tag, Typography, message } from "antd";
import {
  EyeOutlined,
  QrcodeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCodeLib from "qrcode";
import { getDetailOrder } from "../../../common/services/order.service";
import dayjs from "dayjs";
import { Link } from "react-router";

import { QUERYKEY } from "../../../common/constants/queryKey";
import { getAllOrder } from "../../../common/services/order.service";
import { useTable } from "../../../common/hooks/useTable";
import { ORDER_STATUS } from "../../../common/constants/order";
import FilterOrder from "./components/FilterOrder";

const { Text } = Typography;

const ListOrder = () => {
  const { query } = useTable();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.ORDER, query],
    queryFn: () => getAllOrder(query),
  });

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (ticketId) => <Text strong>{ticketId}</Text>,
    },
    {
      title: "Phim",
      dataIndex: "movieName",
      key: "movieName",
      render: (v) => v || "-",
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <div>
          <div>{record?.customerInfo?.userName || "-"}</div>
          <Text type="secondary">{record?.customerInfo?.phone || ""}</Text>
        </div>
      ),
    },
    {
      title: "Suất chiếu",
      key: "showtime",
      render: (_, record) => (
        <div>
          <div>
            {record?.startTime
              ? dayjs(record.startTime).format("HH:mm - DD/MM/YYYY")
              : "-"}
          </div>
          <Text type="secondary">{record?.roomName || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Ghế ngồi",
      dataIndex: "seats",
      key: "seats",
      render: (seats) =>
        Array.isArray(seats) ? seats.map((s) => s.label).join(", ") : "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={ORDER_STATUS?.[status]?.color}>
          {ORDER_STATUS?.[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/ticket/detail/${record._id}`}>
            <Button icon={<EyeOutlined />} />
          </Link>
          <Button
            icon={<PrinterOutlined />}
            onClick={async () => {
              try {
                message.loading({
                  content: "Đang tạo PDF...",
                  key: `print-${record._id}`,
                });
                const res = await getDetailOrder(record._id);
                const order = res?.data || res;
                if (!order) throw new Error("Không lấy được thông tin vé");

                const ticketId = order.ticketId || order._id || "ticket";
                const qrDataUrl = await QRCodeLib.toDataURL(ticketId);

                const element = document.createElement("div");
                element.style.position = "absolute";
                element.style.left = "-9999px";
                element.style.top = "0";
                element.style.width = "80mm";
                element.style.padding = "10px";
                element.style.background = "#fff";

                const seatsInfo =
                  order.seats
                    ?.map(
                      (seat) =>
                        `${seat.label} (${
                          seat.price
                            ? new Intl.NumberFormat("vi-VN").format(
                                seat.price,
                              ) + "đ"
                            : "-"
                        })`,
                    )
                    .join("<br>") || "Chưa chọn ghế";

                const totalAmount =
                  order.seats?.reduce((s, a) => s + (a.price || 0), 0) ||
                  order.totalAmount ||
                  0;
                const currentTime = dayjs().format("HH:mm - DD/MM/YYYY");

                element.innerHTML = `
                  <div style="font-family: Arial, sans-serif; max-width: 100%;">
                    <div style="text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #ddd; padding-bottom: 10px;">
                      <h2 style="color: #1890ff; margin: 0 0 5px 0; font-size: 20px; text-transform: uppercase;">VÉ XEM PHIM</h2>
                      <div style="font-weight: bold;">${
                        order.cinemaName || "Rạp Chiếu Phim"
                      }</div>
                    </div>
                    <div style="font-size: 16px; font-weight: bold; margin: 10px 0; text-align: center;">${
                      order.movieName || "Chưa có thông tin phim"
                    }</div>
                    <div style="margin: 15px 0; font-size: 13px;">
                      <div style="display: flex; margin-bottom: 8px;">
                        <span style="font-weight: bold; min-width: 80px;">Suất chiếu:</span>
                        <span>${
                          order.startTime
                            ? dayjs(order.startTime).format(
                                "HH:mm - DD/MM/YYYY",
                              )
                            : "Chưa cập nhật"
                        }</span>
                      </div>
                      <div style="display: flex; margin-bottom: 8px;">
                        <span style="font-weight: bold; min-width: 80px;">Phòng:</span>
                        <span>${order.roomName || "Chưa cập nhật"}</span>
                      </div>
                      <div style="display: flex; margin-bottom: 8px;">
                        <span style="font-weight: bold; min-width: 80px;">Ghế:</span>
                        <span>${
                          order.seats?.map((s) => s.label).join(", ") ||
                          "Chưa chọn ghế"
                        }</span>
                      </div>
                      <div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                        <div style="font-weight: bold; margin-bottom: 5px;">CHI TIẾT VÉ</div>
                        <div>${seatsInfo}</div>
                        <div style="font-weight: bold; text-align: right; margin-top: 10px; color: #1890ff;">Tổng cộng: ${new Intl.NumberFormat(
                          "vi-VN",
                        ).format(totalAmount)}đ</div>
                      </div>
                      <div style="text-align: center; margin: 15px 0;">
                        <img src="${qrDataUrl}" alt="Mã QR" style="max-width: 150px; height: auto;" />
                        <div style="font-size: 12px; margin-top: 5px;">Quét mã QR để xác thực vé</div>
                      </div>
                      <div style="text-align: center; font-size: 12px; color: #666; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ddd;">
                        <div>Vui lòng đến rạp trước 15 phút</div>
                        <div>Xuất trình mã QR khi vào rạp</div>
                        <div style="margin-top: 10px; font-style: italic;">Cảm ơn quý khách!</div>
                        <div style="margin-top: 10px; font-size: 11px; color: #999;">
                          <div>Mã giao dịch: ${order.codePayment || "N/A"}</div>
                          <div>Thời gian đặt: ${
                            order.createdAt
                              ? dayjs(order.createdAt).format(
                                  "HH:mm - DD/MM/YYYY",
                                )
                              : ""
                          }</div>
                          <div>Ngày tải vé: ${currentTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                document.body.appendChild(element);

                await new Promise((r) => setTimeout(r, 200));

                const canvas = await html2canvas(element, {
                  scale: 2,
                  useCORS: true,
                  backgroundColor: "#fff",
                });

                const pdf = new jsPDF({
                  orientation: "portrait",
                  unit: "mm",
                  format: [80, 297],
                });
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = 80;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 10;

                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                while (heightLeft >= 0) {
                  position = heightLeft - imgHeight;
                  pdf.addPage();
                  pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight,
                  );
                  heightLeft -= pageHeight;
                }

                const fileName = `ve-xem-phim-${ticketId}.pdf`;
                pdf.save(fileName);
                document.body.removeChild(element);
                message.success({
                  content: "Đã tải xuống vé thành công!",
                  key: `print-${record._id}`,
                });
              } catch (err) {
                console.error(err);
                message.error("Có lỗi khi in vé");
              }
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Danh sách vé</h2>

        <Link to="/admin/ticket/qr">
          <Button type="primary" icon={<QrcodeOutlined />}>
            Quét QR
          </Button>
        </Link>
      </div>

      <FilterOrder />

      <div className="mt-4">
        <Table
          bordered
          loading={isLoading}
          columns={columns}
          dataSource={data?.data || []}
          rowKey={(r) => r?._id || r?.id}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default ListOrder;
