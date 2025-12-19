import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Tag,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { DAYOFWEEK_LABEL } from "../../../../common/constants/dayOfWeek";
import { useMessage } from "../../../../common/hooks/useMessage";
import { getAllMovie } from "../../../../common/services/movie.service";
import { getAllRoom } from "../../../../common/services/room.service";
import { antdInputNumberPropsCurrency } from "../../../../common/utils";
import { createManyShowtime } from "../../../../common/services/showtime.service";
import { formRules } from "../../../../common/utils/formRule";
import { QUERY } from "../../../../common/constants/queryKey";
import { DurationRangePicker } from "../../../../components/DurationRangePicker";

const { RangePicker } = DatePicker;

const CreateMovieShowtime = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { antdMessage, HandleError } = useMessage();
  const [movieResponse, roomResponse] = useQueries({
    queries: [
      {
        queryKey: [QUERY.MOVIE],
        queryFn: () => getAllMovie({ status: true }),
      },
      {
        queryKey: [QUERY.ROOM],
        queryFn: () => getAllRoom({ status: true }),
      },
    ],
  });
  const [form] = Form.useForm();
  const movieSelectForm = Form.useWatch("movieId", form);
  const movieSelected = movieSelectForm
    ? JSON.parse(movieSelectForm.value)
    : {};
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload) => createManyShowtime(payload),

    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERY.SHOWTIME),
      });
    },
    onError: (err) => HandleError(err),
  });
  const handleFinish = async (nav) => {
    const values = await form.validateFields();
    const typeSeat = ["NORMAL", "VIP", "COUPLE"];
    const startDate = dayjs(values.dateRange[0]).format("YYYY-MM-DD");
    const endDate = dayjs(values.dateRange[1]).format("YYYY-MM-DD");
    const normalizeValue = (v) => {
      if (v === undefined || v === null) return 0;
      if (typeof v === "number") return v;

      const digits = String(v).replace(/\D+/g, "");
      return Number(digits) || 0;
    };

    const payload = {
      ...values,
      startDate,
      endDate,
      movieId: JSON.parse(values.movieId.value)._id,
      fixedHour: dayjs(values.fixedHour[0]).format("HH:mm"),
      price: values.price.map((item, index) => ({
        seatType: typeSeat[index],
        value: normalizeValue(item?.value),
      })),
    };
    await mutateAsync(payload);
    if (nav) navigate("/admin/showtimes");
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Tạo mới suất chiếu</h3>
          <p className="text-gray-500">Thêm mới suất chiếu cho phim</p>
        </div>
        <p
          className="text-primary hover:underline cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Quay trở về
        </p>
      </div>

      <Form
        form={form}
        initialValues={{
          price: [
            { seatType: "NORMAL" },
            { seatType: "VIP" },
            { seatType: "COUPLE" },
          ],
        }}
        layout="vertical"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD 1: PHIM & PHÒNG */}
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h4 className="font-medium mb-4">Thông tin suất chiếu</h4>

            <Form.Item
              label="Phim"
              name="movieId"
              required
              rules={[formRules.required("Phim", "choose")]}
            >
              <Select
                showSearch
                labelInValue
                placeholder="Chọn phim"
                optionFilterProp="label"
                options={movieResponse.data?.data.map((item) => ({
                  value: JSON.stringify(item),
                  label: item.name,
                  image: item.poster,
                }))}
                optionRender={(otps) => {
                  const { data: movie } = otps;
                  return (
                    <div className="flex items-center gap-3">
                      <img src={movie.image} className="w-8 h-12 rounded-md" />
                      <p>{movie.label}</p>
                    </div>
                  );
                }}
              />
            </Form.Item>

            <Form.Item
              label="Phòng chiếu"
              name="roomId"
              required
              rules={[formRules.required("Phòng chiếu", "choose")]}
            >
              <Select
                placeholder="Chọn phòng chiếu"
                options={roomResponse.data?.data.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </div>

          {/* CARD 2: GIÁ VÉ */}
          <div className="border rounded-xl p-5 bg-white shadow-sm">
            <h4 className="font-medium mb-4">Giá vé theo loại ghế</h4>

            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Ghế thường"
                name={["price", 0, "value"]}
                rules={[{ required: true, message: "Nhập giá ghế thường" }]}
              >
                <Space.Compact className="w-full">
                  <InputNumber
                    className="w-full"
                    placeholder="Nhập giá"
                    {...antdInputNumberPropsCurrency()}
                  />
                  <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">
                    VND
                  </div>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Ghế VIP"
                name={["price", 1, "value"]}
                rules={[{ required: true, message: "Nhập giá ghế VIP" }]}
              >
                <Space.Compact className="w-full">
                  <InputNumber
                    className="w-full"
                    placeholder="Nhập giá"
                    {...antdInputNumberPropsCurrency(20000)}
                  />
                  <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">
                    VND
                  </div>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="Ghế đôi"
                name={["price", 2, "value"]}
                rules={[{ required: true, message: "Nhập giá ghế đôi" }]}
              >
                <Space.Compact className="w-full">
                  <InputNumber
                    className="w-full"
                    placeholder="Nhập giá"
                    {...antdInputNumberPropsCurrency(30000)}
                  />
                  <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">
                    VND
                  </div>
                </Space.Compact>
              </Form.Item>
            </div>
          </div>

          {/* CARD 3: NGÀY & GIỜ */}
          <div className="border rounded-xl p-5 bg-white shadow-sm lg:col-span-2">
            <h4 className="font-medium mb-4">Lịch chiếu</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Ngày chiếu trong tuần"
                name="dayOfWeeks"
                rules={[formRules.required("Ngày chiếu trong tuần", "choose")]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn ngày"
                  options={[
                    { value: "all", label: "Chọn tất cả" },
                    ...Object.entries(DAYOFWEEK_LABEL).map(([v, label]) => ({
                      value: Number(v),
                      label,
                    })),
                  ]}
                  onChange={(values) => {
                    if (values.includes("all")) {
                      form.setFieldsValue({
                        dayOfWeeks: Object.keys(DAYOFWEEK_LABEL).map((v) =>
                          Number(v),
                        ),
                      });
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Khoảng ngày chiếu"
                name="dateRange"
                rules={[formRules.required("Khoảng ngày chiếu", "choose")]}
              >
                <RangePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Khung giờ chiếu"
                name="fixedHour"
                rules={[formRules.required("Khung giờ", "choose")]}
              >
                <DurationRangePicker
                  disabled={!movieSelected}
                  durationMinutes={movieSelected.duration}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-6">
          <Button disabled={isPending}>Đặt lại</Button>

          <Button
            type="primary"
            loading={isPending}
            disabled={isPending}
            onClick={() => handleFinish()}
          >
            Tạo mới và ở lại
          </Button>

          <Button
            type="primary"
            loading={isPending}
            disabled={isPending}
            onClick={() => handleFinish(true)}
          >
            Tạo mới và trở về
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateMovieShowtime;
