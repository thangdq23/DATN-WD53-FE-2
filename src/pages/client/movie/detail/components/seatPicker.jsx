import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Spin } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { QUERY, QUERYKEY } from "../../../../../common/constants/queryKey";
import { SEAT_STATUS } from "../../../../../common/constants/seat";
import { useMessage } from "../../../../../common/hooks/useMessage";
import { useUnHoldOnBack } from "../../../../../common/hooks/useUnHoldOnBack";
import {
  extendHoldSeat,
  getSeatShowtime,
  toggleSeat,
  unHoldSeat,
} from "../../../../../common/services/seat.showtime.service";
import { formatCurrency, getSeatPrice } from "../../../../../common/utils";
import CountTime from "../../../../../components/CountTime";
import { getSocket } from "../../../../../socket/socket-client";
import { useAuthSelector } from "../../../../../store/useAuthStore";
import { getDetailShowtime } from "../../../../../common/services/showtime.service";

const SeatPicker = ({
  showtimeId: showtimeIdProp,
  roomId: roomIdProp,
  hour: hourProp,
  showtimeInfo,
}) => {
  const nav = useNavigate();
  const { showtimeId: showtimeIdParam, roomId: roomIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const hourParam = searchParams.get("hour");
  const showtimeId = showtimeIdProp || showtimeIdParam;
  const roomId = roomIdProp || roomIdParam;
  const hour = hourProp || hourParam;
  const movieIdParam = searchParams.get("movieId");

  useUnHoldOnBack();

  const userId = useAuthSelector((state) => state.user?._id);
  const token = useAuthSelector((state) => state.token);
  const { HandleError, showMessage, antdMessage } = useMessage();
  const queryClient = useQueryClient();
  const socket = getSocket();

  useEffect(() => {
    if (!token) {
      antdMessage.warning("Vui lòng đăng nhập để tiếp tục!");
      nav("/auth/login");
    }
  }, [token, nav, antdMessage]);

  if (!token) return null;

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SEAT, showtimeId, roomId],
    queryFn: async () => {
      const { data } = await getSeatShowtime(roomId, showtimeId, {
        status: true,
      });
      return data;
    },
    enabled: !!showtimeId && !!roomId,
  });

  const { mutate: mutateExtendHold, isPending } = useMutation({
    mutationFn: (showtimeId) => extendHoldSeat(showtimeId),
    onSuccess: () => {
      const finalMovieId =
        movieIdParam || showtimeInfo?.movieId?._id || showtimeInfo?.movieId;
      const finalHour =
        hour ||
        (showtimeInfo ? dayjs(showtimeInfo.startTime).format("HH:mm") : "");
      nav(
        `/checkout/${showtimeId}/${roomId}?movieId=${finalMovieId}&hour=${finalHour}`,
      );
    },
  });
  const { data: showtimeResponse } = useQuery({
    queryKey: [QUERY.SHOWTIME, showtimeId],
    queryFn: () => getDetailShowtime(showtimeId),
  });

  const myHoldSeats =
    data?.seats?.filter(
      (seat) =>
        seat.bookingStatus === SEAT_STATUS.HOLD && seat.userId === userId,
    ) || [];

  const total = myHoldSeats?.reduce((sum, seat) => {
    return sum + getSeatPrice(seat);
  }, 0);

  const { mutate } = useMutation({
    mutationFn: (payload) =>
      toggleSeat({
        showtimeId: showtimeId,
        seatId: payload._id,
        row: payload.row,
        col: payload.col,
        roomId: payload.roomId,
        type: payload.type,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
      });
    },
    onError: (err) => HandleError(err),
  });

  const getSeatColorClass = (seat) => {
    const isMyHold = seat.userId === userId;
    if (
      seat.bookingStatus === SEAT_STATUS.BOOKED ||
      (seat.bookingStatus === SEAT_STATUS.HOLD && !isMyHold)
    ) {
      return "bg-gray-200 text-gray-400 cursor-not-allowed";
    }
    if (isMyHold)
      return "bg-red-500 text-white border-red-700 shadow-md shadow-red-200"; // Selected
    if (seat.type === "VIP") return "bg-amber-400 text-white border-amber-500";
    if (seat.type === "COUPLE") return "bg-rose-400 text-white border-rose-500";
    return "bg-white border border-gray-200 text-gray-700 hover:border-red-500"; // Normal
  };
  useEffect(() => {
    const handleSeatUpdate = () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SEAT),
      });
    };
    socket?.emit("joinShowtime", showtimeId);
    socket?.on("seatUpdated", handleSeatUpdate);
    return () => {
      socket?.off("seatUpdated", handleSeatUpdate);
    };
  }, [queryClient, showtimeId, socket]);

  return (
    <div className="min-h-screen bg-slate-50 py-8  font-sans text-slate-900">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN: SCREEN & SEATS */}
        <div className="flex-1 w-full bg-white rounded-3xl shadow-sm p-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                if (movieIdParam) {
                  nav(`/showtime/${movieIdParam}`);
                } else {
                  nav(-1);
                }
              }}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium transition-colors"
            >
              <LeftOutlined />
              <span>Chọn suất chiếu khác</span>
            </button>
          </div>

          {/* Screen Indicator */}
          <div className="mb-12 relative flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl h-2 bg-slate-200 rounded-full mb-2"></div>
            <div
              className="w-full max-w-2xl h-12 bg-linear-to-b from-slate-100 to-white transform -perspective-x"
              style={{
                clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)",
                opacity: 0.5,
              }}
            ></div>
            <span className="absolute top-4 text-sm font-semibold tracking-widest text-slate-400 uppercase">
              Màn hình
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex justify-center gap-4 overflow-x-auto pb-4">
              {/* Row Labels Left */}
              <div className="flex flex-col gap-2 pt-1">
                {Array.from({ length: data?.rows || 0 }, (_, i) => (
                  <div
                    key={`l-${i}`}
                    className="h-9 w-6 flex items-center justify-center text-sm font-semibold text-slate-400"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>

              {/* Seat Grid */}
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${data?.cols || 0}, 36px)`,
                  gridTemplateRows: `repeat(${data?.rows || 0}, 36px)`,
                }}
              >
                {data?.seats?.map((seat) => {
                  if (seat.combinedWith || seat.status === false)
                    return <div key={seat._id} />;

                  const isSold =
                    seat.bookingStatus === SEAT_STATUS.BOOKED ||
                    (seat.bookingStatus === SEAT_STATUS.HOLD &&
                      seat.userId !== userId);

                  return (
                    <button
                      key={seat._id}
                      disabled={isSold}
                      className={`relative h-9 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200 ${getSeatColorClass(
                        seat,
                      )}`}
                      style={{
                        gridRowStart: seat.row,
                        gridColumnStart: seat.col,
                        gridColumnEnd: `span ${seat.span || 1}`,
                      }}
                      onClick={() => {
                        if (
                          seat.bookingStatus === "HOLD" &&
                          seat.userId !== userId
                        )
                          return;
                        if (seat.bookingStatus === "BOOKED") return;
                        mutate(seat);
                      }}
                    >
                      {isSold ? (
                        <span className="text-[10px] font-bold text-red-600">
                          MPV
                        </span>
                      ) : (
                        seat.label
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Row Labels Right */}
              <div className="flex flex-col gap-2 pt-1">
                {Array.from({ length: data?.rows || 0 }, (_, i) => (
                  <div
                    key={`r-${i}`}
                    className="h-9 w-6 flex items-center justify-center text-sm font-semibold text-slate-400"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 border-t pt-8 border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-red-600 font-bold text-[8px]">
                MPV
              </div>
              <span className="text-sm text-slate-500">Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white border border-gray-200"></div>
              <span className="text-sm text-slate-500">Ghế thường</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-400"></div>
              <span className="text-sm text-slate-500">Ghế VIP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-rose-400"></div>
              <span className="text-sm text-slate-500">Ghế đôi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-500"></div>
              <span className="text-sm text-slate-500">Ghế bạn chọn</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING INFO */}
        <div className=" space-y-6">
          {/* Movie Info Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Thông tin suất chiếu
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày chiếu</span>
                <span className="font-bold text-slate-700">
                  {showtimeResponse
                    ? dayjs(showtimeResponse.data.startTime).format(
                        "DD/MM/YYYY",
                      )
                    : "..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giờ chiếu</span>
                <span className="font-bold text-slate-700">
                  {showtimeInfo
                    ? dayjs(showtimeInfo.startTime).format("HH:mm")
                    : hour}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phòng chiếu</span>
                <span className="font-bold text-slate-700">
                  {showtimeResponse?.data?.roomId?.name || "..."}
                </span>
              </div>
            </div>
          </div>

          {/* Timer Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-red-50">
            <span className="text-slate-500 font-medium">
              Thời gian giữ ghế
            </span>
            <span className="text-xl font-bold text-red-600">
              <CountTime
                onTimeout={async () => {
                  await unHoldSeat();
                  showMessage({
                    type: "warning",
                    title: "Hết thời gian",
                    description: "Đã hủy giữ ghế của bạn",
                  });
                  queryClient.invalidateQueries({
                    predicate: ({ queryKey }) =>
                      queryKey.includes(QUERYKEY.SEAT),
                  });
                  setTimeout(() => window.location.reload(), 800);
                }}
              />
            </span>
          </div>

          {/* Booking Info Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                Thông Tin Đặt Vé
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Selected Seats List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">
                      ✓
                    </span>
                    Ghế Đã Chọn
                  </span>
                </div>
                {myHoldSeats?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {myHoldSeats.map((seat) => (
                      <div
                        key={seat._id}
                        className="flex items-center gap-1 bg-red-500 text-white pl-3 pr-1 py-1 rounded-lg shadow-sm shadow-red-200"
                      >
                        <span className="font-bold text-sm">{seat.label}</span>
                        <button
                          onClick={() => mutate(seat)}
                          className="hover:bg-red-600 p-1 rounded-md transition-colors"
                        >
                          <CloseOutlined className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    Chưa chọn ghế nào
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {["NORMAL", "VIP", "COUPLE"].map((type) => {
                  const seatsOfType = myHoldSeats.filter(
                    (s) => s.type === type,
                  );
                  if (seatsOfType.length === 0) return null;
                  const price = getSeatPrice(seatsOfType[0]);
                  return (
                    <div
                      key={type}
                      className="flex justify-between text-slate-600"
                    >
                      <span>
                        {type === "NORMAL"
                          ? "Ghế Thường"
                          : type === "VIP"
                          ? "Ghế VIP"
                          : "Ghế Đôi"}
                        <span className="text-slate-400 mx-2">
                          x {seatsOfType.length}
                        </span>
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(price * seatsOfType.length)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Tạm Tính</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl">
                  <span className="font-bold text-slate-800">Tổng Cộng</span>
                  <span className="font-bold text-red-600 text-xl">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Note */}
              <div className="bg-blue-50 p-3 rounded-xl flex gap-3 items-start">
                <div className="mt-0.5 text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Vui lòng hoàn tất thanh toán trong thời gian giữ ghế để đảm
                  bảo đặt chỗ thành công
                </p>
              </div>

              {/* Action Button */}
              <Button
                type="primary"
                size="large"
                block
                loading={isPending}
                onClick={() => {
                  if (myHoldSeats.length === 0) {
                    showMessage({
                      type: "warning",
                      title: "Thông báo",
                      description: "Vui lòng chọn ghế trước khi thanh toán",
                    });
                    return;
                  }
                  mutateExtendHold(showtimeId);
                }}
                className="bg-red-600 hover:bg-red-700 border-none h-12 rounded-xl text-base font-bold shadow-lg shadow-red-200"
              >
                Tiếp Tục Thanh Toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;
