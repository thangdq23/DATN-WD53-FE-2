import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Input, QRCode, Table } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { DAYOFWEEK_LABEL } from "../../../../common/constants/dayOfWeek";
import { QUERYKEY } from "../../../../common/constants/queryKey";
import { useMessage } from "../../../../common/hooks/useMessage";
import {
  confirmTicket,
  verifyTicket,
} from "../../../../common/services/ticket.service";
import { formatCurrency } from "../../../../common/utils";

const columns = [
  {
    title: "Phòng chiếu",
    dataIndex: "roomName",
  },
  {
    title: "Số vé",
    dataIndex: "ticketCount",
  },
  {
    title: "Ghế",
    dataIndex: "seats",
  },
];

const ScanQR = () => {
  const [status, setStatus] = useState("idle"); 
  const [valueSearch, setValueSearch] = useState("");
  const [data, setData] = useState(null);

  const { antdMessage, HandleError } = useMessage();
  const queryClient = useQueryClient();

  const lastResultRef = useRef(null);
  const scanningRef = useRef(false);
  const timeoutRef = useRef(null);

  const stopCamera = () => {
    const video = document.querySelector("video");
    if (!video?.srcObject) return;
    const stream = video.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  };

  const handleScan = async (result) => {
    const text = Array.isArray(result)
      ? result?.[0]?.rawValue
      : result;

    if (!text) return;
    if (scanningRef.current) return;
    if (lastResultRef.current === text) return;

    scanningRef.current = true;
    lastResultRef.current = text;
    setStatus("scanning");

    try {
      const res = await verifyTicket(text);
      setData(res);
      stopCamera();
      setValueSearch(text.split("-")[1] || "");
    } catch (err) {
      setData(err?.response?.data || null);
      stopCamera();
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      scanningRef.current = false;
      lastResultRef.current = null;
    }, 1000);
  };

  const handleReset = () => {
    setData(null);
    setValueSearch("");
    setStatus("idle");
    scanningRef.current = false;
    lastResultRef.current = null;
  };

  const { mutate, isPending } = useMutation({
  mutationFn: (id) => confirmTicket(id),

  onSuccess: (res) => {
    antdMessage.success(res?.message || "Xác nhận vé thành công");
    setData(null);
    setStatus("idle");
  },

  onError: (err) => {
    HandleError(err);
    setStatus("idle");
  },
});

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopCamera();
    };
  }, []);

  const rowData = data?.data
  ? [
      {
        key: 1,
        roomName: data.data.roomName,
        ticketCount: data.data.seats?.length || 0,
        seats:
  data.data.seats && data.data.seats.length > 0
    ? data.data.seats
        .map(
          (s) =>
            s.seatLabel ||
            (s.row && s.number ? `${s.row}${s.number}` : null)
        )
        .filter(Boolean)
        .join(", ")
    : "—",
      },
    ]
  : [];


  return (
    <div className="bg-[#121822] w-full min-h-[87vh] rounded-md shadow-md px-6 py-4 text-white">
      <div className="flex justify-between">
        <h3 className="text-base mb-4">Quét vé QR</h3>
        <Link to="/admin/ticket" className="text-primary hover:underline">
          Quay về danh sách
        </Link>
      </div>

      <div className="flex items-start gap-12 mt-8">
        <div>
          <div className="w-[350px] h-[350px] bg-black rounded-lg overflow-hidden flex relative items-center justify-center">
            {data ? (
              <div className="flex flex-col gap-4 items-center p-6">
               <QRCode
  value={data?.data?.ticketId || data?.message || "INVALID"}
/>
                <p
                  className={`text-sm text-center ${
                    data.success ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {data.message}
                </p>
                <Button type="primary" onClick={handleReset}>
                  Quét lại
                </Button>
              </div>
            ) : (
              <>
                <Scanner
                  onScan={handleScan}
                  onError={() => {}}
                  constraints={{ facingMode: "environment", aspectRatio: 1 }}
                  classNames={{ video: "object-cover rounded-lg" }}
                />

                {status !== "idle" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                    {status === "scanning" && (
                      <span className="text-blue-400 text-lg font-medium">
                        Đang kiểm tra...
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <p className="my-4 text-center text-gray-400">Hoặc</p>

          <Input.Search
            value={valueSearch}
            onSearch={(e) => handleScan(`MPV-${e}`)}
            onChange={(e) => setValueSearch(e.target.value)}
            prefix="MPV-"
          />
        </div>

        <div className="bg-[#1a1d23] flex-1 p-6 rounded-xl">
          {data && data.data ? (
            <>
              <h2
                className={`text-center text-lg font-semibold ${
                  data.success ? "text-green-500" : "text-red-500"
                }`}
              >
                {data.message}
              </h2>

              <p className="mt-4 uppercase font-bold text-lg">
                {data.data.movieName}
              </p>

              <p className="mt-2">
                Người đặt:{" "}
                <span className="font-semibold">
                  {data.data.customerInfo?.userName}
                </span>
              </p>

              <p className="mt-2">
                Mã vé:{" "}
                <span className="font-semibold uppercase">
                  {data.data.ticketId}
                </span>
              </p>

              <p className="mt-4 text-orange-500 font-semibold">
                {dayjs(data.data.startTime).format("HH:mm")} –{" "}
                {DAYOFWEEK_LABEL[dayjs(data.data.startTime).day()]}{" "}
                {dayjs(data.data.startTime).format("DD/MM/YYYY")}
              </p>

              <div className="mt-4">
                <Table
                  columns={columns}
                  dataSource={rowData}
                  pagination={false}
                  bordered
                />
              </div>

              <div className="flex justify-between mt-4">
                <span>Tổng tiền</span>
               <span className="font-semibold">
             {formatCurrency(data?.data?.totalAmount ?? 0)}
                </span>
              </div>

              {data.success && (
                <div className="mt-4">
                  <Button
                    loading={isPending}
                    onClick={() => mutate(data.data._id)}
                    type="primary"
                    className="w-full h-[45px]"
                  >
                    Xác nhận sử dụng vé
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <p className="font-semibold text-2xl">Vui lòng quét mã</p>
              <p className="text-gray-400">
                Đưa mã QR vào camera để xác thực vé
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
