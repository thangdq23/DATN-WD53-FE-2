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
import { useAuthSelector } from "../../../../../store/useAuthStore";
import { getStatusSeat, getStyleSeatCard } from "../../../../../common/utils/seat";
import CountTime from "../../../../../components/CountTime";
import { getSocket } from "../../../../../socket/socket-client";
import { formatCurrency, getSeatPrice } from "../../../../../common/utils";

const SeatPicker = () => {
  const nav = useNavigate();
  const { showtimeId, roomId } = useParams();
  const [searchParams] = useSearchParams();
  const hour = searchParams.get("hour");

  useUnHoldOnBack();

  const userId = useAuthSelector((state) => state.user?._id);
  const { HandleError, antdMessage } = useMessage();
  const queryClient = useQueryClient();
  const socket = getSocket();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SEAT, showtimeId, roomId],
    queryFn: () => getSeatShowtime(roomId, showtimeId, { status: true }),
  });

  const { mutate } = useMutation({
    mutationFn: (seatId) => toggleSeat({ showtimeId, seatId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
      });
    },
    onError: (err) => HandleError(err),
  });

  const myHoldSeats = data?.data.seats.filter(
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
                  width: `${data?.data.cols * 50 + (data?.data.cols - 1) * 8}px`,
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

            {/* GRID SEAT */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${data?.data.cols}, 40px)`,
                gridTemplateRows: `repeat(${data?.data.rows}, 40px)`,
                gap: "8px",
              }}
            >
              {data?.data.seats.map((seat) => {
                const isMyHold = seat.userId === userId;

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
            Ghế đã chọn:{" "}
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
            onClick={() => nav(-1)}
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
