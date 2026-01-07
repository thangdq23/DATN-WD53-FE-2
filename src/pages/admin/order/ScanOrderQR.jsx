import { useMutation } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Input, QRCode, Table, Alert } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
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
                <>
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
                    <div className="w-56">
                      <Button
                        className="w-full"
                        type="primary"
                        loading={isLoading}
                        onClick={() => mutate(data.data._id)}
                      >
                        Xác nhận sử dụng vé
                      </Button>
                    </div>
                  </div>
                </>
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
