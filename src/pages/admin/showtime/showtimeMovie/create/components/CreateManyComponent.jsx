import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { DAYOFWEEK_LABEL } from "../../../../../../common/constants/dayOfWeek";
import { QUERYKEY } from "../../../../../../common/constants/queryKey";
import { useMessage } from "../../../../../../common/hooks/useMessage";
import { getAllRoom } from "../../../../../../common/services/room.service";
import { createManyShowtime } from "../../../../../../common/services/showtime.service";
import { antdInputNumberPropsCurrency } from "../../../../../../common/utils";
import { formRules } from "../../../../../../common/utils/formRule";
import { DurationRangePicker } from "../../../../../../components/DurationPicker";

const { RangePicker } = DatePicker;

const CreateManyComponent = ({ movie, setOpen }) => {
  const navigate = useNavigate();
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
    mutationFn: (payload) => createManyShowtime(payload),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SHOWTIME),
      });
      setOpen(false);
    },
    onError: (err) => HandleError(err),
  });

  const handleFinish = async (nav) => {
    const values = await form.validateFields();
    const typeSeat = ["NORMAL", "VIP", "COUPLE"];

    const startDate = dayjs(values.dateRange[0]).format("YYYY-MM-DD");
    const endDate = dayjs(values.dateRange[1]).format("YYYY-MM-DD");

    const payload = {
      ...values,
      startDate,
      endDate,
      movieId: movie._id,
      fixedHour: dayjs(values.fixedHour[0]).format("HH:mm"),
      price: values.price.map((item, index) => ({
        ...item,
        seatType: typeSeat[index],
      })),
    };

    await mutateAsync(payload);
    if (nav) navigate("/admin/showtime");
  };

  return (
    <div className="p-4">
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
        className="mt-4!"
      >
        <div className="flex items-center gap-6">
          <Form.Item
            className="flex-1"
            label="Phòng chiếu"
            name="roomId"
            required
            rules={[formRules.required("Phòng chiếu", "choose")]}
          >
            <Select
              placeholder="Chọn phòng chiếu"
              options={roomResponse.data?.data?.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
            />
          </Form.Item>
        </div>

        <div className="flex items-center gap-6">
          <Form.Item
            className="flex-1"
            label="Ghế thường"
            name={["price", 0, "value"]}
            rules={[{ required: true, message: "Nhập giá ghế thường" }]}
          >
            <InputNumber
              addonAfter="VND"
              placeholder="Nhập giá tiền"
              className="w-full!"
              {...antdInputNumberPropsCurrency()}
            />
          </Form.Item>

          <Form.Item
            className="flex-1"
            label="Ghế VIP"
            name={["price", 1, "value"]}
            rules={[{ required: true, message: "Nhập giá ghế VIP" }]}
          >
            <InputNumber
              addonAfter="VND"
              placeholder="Nhập giá tiền"
              className="w-full!"
              {...antdInputNumberPropsCurrency(20000)}
            />
          </Form.Item>

          <Form.Item
            className="flex-1"
            label="Ghế đôi"
            name={["price", 2, "value"]}
            rules={[{ required: true, message: "Nhập giá ghế đôi" }]}
          >
            <InputNumber
              addonAfter="VND"
              placeholder="Nhập giá tiền"
              className="w-full!"
              {...antdInputNumberPropsCurrency(30000)}
            />
          </Form.Item>
        </div>

        <Form.Item
          required
          label="Ngày chiếu trong tuần"
          name="dayOfWeeks"
          rules={[formRules.required("Ngày chiếu trong tuần", "choose")]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn ngày chiếu trong tuần"
            options={[
              { value: "all", label: "Chọn tất cả" },
              ...Object.entries(DAYOFWEEK_LABEL).map(([value, label]) => ({
                value: Number(value),
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

        <div className="flex items-center gap-6">
          <Form.Item
            className="flex-1"
            label="Chọn khoảng ngày chiếu"
            name="dateRange"
            rules={[formRules.required("Khoảng ngày chiếu", "choose")]}
          >
            <RangePicker
              className="w-full"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
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

          <Form.Item
            label="Khung giờ chiếu"
            className="flex-1"
            required
            name="fixedHour"
            rules={[formRules.required("Khung giờ", "choose")]}
          >
            <DurationRangePicker
              disabled={false}
              durationMinutes={movie.duration}
            />
          </Form.Item>
        </div>

        <Form.Item>
          <div className="flex items-center mt-6 gap-4 justify-end">
            <Button disabled={isPending}>Đặt lại</Button>
            <Button
              onClick={() => {
                handleFinish();
              }}
              loading={isPending}
              disabled={isPending}
              type="primary"
              htmlType="submit"
            >
              Tạo mới
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateManyComponent;
