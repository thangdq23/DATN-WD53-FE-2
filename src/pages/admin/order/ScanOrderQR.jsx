import { useMutation } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Input, QRCode, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
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
  const scanningRef = useRef(false);
  const { antdMessage, HandleError } = useMessage();

  const location = useLocation();

  const stopCamera = () => {
    const video = document.querySelector("video");
    if (!video?.srcObject) return;
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };

  const handleScan = async (result) => {
    const code = Array.isArray(result) ? result?.[0]?.rawValue : result;

    if (!code || scanningRef.current) return;
    scanningRef.current = true;

    try {
      const res = await verifyOrderByCode(code);

      // verifyOrderByCode đã normalize về { data: order }
      if (!res?.data) {
        antdMessage.error("Không tìm thấy vé / đơn hàng với mã này");
        return;
      }

      setData(res);
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

  // Nếu từ ListOrder click qua có ?code=MPV-xxxx thì auto verify
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const code = sp.get("code");
    if (code) handleScan(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const { mutate, isLoading } = useMutation({
    mutationFn: confirmOrder,
    onSuccess: () => {
      antdMessage.success("Xác nhận sử dụng vé thành công");
      setData(null);
      setValueSearch("");
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
    <div className="bg-[#121822] min-h-[87vh] rounded-md p-6 text-white">
      <div className="flex justify-between mb-4">
        <h3>Quét vé QR</h3>
        <Link to="/admin/ticket">Quay về danh sách</Link>
      </div>

      <div className="flex gap-10 flex-wrap">
        {/* SCAN */}
        <div>
          <div className="w-[320px] h-[320px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {data?.data ? (
              <div className="flex flex-col items-center gap-3">
                <QRCode value={data.data.ticketId} />
                <Button
                  onClick={() => {
                    setData(null);
                    setValueSearch("");
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

          <Input.Search
            className="mt-4"
            prefix="MPV-"
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value)}
            onSearch={(v) => handleScan(`MPV-${v}`)}
            placeholder="Nhập mã vé (xxxx)"
          />
        </div>

        {/* INFO */}
        {data?.data && (
          <div className="flex-1 bg-[#1a1d23] p-6 rounded-xl min-w-[320px]">
            <h2 className="text-green-500 text-lg font-semibold mb-2">
              Vé hợp lệ
            </h2>

            <p className="font-bold text-lg">{data.data.movieName}</p>
            <p>Người đặt: {data.data.customerInfo?.userName}</p>
            <p>Mã vé: {data.data.ticketId}</p>

            <p className="text-orange-400 mt-2">
              {dayjs(data.data.startTime).format("HH:mm")} –{" "}
              {DAYOFWEEK_LABEL[dayjs(data.data.startTime).day()]}{" "}
              {dayjs(data.data.startTime).format("DD/MM/YYYY")}
            </p>

            <Table
              className="mt-4"
              columns={columns}
              dataSource={rowData}
              pagination={false}
              bordered
            />

            <div className="flex justify-between mt-4">
              <span>Tổng tiền</span>
              <span className="font-bold">
                {formatCurrency(data.data.totalAmount)}
              </span>
            </div>

            <Button
              className="mt-4 w-full"
              type="primary"
              loading={isLoading}
              onClick={() => mutate(data.data._id)}
            >
              Xác nhận sử dụng vé
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanOrderQR;
