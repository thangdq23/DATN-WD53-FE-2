import { useMutation } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Input, QRCode, Table, Alert, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCodeLib from "qrcode";
import { Link, useLocation, useNavigate } from "react-router";
import { DAYOFWEEK_LABEL } from "../../../common/constants/dayOfWeek";
import { useMessage } from "../../../common/hooks/useMessage";
import {
  verifyOrderByCode,
  confirmOrder,
} from "../../../common/services/order.service";
import { formatCurrency } from "../../../common/utils";

const columns = [
  { title: "Phòng chiếu", dataIndex: "roomName" },
  { title: "Số vé", dataIndex: "ticketCount" },
  { title: "Ghế", dataIndex: "seats" },
];

const ScanOrderQR = () => {
  const [data, setData] = useState(null);
  const [valueSearch, setValueSearch] = useState("");
  const [lastScanError, setLastScanError] = useState(null);
  const scanningRef = useRef(false);
  const { antdMessage, HandleError } = useMessage();

  const printRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const stopCamera = () => {
    const video = document.querySelector("video");
    if (!video?.srcObject) return;
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };

  const handleScan = async (result) => {
    const raw = Array.isArray(result) ? result?.[0]?.rawValue : result;
    const code = raw ? String(raw).trim() : raw;

    if (!code || scanningRef.current) return;
    scanningRef.current = true;

    try {
      const res = await verifyOrderByCode(code);
      console.debug("verifyOrder response:", res);

      const root = res || {};
      const payload = root.data || root;
      const scanStatus =
        (payload && payload.scanStatus) || root.scanStatus || null;
      const order = (payload && payload.order) || payload || null;

      if (scanStatus && scanStatus !== "OK") {
        const map = {
          INVALID: "QR sai / không tồn tại",
          NOT_PAID: "Vé chưa thanh toán",
          EXPIRED: "Showtime đã kết thúc",
          USED: "Vé đã quét rồi",
          CANCELLED: "Vé đã bị hủy",
        };
        const message = map[scanStatus] || "Vé không hợp lệ";
        antdMessage.error(message);
        setLastScanError(message);
        // allow immediate re-scan
        scanningRef.current = false;
        return;
      }

      if (!order) {
        const message = "Không tìm thấy vé / đơn hàng với mã này";
        antdMessage.error(message);
        setLastScanError(message);
        // allow immediate re-scan
        scanningRef.current = false;
        return;
      }

      setLastScanError(null);
      setData({ data: order });
      setValueSearch(code.replace("MPV-", ""));
      stopCamera();
    } catch (err) {
      HandleError(err);
    } finally {
      setTimeout(() => {
        scanningRef.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const code = sp.get("code");
    if (code) handleScan(code);
  }, [location.search]);

  const { mutate, isLoading } = useMutation({
    mutationFn: confirmOrder,
    onSuccess: () => {
      antdMessage.success("Xác nhận sử dụng vé thành công");
      navigate("/admin/ticket");
    },
    onError: HandleError,
  });

  const rowData = data?.data
    ? [
        {
          key: 1,
          roomName: data.data.roomName,
          ticketCount: data.data.seats?.length || 0,
          seats: data.data.seats?.map((s) => s.label).join(", "),
        },
      ]
    : [];

  return (
    <div className="min-h-[87vh] bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Quét vé QR</h1>
            <p className="text-sm text-gray-500">
              Đưa mã QR vào khung để kiểm tra vé
            </p>
          </div>
          <Link to="/admin/ticket" className="text-sm text-blue-600">
            Quay về danh sách
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <div className="h-[360px] border-2 border-dashed border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
              {data?.data ? (
                <div className="flex flex-col items-center gap-3">
                  <QRCode value={data.data.ticketId} />
                  <Button
                    onClick={() => {
                      setData(null);
                      setValueSearch("");
                      setLastScanError(null);
                    }}
                  >
                    Quét lại
                  </Button>
                </div>
              ) : (
                <div style={{ width: "100%", height: "100%" }}>
                  <Scanner
                    onScan={handleScan}
                    constraints={{ facingMode: "environment" }}
                    styles={{ container: { width: "100%", height: "100%" } }}
                  />
                </div>
              )}
            </div>

            {lastScanError && (
              <div className="mt-4">
                <Alert type="error" message={lastScanError} showIcon />
              </div>
            )}

            <Input.Search
              className="mt-4"
              prefix="MPV-"
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value)}
              onSearch={(v) => handleScan(`MPV-${v}`)}
              placeholder="Nhập mã vé (xxxx)"
            />
          </div>

          <div className="col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {data?.data ? (
                <div ref={printRef}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {data.data.movieName}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Người đặt: {data.data.customerInfo?.userName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Mã vé:{" "}
                        <span className="font-mono">{data.data.ticketId}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Buổi chiếu</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {dayjs(data.data.startTime).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Table
                      columns={columns}
                      dataSource={rowData}
                      pagination={false}
                      bordered
                    />
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(data.data.totalAmount)}
                      </p>
                    </div>
                    <div className="w-56 flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={async () => {
                          try {
                            message.loading({
                              content: "Đang tạo vé...",
                              key: "print-ticket",
                            });
                            const order = data.data;
                            if (!order)
                              throw new Error("Không có thông tin vé");

                            const ticketId =
                              order.ticketId || order._id || "ticket";
                            const qrDataUrl = await QRCodeLib.toDataURL(
                              ticketId,
                            );

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
                                  (s) =>
                                    `${s.label} (${
                                      s.price
                                        ? new Intl.NumberFormat("vi-VN").format(
                                            s.price,
                                          ) + "đ"
                                        : "-"
                                    })`,
                                )
                                .join("<br>") || "Chưa chọn ghế";
                            const totalAmount =
                              order.seats?.reduce(
                                (s, a) => s + (a.price || 0),
                                0,
                              ) ||
                              order.totalAmount ||
                              0;
                            const currentTime =
                              dayjs().format("HH:mm - DD/MM/YYYY");

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
                                    <span>${
                                      order.roomName || "Chưa cập nhật"
                                    }</span>
                                  </div>
                                  <div style="display: flex; margin-bottom: 8px;">
                                    <span style="font-weight: bold; min-width: 80px;">Ghế:</span>
                                    <span>${
                                      order.seats
                                        ?.map((s) => s.label)
                                        .join(", ") || "Chưa chọn ghế"
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
                                      <div>Mã giao dịch: ${
                                        order.codePayment || "N/A"
                                      }</div>
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
                            const imgHeight =
                              (canvas.height * imgWidth) / canvas.width;
                            let heightLeft = imgHeight;
                            let position = 10;
                            pdf.addImage(
                              imgData,
                              "PNG",
                              0,
                              position,
                              imgWidth,
                              imgHeight,
                            );
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
                            const fileName = `${
                              order.ticketId || "ticket"
                            }.pdf`;
                            pdf.save(fileName);
                            document.body.removeChild(element);
                            message.success({
                              content: "Đã tải xuống vé thành công!",
                              key: "print-ticket",
                            });
                          } catch (err) {
                            console.error(err);
                            message.error("Có lỗi khi tạo vé");
                          }
                        }}
                      >
                        In vé
                      </Button>
                      <Button
                        className="flex-1"
                        type="primary"
                        loading={isLoading}
                        onClick={() => mutate(data.data._id)}
                      >
                        Xác nhận sử dụng vé
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  Chưa có vé được quét. Hãy đưa mã QR vào khung bên trái hoặc
                  nhập mã để tìm.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanOrderQR;
