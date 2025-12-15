import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { seatTypeColor } from "../../../../../common/constants";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import { SEAT_STATUS, SEAT_STATUS_COLOR } from "../../../../../common/constants/seat";
import { useMessage } from "../../../../../common/hooks/useMessage";
import { useUnHoldOnBack } from "../../../../../common/hooks/useUnHoldOnBack";
import { getSeatShowtime, toggleSeat, unHoldSeat } from "../../../../../common/services/seat.showtime.service";
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
  const { HandleError, showMessage } = useMessage();
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
        ? { ...rs, bookingStatus: st.bookingStatus, userId: st.userId, price: st.price ?? rs.price }
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

  const canSelectSeatAdjacent = (target) => {
    const isReleasing = target.bookingStatus === SEAT_STATUS.HOLD && target.userId === userId;
    if (isReleasing) return true;
    const current = myHoldSeats || [];
    if (current.length === 0) return true;
    const sameRow = current.every((s) => s.row === target.row);
    if (!sameRow) return false;
    const seats = [...current, target];
    const starts = seats.map((s) => s.col);
    const ends = seats.map((s) => s.col + (s.span || 1) - 1);
    const minStart = Math.min(...starts);
    const maxEnd = Math.max(...ends);
    const totalWidth = seats.reduce((acc, s) => acc + (s.span || 1), 0);
    return maxEnd - minStart + 1 === totalWidth;
  };

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

  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;
    const htmlPrevBg = document.documentElement.style.backgroundColor;
    const rootEl = document.getElementById('root');
    const rootPrevBg = rootEl ? rootEl.style.backgroundColor : undefined;
    document.body.style.backgroundColor = "#0b0b0d";
    document.body.style.color = "#ffffff";
    document.documentElement.style.backgroundColor = "#000000";
    if (rootEl) rootEl.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.color = prevColor;
      document.documentElement.style.backgroundColor = htmlPrevBg;
      if (rootEl && rootPrevBg !== undefined) rootEl.style.backgroundColor = rootPrevBg;
    };
  }, []);

  const MPVLogo = () => (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <rect x="0" y="0" width="120" height="120" rx="12" fill="#ef4444"></rect>
      <text x="60" y="70" fontSize="42" fontWeight="800" textAnchor="middle" fill="#ffffff">MPV</text>
    </svg>
  );

  return (
    <div
      className="min-h-screen mt-12"
      style={{ backgroundColor: "#0f1625", color: "#ffffff" }}
    >
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center flex-col justify-center gap-5 min-h-[40vh]">
            <p className="text-base">Đang tải phòng chiếu</p>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div
              className="rounded-2xl px-6 pt-6 pb-8"
              style={{
                backgroundColor: "#0f1625",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-base text-white">
                  Giờ chiếu: <span className="font-bold text-lg">{hour}</span>
                </p>
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ border: "1px solid #ef4444" }}
                >
                  <p className="text-base text-white">Thời gian chọn ghế:</p>
                  <span className="text-white">
                    <CountTime
                      onTimeout={async () => {
                        try {
                          await unHoldSeat();
                        } catch (err) {
                          HandleError(err, { silent: true });
                        }
                        try {
                          const holds = (seatPayload?.seats || []).filter(
                            (s) => s.bookingStatus === SEAT_STATUS.HOLD && s.userId === userId
                          );
                          if (holds.length) {
                            await Promise.all(
                              holds.map((s) => toggleSeat({ showtimeId, seatId: s._id }))
                            );
                          }
                        } catch (err) {
                          HandleError(err, { silent: true });
                        }
                        showMessage({ type: "warning", title: "Hết thời gian", description: "Đã hủy giữ ghế của bạn" });
                        queryClient.invalidateQueries({
                          predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
                        });
                        setTimeout(() => {
                          window.location.reload();
                        }, 800);
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* SCREEN */}
              <div
                style={{
                  width: `${
                    seatPayload?.cols
                      ? seatPayload.cols * 50 + (seatPayload.cols - 1) * 8 + 30
                      : 600
                  }px`,
                  position: "relative",
                  marginBottom: 24,
                }}
              >
                <div
                  className="text-center font-semibold text-black"
                  style={{
                    height: 48,
                    background:
                      "linear-gradient(to bottom, #fbbf24, #f59e0b)",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
                    clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)",
                  }}
                >
                  MÀN HÌNH
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -8,
                    height: 56,
                    background:
                      "radial-gradient(closest-side at 50% -20px, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(1px)",
                  }}
                />
              </div>
              <div className="text-center font-semibold text-white text-xl mt-2">
                Phòng chiếu {seatPayload?.name || roomId}
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
                          showMessage({ type: "error", title: "Đăng nhập", description: "Vui lòng đăng nhập để chọn ghế" });
                          nav("/auth/login");
                          return;
                        }
                        if (seat.bookingStatus === SEAT_STATUS.HOLD && !isMyHold) return;
                        if (seat.bookingStatus === SEAT_STATUS.BOOKED) return;
                        if (!canSelectSeatAdjacent(seat)) {
                          showMessage({ type: "warning", title: "Chọn ghế", description: "Vui lòng chọn các ghế liền nhau trong cùng hàng" });
                          return;
                        }
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
                      {seat.bookingStatus === SEAT_STATUS.BOOKED || (seat.bookingStatus === SEAT_STATUS.HOLD && !isMyHold) ? (
                        <MPVLogo />
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
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="rounded-md" style={{ width: 40, height: 40, overflow: 'hidden' }}>
              <MPVLogo />
            </div>
            <p>Đã đặt</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: SEAT_STATUS_COLOR.MYHOLD, width: 40, height: 40 }}
            />
            <p>Ghế bạn chọn</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: seatTypeColor.NORMAL, width: 40, height: 40 }}
            />
            <p>Ghế thường</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: seatTypeColor.VIP, width: 40, height: 40 }}
            />
            <p>Ghế VIP</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-md"
              style={{ background: seatTypeColor.COUPLE, width: 40, height: 40 }}
            />
            <p>Ghế đôi</p>
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
              padding: "18px 28px",
              borderRadius: "9999px",
              backgroundColor: "#0f172a",
              color: "#fff",
              border: "1px solid #1f2937",
            }}
          >
            Quay lại
          </Button>

          <Button
            disabled={!myHoldSeats?.length}
            type="primary"
            style={{
              padding: "18px 28px",
              borderRadius: "9999px",
              background: "linear-gradient(to right, #ef4444, #dc2626)",
              border: "none",
              color: "#ffffff",
              fontWeight: 700,
              opacity: 1,
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
