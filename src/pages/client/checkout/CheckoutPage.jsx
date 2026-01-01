import {
  CreditCardOutlined,
  HomeOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Spin,
  Tag,
} from "antd";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { QUERYKEY } from "../../../common/constants/queryKey";
import { SEAT_STATUS } from "../../../common/constants/seat";
import { useMessage } from "../../../common/hooks/useMessage";
import { checkoutPayos } from "../../../common/services/checkout.service";
import { getDetailMovie } from "../../../common/services/movie.service";
import { getSeatByRoom } from "../../../common/services/room.service";
import { getSeatShowtime } from "../../../common/services/seat.showtime.service";
import { getDetailShowtime } from "../../../common/services/showtime.service";
import { formatCurrency, getSeatPrice } from "../../../common/utils";
import CountTime from "../../../components/CountTime";
import { useAuthSelector } from "../../../store/useAuthStore";
import dayjs from "dayjs";

const CheckoutPage = () => {
  const [acpPolicy, setAcpPolicy] = useState(false);
  const nav = useNavigate();
  const [form] = Form.useForm();
  const { showtimeId, roomId } = useParams();
  const [searchParams] = useSearchParams();

  const movieId = searchParams.get("movieId");
  const userId = useAuthSelector((s) => s.user?._id);
  const user = useAuthSelector((s) => s.user);
  const { HandleError } = useMessage();

  const { data: roomSeatData } = useQuery({
    queryKey: [QUERYKEY.ROOM, roomId, "seat-map"],
    queryFn: () => getSeatByRoom(roomId),
    enabled: !!roomId,
  });

  const { data: seatStatusRes, isLoading } = useQuery({
    queryKey: [QUERYKEY.SEAT, showtimeId, roomId],
    queryFn: () => getSeatShowtime(roomId, showtimeId, { status: true }),
    enabled: !!showtimeId && !!roomId,
  });

  const { data: movieRes } = useQuery({
    queryKey: ["movie-detail", movieId],
    queryFn: () => getDetailMovie(movieId),
    enabled: !!movieId,
  });

  const { data: showtimeRes } = useQuery({
    queryKey: [QUERYKEY.SHOWTIME, showtimeId],
    queryFn: () => getDetailShowtime(showtimeId),
  });

  const movieName = useMemo(() => {
    const raw = movieRes?.data ?? movieRes;
    if (!raw) return "";
    return raw?.name || raw?.data?.name || "";
  }, [movieRes]);

  const movieDetail = useMemo(() => {
    const raw = movieRes?.data ?? movieRes;
    if (!raw) return null;
    if (raw?.name) return raw;
    if (raw?.data?.name) return raw.data;
    return null;
  }, [movieRes]);

  const seatPayload = useMemo(() => {
    const norm = (payload) => {
      const raw = payload?.data ?? payload;
      if (!raw) return null;
      if (Array.isArray(raw?.seats)) return raw;
      if (Array.isArray(raw)) return { seats: raw };
      if (raw?.seatMap) return { ...raw.seatMap, name: raw?.name };
      return raw;
    };
    const room = norm(roomSeatData);
    const status = norm(seatStatusRes);
    if (!room || !status) return null;
    const m = new Map((status.seats || []).map((s) => [s._id || s.label, s]));
    const seats = (room.seats || []).map((rs) => {
      const st = m.get(rs._id || rs.label);
      return st
        ? {
            ...rs,
            bookingStatus: st.bookingStatus,
            userId: st.userId,
            price: st.price ?? rs.price,
          }
        : rs;
    });
    return {
      ...room,
      name: room?.name || roomSeatData?.data?.name || roomSeatData?.name,
      seats,
    };
  }, [roomSeatData, seatStatusRes]);

  const myHoldSeats = useMemo(
    () =>
      seatPayload?.seats?.filter(
        (s) => s.bookingStatus === SEAT_STATUS.HOLD && s.userId === userId,
      ) || [],
    [seatPayload, userId],
  );

  const total = useMemo(
    () => myHoldSeats.reduce((sum, s) => sum + getSeatPrice(s), 0),
    [myHoldSeats],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => checkoutPayos(payload),
    onSuccess: ({ data }) => {
      window.location.href = data;
    },
    onError: (err) => HandleError(err),
  });

  const handleCheckout = async () => {
    const values = await form.validateFields();
    console.log("Checkout form values:", values);
    
    // Ensure robust fallback for roomName and movieName
    const finalRoomName = roomSeatData?.data?.name || roomSeatData?.name || roomId;
    const finalMovieName = movieName || showtimeRes?.data?.movie?.name || "Unknown Movie";

    const payload = {
      userId,
      showtimeId,
      movieId,
      movieName: finalMovieName,
      roomId,
      roomName: finalRoomName,
      startTime: showtimeRes?.data?.startTime,
      totalAmount: total,
      seats: myHoldSeats.map((item) => ({
        _id: item._id,
        seatId: item._id,
        label: item.label,
        type: item.type,
        price: item.price?.find((p) => p.seatType === item.type)?.value || 0,
      })),
      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/`,
      customerInfo: values.customerInfo,
      email: values.customerInfo?.email,
      phone: values.customerInfo?.phone,
      userName: values.customerInfo?.userName,
    };
    
    console.log("Checkout Payload:", payload);
    mutate(payload);
  };
  return (
    <div className="min-h-[110vh] mt-12 bg-white text-slate-900">
      <div className="max-w-7xl xl:mx-auto mx-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Thanh toán</h1>
            <p className="text-slate-600" style={{ marginBottom: 0 }}>
              Xác nhận thông tin và chọn phương thức thanh toán
            </p>
          </div>
          <CountTime />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Card
                  className="rounded-2xl bg-white"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <p className="text-sm text-slate-600">Thông tin khách hàng</p>
                  <Form
                    initialValues={{ customerInfo: { ...user } }}
                    form={form}
                    layout="vertical"
                  >
                    <Form.Item
                      label="Email"
                      name={["customerInfo", "email"]}
                      rules={[
                        {
                          type: "email",
                          message: "Vui lòng nhập đúng định dạng email",
                        },
                        {
                          required: true,
                          message: "Email không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập email của bạn" />
                    </Form.Item>
                    <Form.Item
                      label="Họ và tên"
                      name={["customerInfo", "userName"]}
                      rules={[
                        {
                          required: true,
                          message: "Họ và tên không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập họ tên của bạn" />
                    </Form.Item>
                    <Form.Item
                      label="Số điện thoại"
                      name={["customerInfo", "phone"]}
                      rules={[
                        {
                          required: true,
                          message: "Số điện thoại không được để trống",
                        },
                        {
                          min: 6,
                          message: "Số điện thoại phải có ít nhất 6 ký tự",
                        },
                        {
                          max: 16,
                          message:
                            "Số điện thoại chỉ được phép nhập tối đa 16 ký tự",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập họ tên của bạn" />
                    </Form.Item>
                  </Form>
                </Card>
                <Card
                  className="rounded-2xl bg-white"
                  style={{ borderColor: "#e5e7eb", marginTop: 20 }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">Thông tin phim</p>
                    <Tag color="red">Đang giữ {myHoldSeats.length} ghế</Tag>
                  </div>
                  <div className="mt-2 space-y-3">
                    <div>
                      <span className="opacity-80">Phim</span>
                      <div className="font-bold text-lg">
                        {movieName || "—"}
                      </div>
                      {movieDetail && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          {movieDetail.age && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold text-slate-600">
                              {movieDetail.age}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                          <ScheduleOutlined className="text-red-500" />
                          <div>
                            <p className="text-slate-600 m-0!">
                              Ngày giờ chiếu
                            </p>
                            <p className="font-bold text-slate-900 m-0!">
                              {dayjs(showtimeRes?.data?.startTime).format(
                                `HH:mm `,
                              )}
                            </p>
                            <p className="font-bold text-slate-900 m-0!">
                              {dayjs(showtimeRes?.data?.startTime).format(
                                `DD/MM/YYYY `,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                          <HomeOutlined className="text-red-500" />
                          <div>
                            <p className="text-slate-600 m-0">Phòng chiếu</p>
                            <p className="font-bold text-slate-900 m-0">
                              {seatPayload?.name ||
                                roomSeatData?.name ||
                                roomId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-slate-200 p-4">
                      <p className="text-slate-600">Ghế đã chọn</p>
                      <p className="font-semibold text-slate-900">
                        {myHoldSeats.map((s) => s.label).join(", ") || "—"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card
                className="rounded-2xl bg-white"
                style={{ borderColor: "#e5e7eb", position: "sticky", top: 24 }}
              >
                <div className="flex items-center gap-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <CreditCardOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 m-0">
                      Phương thức thanh toán
                    </p>
                    <p className="text-xs text-slate-500 m-0">
                      Chọn một phương thức để tiếp tục
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Radio.Group defaultValue="vietqr" className="w-full">
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-200 p-3 hover:border-red-400">
                        <Radio value="vietqr" className="text-slate-900">
                          PAYOS
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                </div>

                <Divider className="mt-6 mb-4" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Thanh toán</span>
                    <span className="font-bold">
                      {formatCurrency(total || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phí</span>
                    <span className="font-bold">0đ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tổng cộng</span>
                    <span className="font-bold">
                      {formatCurrency(total || 0)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <Checkbox
                    onChange={(e) => {
                      setAcpPolicy(e.target.checked);
                    }}
                    className="text-slate-800"
                  >
                    Tôi xác nhận các thông tin đã chính xác và đồng ý với các
                    điều khoản & chính sách
                  </Checkbox>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Button
                    loading={isPending}
                    type="primary"
                    className="flex-1 "
                    style={{
                      height: 44,
                      borderRadius: 9999,
                      border: "none",
                    }}
                    disabled={!myHoldSeats.length || !acpPolicy}
                    onClick={() => {
                      handleCheckout();
                    }}
                  >
                    Thanh toán
                  </Button>
                  <Button onClick={() => nav(-1)} style={{ height: 44 }}>
                    Quay lại
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        <Card
          className="rounded-2xl bg-white"
          style={{ borderColor: "#e5e7eb", marginTop: 20 }}
        >
          <p className="text-sm text-slate-600">Thông tin thanh toán</p>
          <div className="mt-3">
            <div className="grid grid-cols-12">
              <div className="col-span-6">Danh mục</div>
              <div className="col-span-3">Số lượng</div>
              <div className="col-span-3">Tổng tiền</div>
            </div>
            <div className="mt-2 grid grid-cols-12 items-center text-slate-900">
              <div className="col-span-6">
                Ghế ({myHoldSeats.map((s) => s.label).join(", ") || "—"})
              </div>
              <div className="col-span-3">{myHoldSeats.length}</div>
              <div className="col-span-3">{formatCurrency(total || 0)}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
