import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Popconfirm, Spin, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { seatTypeColor } from "../../../../common/constants";
import { QUERY } from "../../../../common/constants/queryKey";
import { useMessage } from "../../../../common/hooks/useMessage";
import {
  getSeatByRoom,
  updateRoom,
} from "../../../../common/services/room.service";
import { formRules } from "../../../../common/utils/formRule";
import {
  generatePreviewSeats,
  getStyleSeatCard,
} from "../../../../common/utils/seat";

const UpdateRoom = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const { HandleError, antdMessage } = useMessage();
  const { seats, cols, rows, totalSeats } = generatePreviewSeats();
  const [seatsState, setSeatState] = useState(seats);
  const handleUpdateStatusSeat = (seat) => {
    setSeatState((prevSeats) =>
      prevSeats.map((item) =>
        item.label === seat.label ? { ...item, status: !item.status } : item,
      ),
    );
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => updateRoom(id, payload),
    onSuccess: ({ message }) => {
      antdMessage.success(message);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERY.ROOM),
      });
      nav("/admin/rooms");
    },
    onError: (err) => HandleError(err),
  });
  const handleSubmit = (values) => {
    mutate({ ...values, cols, rows, capacity: totalSeats, seats: seatsState });
  };
  const { data, isLoading } = useQuery({
    queryKey: [QUERY.ROOM, id],
    queryFn: async () => {
      const { data } = await getSeatByRoom(id);
      return data;
    },
  });
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      setSeatState(data.seats);
    }
  }, [data, form]);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cập nhật phòng chiếu #{id}</h3>
        <Link to={"/admin/rooms"}>Quay về danh sách</Link>
      </div>
      {!isLoading ? (
        <div className="mt-4">
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <div className="flex-1">
              <Form.Item
                required
                name={"name"}
                label="Tên phòng chiếu"
                rules={[
                  formRules.required("Tên phòng chiếu"),
                  formRules.textRange("Tên phòng chiếu", 3, 20),
                ]}
              >
                <Input
                  placeholder="Nhập tên phòng chiếu"
                  style={{ height: 35 }}
                />
              </Form.Item>
              <Form.Item
                name={"description"}
                label="Mô tả phòng chiếu"
                rules={[formRules.textRange("Mô tả phòng chiếu", 3, 200)]}
              >
                <TextArea placeholder="Nhập mô tả phòng chiếu" rows={5} />
              </Form.Item>
            </div>
            <div>
              <label className="font-normal" htmlFor="">
                Ghế ngồi ({totalSeats} ghế)
              </label>
              <div className="flex flex-col gap-4 items-center">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 40px)`,
                    gridTemplateRows: `repeat(${rows}, 40px)`,
                    gap: "8px",
                  }}
                  className="mt-6"
                >
                  {seatsState.map((seat) => (
                    <Popconfirm
                      onConfirm={() => handleUpdateStatusSeat(seat)}
                      title={
                        seat.status
                          ? `Khoá ghế ${seat.label}`
                          : `Mở khoá ghế ${seat.label}`
                      }
                      description={
                        seat.status
                          ? "Bạn có chắc chắn khoá ghế này lại?"
                          : "Bạn có chắc chắn mở khoá ghế này?"
                      }
                    >
                      <div style={{ ...getStyleSeatCard(seat) }}>
                        {seat.label}
                      </div>
                    </Popconfirm>
                  ))}
                </div>
                <div>
                  <Tag color={seatTypeColor["NORMAL"]}>Ghế thường</Tag>
                  <Tag color={seatTypeColor["VIP"]}>Ghế vip</Tag>
                  <Tag color={seatTypeColor["COUPLE"]}>Ghế đôi</Tag>
                  <Tag color={"#ef4444"}>Ghế bị khoá</Tag>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6 mt-6">
              <Button
                disabled={isPending}
                onClick={() => {
                  form.setFieldsValue(data);
                  setSeatState(data?.seats);
                }}
                style={{ width: 150, height: 35 }}
              >
                Đặt lại
              </Button>
              <Button
                disabled={isPending}
                loading={isPending}
                style={{ width: 150, height: 35 }}
                htmlType="submit"
                type="primary"
              >
                Cập nhật
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="min-h-[60vh] flex justify-center items-center">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default UpdateRoom;
