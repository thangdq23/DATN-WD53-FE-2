import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Space,
} from "antd";
import {
  VideoCameraOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UndoOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { QUERYKEY } from "../../../../../../common/constants/queryKey";
import { useMessage } from "../../../../../../common/hooks/useMessage";
import { getAllRoom } from "../../../../../../common/services/room.service";
import { createShowtime } from "../../../../../../common/services/showtime.service";
import { antdInputNumberPropsCurrency } from "../../../../../../common/utils";
import { formRules } from "../../../../../../common/utils/formRule";
import { DurationRangePicker } from "../../../../../../components/DurationPicker";

const CreateOneComponent = ({ movie, setOpen }) => {
  const queryClient = useQueryClient();
  const { antdMessage, HandleError } = useMessage();

  const [roomResponse] = useQueries({
    queries: [
      {
        queryKey: [QUERYKEY.ROOM],
        queryFn: () => getAllRoom({ status: true }),
      },
    ],
  });

  const [form] = Form.useForm();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload) => createShowtime(payload),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SHOWTIME),
      });
      setOpen(false);
    },
    onError: (err) => HandleError(err),
  });

  const handleFinish = async () => {
    const values = await form.validateFields();
    const typeSeat = ["NORMAL", "VIP", "COUPLE"];

    const normalizeValue = (v) => {
      if (v === undefined || v === null) return 0;
      if (typeof v === "number") return v;
      const digits = String(v).replace(/\D+/g, "");
      return Number(digits) || 0;
    };

    const payload = {
      ...values,
      movieId: movie._id,
      startTime: dayjs(values.dateTime)
        .set("hour", values.fixedHour[0].hour())
        .set("minute", values.fixedHour[0].minute())
        .format(),
      price: values.price.map((item, index) => ({
        seatType: typeSeat[index],
        value: normalizeValue(item?.value),
      })),
    };

    await mutateAsync(payload);
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="mt-4 rounded-3xl bg-gradient-to-b from-orange-50 via-rose-50 to-white px-5 py-6 shadow-lg">
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
        className="space-y-6 [&_.ant-form-item-label>label]:text-slate-800"
      >
        {/* PHÒNG CHIẾU */}
        <div className="rounded-2xl border border-orange-100 bg-white/90 px-4 py-4 shadow-sm md:px-5 md:py-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500">
              <VideoCameraOutlined />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Phòng chiếu <span className="text-red-500">*</span>
            </p>
          </div>

          <Form.Item
            className="mb-0"
            label={null}
            name="roomId"
            rules={[formRules.required("Phòng chiếu", "choose")]}
          >
            <Select
              placeholder="Chọn phòng chiếu"
              className="w-full"
              options={roomResponse.data?.data?.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
            />
          </Form.Item>
        </div>

        {/* BẢNG GIÁ VÉ */}
        <div className="rounded-2xl border border-amber-100 bg-white/90 px-4 py-4 shadow-sm md:px-5 md:py-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-500">
              <DollarCircleOutlined />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Bảng giá vé <span className="text-red-500">*</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              className="flex-1"
              label="Ghế thường"
              name={["price", 0, "value"]}
              rules={[{ required: true, message: "Nhập giá ghế thường" }]}
            >
              <Space.Compact className="w-full">
                <InputNumber className="w-full" placeholder="Nhập giá tiền" {...antdInputNumberPropsCurrency()} />
                <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">VND</div>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              className="flex-1"
              label="Ghế VIP"
              name={["price", 1, "value"]}
              rules={[{ required: true, message: "Nhập giá ghế VIP" }]}
            >
              <Space.Compact className="w-full">
                <InputNumber className="w-full" placeholder="Nhập giá tiền" {...antdInputNumberPropsCurrency(20000)} />
                <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">VND</div>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              className="flex-1"
              label="Ghế đôi"
              name={["price", 2, "value"]}
              rules={[{ required: true, message: "Nhập giá ghế đôi" }]}
            >
              <Space.Compact className="w-full">
                <InputNumber className="w-full" placeholder="Nhập giá tiền" {...antdInputNumberPropsCurrency(30000)} />
                <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">VND</div>
              </Space.Compact>
            </Form.Item>
          </div>
        </div>

        {/* NGÀY CHIẾU */}
        <div className="rounded-2xl border border-violet-100 bg-white/90 px-4 py-4 shadow-sm md:px-5 md:py-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-500">
              <CalendarOutlined />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Ngày chiếu <span className="text-red-500">*</span>
            </p>
          </div>

          <Form.Item
            className="mb-0"
            label={null}
            name="dateTime"
            rules={[formRules.required("Ngày chiếu", "choose")]}
          >
            <DatePicker
              className="w-full"
              placeholder="dd/mm/yyyy"
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                if (!current) return false;
                const tomorrow = dayjs().add(1, "day").startOf("day");
                const releaseDate = dayjs(movie.releaseDate).startOf("day");
                const minDate = releaseDate.isAfter(tomorrow)
                  ? releaseDate
                  : tomorrow;
                const currentDay = current.startOf("day");
                return currentDay.isBefore(minDate);
              }}
            />
          </Form.Item>
        </div>

        {/* KHUNG GIỜ CHIẾU */}
        <div className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-4 shadow-sm md:px-5 md:py-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <ClockCircleOutlined />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Khung giờ chiếu <span className="text-red-500">*</span>
            </p>
          </div>

          <Form.Item
            className="mb-0"
            label={null}
            name="fixedHour"
            required
            rules={[formRules.required("Khung giờ", "choose")]}
          >
            <DurationRangePicker
              disabled={false}
              durationMinutes={movie.duration}
            />
          </Form.Item>
        </div>

        {/* BUTTONS */}
        <Form.Item className="mb-0">
          <div className="mt-2 flex items-center justify-end gap-4">
            <Button
              onClick={handleReset}
              disabled={isPending}
              className="flex items-center gap-2 border-slate-300 px-6 py-2 text-slate-700"
            >
              <UndoOutlined />
              Đặt lại
            </Button>
            <Button
              onClick={handleFinish}
              loading={isPending}
              disabled={isPending}
              type="primary"
              htmlType="submit"
              className="flex items-center gap-2 border-none bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 font-semibold shadow-md hover:from-orange-600 hover:to-red-600"
            >
              <PlusCircleOutlined />
              Tạo suất chiếu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateOneComponent;
