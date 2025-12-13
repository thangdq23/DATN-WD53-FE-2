import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { seatTypeColor } from "../../../../../common/constants";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import { SEAT_STATUS, SEAT_STATUS_COLOR } from "../../../../../common/constants/seat";
import { useMessage } from "../../../../../common/hooks/useMessage";
import { useUnHoldOnBack } from "../../../../../common/hooks/useUnHoldOnBack";
import { getSeatShowtime, toggleSeat } from "../../../../../common/services/seat.showtime.service";
import { getSeatByRoom } from "../../../../../common/services/room.service";
import { useAuthSelector } from "../../../../../store/useAuthStore";
import { getStatusSeat, getStyleSeatCard } from "../../../../../common/utils/seat";
import CountTime from "../../../../../components/CountTime";
import { getSocket } from "../../../../../socket/socket-client";
import { formatCurrency, getSeatPrice } from "../../../../../common/utils";

const SeatPicker = ({ showtimeId: showtimeIdProp, roomId: roomIdProp, hour: hourProp, onClose }) => {
  const nav = useNavigate();
  const { showtimeId: showtimeIdParam, roomId: roomIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const hourParam = searchParams.get("hour");
  const showtimeId = showtimeIdProp || showtimeIdParam;
  const roomId = roomIdProp || roomIdParam;
  const hour = hourProp || hourParam;

  useUnHoldOnBack();

  const userId = useAuthSelector((state) => state.user?._id);
  const { HandleError, antdMessage } = useMessage();
  const queryClient = useQueryClient();
  const socket = getSocket();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SEAT, showtimeId, roomId],
    queryFn: () => getSeatShowtime(roomId, showtimeId, { status: true }),
    enabled: !!showtimeId && !!roomId,
  });

  const { data: roomSeatData } = useQuery({
    queryKey: [QUERYKEY.ROOM, roomId, "seat-map"],
    queryFn: () => getSeatByRoom(roomId),
    enabled: !!roomId,
  });

  const normalizeSeatMap = (payload) => {
    const raw = payload?.data ?? payload;
    if (!raw) return null;
    const parseRC = (seat) => {
      if (seat.row && seat.col) return [seat.row, seat.col];
      const baseLabel = String(seat.label || "").split("-")[0];
      const match = baseLabel.match(/^([A-Z])(\d+)$/i);
      if (match) {
        const r = match[1].toUpperCase().charCodeAt(0) - 64;
        const c = parseInt(match[2], 10);
        return [r, c];
      }
      return [seat.row || 0, seat.col || 0];
    };
    if (Array.isArray(raw.seats)) {
      const normalizedSeats = raw.seats.map((s) => {
        const [r, c] = parseRC(s);
        const isCouple = String(s.label || "").includes("-");
        const type = s.type || (isCouple ? "COUPLE" : "NORMAL");
        const span = s.span ?? (type === "COUPLE" ? 2 : 1);
        const status = typeof s.status === "boolean" ? s.status : true;
        return { ...s, row: r, col: c, type, span, status };
      });
      const rows = raw.rows ?? Math.max(0, ...normalizedSeats.map((s) => s.row || 0));
      const cols = raw.cols ?? Math.max(0, ...normalizedSeats.map((s) => s.col || 0));
      return { ...raw, seats: normalizedSeats, rows, cols };
    }
    if (Array.isArray(raw)) {
      const normalizedSeats = raw.map((s) => {
        const [r, c] = parseRC(s);
        const isCouple = String(s.label || "").includes("-");
        const type = s.type || (isCouple ? "COUPLE" : "NORMAL");
        const span = s.span ?? (type === "COUPLE" ? 2 : 1);
        const status = typeof s.status === "boolean" ? s.status : true;
        return { ...s, row: r, col: c, type, span, status };
      });
      const rows = Math.max(0, ...normalizedSeats.map((s) => s.row || 0));
      const cols = Math.max(0, ...normalizedSeats.map((s) => s.col || 0));
      return { seats: normalizedSeats, rows, cols };
    }
    if (raw.seatMap && Array.isArray(raw.seatMap.seats)) {
      const normalizedSeats = raw.seatMap.seats.map((s) => {
        const [r, c] = parseRC(s);
        const isCouple = String(s.label || "").includes("-");
        const type = s.type || (isCouple ? "COUPLE" : "NORMAL");
        const span = s.span ?? (type === "COUPLE" ? 2 : 1);
        const status = typeof s.status === "boolean" ? s.status : true;
        return { ...s, row: r, col: c, type, span, status };
      });
      const rows = raw.seatMap.rows ?? Math.max(0, ...normalizedSeats.map((s) => s.row || 0));
      const cols = raw.seatMap.cols ?? Math.max(0, ...normalizedSeats.map((s) => s.col || 0));
      return { seats: normalizedSeats, rows, cols };
    }
    return null;
  };

  const mergeRoomWithStatus = (room, status) => {
    if (!room) return status || null;
    const statusByKey = new Map(
      (status?.seats || []).map((s) => [s._id || s.label, s])
    );
    const mergedSeats = (room.seats || []).map((rs) => {
      const key = rs._id || rs.label;
      const st = statusByKey.get(key);
      return st
        ? { ...rs, bookingStatus: st.bookingStatus, userId: st.userId }
        : rs;
    });
    return { ...room, seats: mergedSeats };
  };

  const seatPayload = mergeRoomWithStatus(
    normalizeSeatMap(roomSeatData),
    normalizeSeatMap(data)
  );

  const { mutate } = useMutation({
    mutationFn: (seatId) => toggleSeat({ showtimeId, seatId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
      });
    },
    onError: (err) => HandleError(err),
  });

  const myHoldSeats = seatPayload?.seats.filter(
    (seat) =>
      seat.bookingStatus === SEAT_STATUS.HOLD &&
      seat.userId === userId
  );

  const total = myHoldSeats?.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  useEffect(() => {
    if (!socket) return;

    const updateSeats = () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
      });
    };

    socket.emit("joinShowtime", showtimeId);
    socket.on("seatUpdated", updateSeats);

    return () => {
      socket.off("seatUpdated", updateSeats);
    };
  }, [showtimeId, socket, queryClient]);

  return (
    <div className="min-h-[80vh] mt-12">
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center flex-col justify-center gap-5 min-h-[40vh]">
            <p className="text-base">Đang tải phòng chiếu</p>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-base">
                  Giờ chiếu: <span className="font-bold text-lg">{hour}</span>
                </p>
                <div className="flex items-end">
                  <p className="text-base">Thời gian còn lại:</p>
                  <CountTime />
                </div>
              </div>

              {/* SCREEN */}
              <div
                className="mb-6 text-center font-semibold text-black"
                style={{
                  width: `${
                    seatPayload?.cols
                      ? seatPayload.cols * 50 + (seatPayload.cols - 1) * 8 + 30
                      : 600
                  }px`,
                  height: "40px",
                  background: "linear-gradient(to bottom, #facc15, #eab308)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
                }}
              >
                MÀN HÌNH
              </div>
            </div>

            <div className="flex items-start justify-center gap-3">
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${seatPayload?.rows || 0}, 40px)`,
                  gap: "8px",
                }}
              >
                {Array.from({ length: seatPayload?.rows || 0 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 30,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3af",
                      fontSize: 12,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${seatPayload?.cols || 12}, 40px)`,
                  gridTemplateRows: `repeat(${seatPayload?.rows || 10}, 40px)`,
                  gap: "8px",
                }}
              >
                {seatPayload?.seats?.map((seat) => {
                  const isMyHold = seat.userId === userId;

                  if (seat.combinedWith || seat.status === false) {
                    return null;
                  }

                  return (
                    <div
                      key={seat._id}
                      onClick={() => {
                        if (!userId) {
                          antdMessage.error("Vui lòng đăng nhập để chọn ghế");
                          nav("/auth/login");
                          return;
                        }
                        if (seat.bookingStatus === SEAT_STATUS.HOLD && !isMyHold) return;
                        if (seat.bookingStatus === SEAT_STATUS.BOOKED) return;
                        mutate(seat._id);
                      }}
                      style={{
                        ...getStyleSeatCard(
                          seat,
                          getStatusSeat(seat.bookingStatus, isMyHold)
                        ),
                      }}
                      title={seat.label}
                    >
                      {seat.bookingStatus === SEAT_STATUS.BOOKED ? (
                        <img
                          src="https://res.cloudinary.com/dpplfiyki/image/upload/v1764580281/The%CC%82m_tie%CC%82u_%C4%91e%CC%82%CC%80_lbgdt5.png"
                          alt=""
                        />
                      ) : (
                        seat.label
                      )}
                    </div>
                );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* LEGENDS + TOTAL */}
      <div className="max-w-7xl xl:mx-auto mx-6">
        <p className="mt-6">Tình trạng ghế:</p>

        {/* STATUS LEGENDS */}
        <div className="mt-4 flex gap-4">
          {[
            ["Ghế đã đặt", SEAT_STATUS_COLOR.BOOKED],
            ["Ghế của bạn", SEAT_STATUS_COLOR.MYBOOKED],
          ].map(([label, color], index) => (
            <div className="flex items-center gap-2" key={index}>
              <div
                className="rounded-md"
                style={{
                  backgroundColor: color,
                  width: 40,
                  height: 40,
                  backgroundImage:
                    'url("https://res.cloudinary.com/dpplfiyki/image/upload/v1764580281/The%CC%82m_tie%CC%82u_%C4%91e%CC%82%CC%80_lbgdt5.png")',
                  backgroundSize: "cover",
                }}
              />
              <p>{label}</p>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: SEAT_STATUS_COLOR.HOLD, width: 40, height: 40 }}
            />
            <p>Ghế đang giữ</p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: SEAT_STATUS_COLOR.MYHOLD, width: 40, height: 40 }}
            />
            <p>Ghế bạn đang giữ</p>
          </div>
        </div>

        {/* TYPE LEGENDS */}
        <p className="mt-6">Loại ghế:</p>
        <div className="flex items-center gap-4 mt-4">
          {["NORMAL", "VIP", "COUPLE"].map((type) => (
            <div className="flex items-center gap-2" key={type}>
              <div
                className="rounded-md"
                style={{ background: seatTypeColor[type], width: 40, height: 40 }}
              />
              <p>Ghế {type === "NORMAL" ? "thường" : type}</p>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: "#ef4444", width: 40, height: 40 }}
            />
            <p>Ghế không khả dụng</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between max-w-7xl xl:mx-auto mx-6 mt-8">
        <div>
          <p className="text-lg">
            Ghế đã chọn: {" "}
            <span className="font-semibold">
              {myHoldSeats?.map((item) => item.label).join(", ")}
            </span>
          </p>

          <p className="text-lg">
            Tổng tiền:{" "}
            <span className="font-semibold">
              {formatCurrency(total || 0)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => (onClose ? onClose() : nav(-1))}
            style={{
              padding: "20px 30px",
              borderRadius: "9999px",
            }}
          >
            Quay về
          </Button>

          <Button
            disabled={!myHoldSeats?.length}
            type="primary"
            style={{
              padding: "20px 30px",
              borderRadius: "9999px",
            }}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;
