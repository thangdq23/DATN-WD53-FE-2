import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEY } from "../../../../../common/constants/queryKey";
import { getAllRoom } from "../../../../../common/services/room.service";
import { antdInputNumberPropsCurrency } from "../../../../../common/utils";
import { formRules } from "../../../../../common/utils/formRule";
import { DurationRangePicker } from "../../../../../components/DurationPicker";
import { SHOWTIME_STATUS } from "../../../../../common/constants/showtime";
import { updateShowtime } from "../../../../../common/services/showtime.service";
import { useMessage } from "../../../../../common/hooks/useMessage";

const ModalUpdateShowtime = ({ children, showtime }) => {
  const { antdMessage, HandleError } = useMessage();
  const [open, setOpen] = useState(false);

  const roomResponse = useQuery({
    queryKey: [QUERYKEY.ROOM],
    queryFn: () => getAllRoom({ status: true }),
  });

  const [form] = Form.useForm();

  const start = dayjs(showtime.startTime);
  const end = start.add(showtime.movieId.duration, "minutes");

  const dateSelected = Form.useWatch("dateTime", form);
  const status = Form.useWatch("status", form);

  const getStatusShowtime = () => {
    switch (showtime.status) {
      case SHOWTIME_STATUS.CANCELLED:
        return SHOWTIME_STATUS.CANCELLED;
      case SHOWTIME_STATUS.SOLD_OUT:
        return SHOWTIME_STATUS.SOLD_OUT;
      default:
        return SHOWTIME_STATUS.SCHEDULED;
    }
  };

  const initialValues = {
    roomId: showtime?.roomId?._id,
    dateTime: dayjs(showtime.startTime),
    price: showtime.price.map((item) => ({ value: item.value })),
    fixedHour: [start, end],
    status: getStatusShowtime(),
    cancelDescription: showtime.cancelDescription ?? "",
  };

  const disabledTimeHandler = () => {
    if (!dateSelected) return {};
    const now = dayjs();
    const isToday = dayjs(dateSelected).isSame(now, "day");
    if (!isToday) return {};
    const oneHourLater = now.add(1, "hour");

    return {
      disabledHours: () => {
        const h = oneHourLater.hour();
        return Array.from({ length: h }, (_, i) => i);
      },
      disabledMinutes: (hour) => {
        const h = oneHourLater.hour();
        const m = oneHourLater.minute();
        if (hour < h) return Array.from({ length: 60 }, (_, i) => i);
        if (hour === h) return Array.from({ length: m }, (_, i) => i);
        return [];
      },
    };
  };

  const queryClient = useQueryClient();

  // Chuẩn hoá id chắc chắn là string
  const showtimeId = String(showtime?._id?.id || showtime?._id);
  console.log("🔥 ID SAU KHI CHUẨN HOÁ =", showtimeId);

  const { mutate, isLoading } = useMutation({
    mutationFn: (payload) => {
      console.log(">>> GỌI API updateShowtime VỚI:", {
        id: showtimeId,
        payload,
      });
      return updateShowtime(showtimeId, payload);
    },
    onSuccess({ message }) {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERYKEY.SHOWTIME),
      });
      setOpen(false);
    },
    onError: (err) => {
      console.error("❌ LỖI API updateShowtime:", err);
      HandleError(err);
    },
  });

  const onFinish = (values) => {
    const typeSeat = ["NORMAL", "VIP", "COUPLE"];

    // Loại bỏ _id / id ra khỏi payload, tránh backend hiểu nhầm
    const { _id: _OMIT_ID, id: _OMIT_ID_ALT, movieId: _OMIT_MOVIEID, ...rest } = values;

    const payload = {
      ...rest,
      startTime: dayjs(values.dateTime)
        .set("hour", values.fixedHour[0].hour())
        .set("minute", values.fixedHour[0].minute())
        .format(),
      endTime: dayjs(values.dateTime)
        .set("hour", values.fixedHour[1].hour())
        .set("minute", values.fixedHour[1].minute())
        .format(),
      price: values.price.map((item, index) => ({
        ...item,
        seatType: typeSeat[index],
      })),
      cancelDescription:
        values.status === SHOWTIME_STATUS.CANCELLED
          ? values.cancelDescription
          : "",
    };

    console.log(">>> PAYLOAD GỬI LÊN BACKEND =", payload);
    mutate(payload);
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          form.setFieldsValue(initialValues);
          setOpen(true);
        },
      })}

      <Modal
        afterOpenChange={() => form.resetFields()}
        open={open}
        onCancel={() => setOpen(false)}
        width={900}
        title={
          <div className="flex flex-col gap-2">
            <p>
              Cập nhật lịch chiếu{" "}
              {dayjs(showtime.startTime).format(
                "HH:mm [ngày] DD [tháng] MM [năm] YYYY"
              )}
            </p>
            <p className="text-gray-500/80">Phim {showtime.movieId.name}</p>
          </div>
        }
        className="rounded-xl border border-white/10 backdrop-blur-md"
        style={{
          background: `hsl(222.2 84% 4.9%)`,
        }}
        footer={null}
      >
        <div className="mt-4">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={(err) =>
              console.log("❌ FORM VALIDATE FAIL:", err)
            }
            initialValues={initialValues}
          >
            <Form.Item label="Phòng chiếu" name="roomId" required>
              <Select
                placeholder="Chọn phòng chiếu"
                options={roomResponse.data?.data.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
              />
            </Form.Item>

            <div className="flex items-center gap-6">
              <Form.Item
                className="flex-1"
                label="Ghế thường"
                name={["price", 0, "value"]}
                rules={[{ required: true, message: "Nhập giá ghế thường" }]}
              >
                <Space.Compact className="w-full">
                  <InputNumber className="w-full" {...antdInputNumberPropsCurrency()} />
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
                  <InputNumber className="w-full" {...antdInputNumberPropsCurrency(20000)} />
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
                  <InputNumber className="w-full" {...antdInputNumberPropsCurrency(30000)} />
                  <div className="px-3 h-10 flex items-center border border-solid border-[#d9d9d9] rounded-r-md bg-[#f5f5f5]">VND</div>
                </Space.Compact>
              </Form.Item>
            </div>

            <div className="flex items-center gap-6">
              <Form.Item
                className="flex-1"
                label="Chọn ngày chiếu"
                name="dateTime"
                rules={[formRules.required("Ngày chiếu", "choose")]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Ngày chiếu"
                  disabledDate={(current) => {
                    if (!current) return false;
                    const tomorrow = dayjs().add(1, "day").startOf("day");
                    const releaseDate = dayjs(
                      showtime.movieId.releaseDate
                    ).startOf("day");
                    const minDate = releaseDate.isAfter(tomorrow)
                      ? releaseDate
                      : tomorrow;
                    const currentDay = current.startOf("day");
                    return currentDay.isBefore(minDate);
                  }}
                />
              </Form.Item>

              <Form.Item
                className="flex-1"
                label="Khung giờ chiếu"
                name="fixedHour"
                rules={[formRules.required("Khung giờ", "choose")]}
              >
                <DurationRangePicker
                  value={form.getFieldValue("fixedHour")}
                  onChange={(val) => form.setFieldsValue({ fixedHour: val })}
                  durationMinutes={showtime.movieId.duration}
                  disabledTime={disabledTimeHandler}
                />
              </Form.Item>
            </div>

            <Form.Item label="Trạng thái suất chiếu" name="status" required>
              <Select
                options={[
                  {
                    label: "Lịch chiếu bình thường",
                    value: SHOWTIME_STATUS.SCHEDULED,
                  },
                  {
                    label: "Đã bán hết",
                    value: SHOWTIME_STATUS.SOLD_OUT,
                  },
                  {
                    label: "Huỷ suất chiếu",
                    value: SHOWTIME_STATUS.CANCELLED,
                  },
                ]}
              />
            </Form.Item>

            {status === SHOWTIME_STATUS.CANCELLED && (
              <Form.Item
                label="Lý do huỷ suất"
                name="cancelDescription"
                rules={[
                  { required: true, message: "Nhập lý do huỷ suất chiếu" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập lý do huỷ suất chiếu..."
                />
              </Form.Item>
            )}

            <div className="flex justify-end gap-4">
              <Button onClick={() => form.setFieldsValue(initialValues)}>
                Đặt lại
              </Button>

              <Button type="primary" htmlType="submit" loading={isLoading}>
                Cập nhật
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateShowtime;
