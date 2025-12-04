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
              <div className="mb-12 text-center px-4">
              <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200/20 via-transparent to-transparent rounded-t-full pointer-events-none"></div>
                
                <div className="relative z-10 h-16 md:h-20 lg:h-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl" 
                  style={{
                    borderRadius: '100% 100% 0 0 / 15px',
                    transform: 'perspective(80px) rotateX(4deg)',
                    transformOrigin: 'center bottom',
                    borderBottom: '2px solid rgba(255,255,255,0.1)'
                  }}>
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
                  </div>
                </div>
                
                <div className="relative z-0 mx-auto w-full max-w-2xl h-4 bg-gradient-to-b from-gray-700 to-gray-600 rounded-b-lg shadow-inner">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gray-400 rounded-full"></div>
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="relative z-10 mx-auto w-full max-w-3xl h-1.5 bg-gray-400 rounded-b-md"></div>
                
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5/6 h-3 bg-gradient-to-b from-gray-300/50 to-transparent rounded-full blur-sm"></div>
              </div>
              
              <div className="mt-6">
                <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full shadow-sm">
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MÀN HÌNH CHIẾU PHIM
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="h-1 w-24 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full">
                    <div className="h-full w-1/3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Khoảng cách tối ưu</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto bg-gray-100 rounded-lg p-4">
              <div className="w-full overflow-x-auto">
                <div 
                  className="inline-grid gap-2 p-4 bg-white rounded-lg shadow-inner"
                  style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))`,
                    gridAutoRows: 'minmax(40px, 1fr)',
                    width: '100%',
                    minWidth: '100%',
                  }}
                >{seatsState.map((seat) => (
      <Popconfirm
        key={seat.id}
        onConfirm={() => handleUpdateStatusSeat(seat)}
        title={
          <div className="max-w-[240px]">
            <p className="font-medium mb-1">
              {seat.status
                ? `Khoá ghế ${seat.label}`
                : `Mở khoá ghế ${seat.label}`}
            </p>
            <p className="text-sm text-gray-600">
              {seat.status
                ? "Bạn có chắc chắn muốn khoá ghế này?"
                : "Bạn có chắc chắn mở khoá ghế này?"}
            </p>
          </div>
        }
        okText="Xác nhận"
        cancelText="Huỷ"
        okButtonProps={{ size: "small" }}
        cancelButtonProps={{ size: "small" }}
      >
        <div
          className={`
            flex items-center justify-content-center font-medium
            cursor-pointer rounded-md transition-all
            hover:opacity-90 active:scale-95
          `}
          style={{
            ...getStyleSeatCard(seat),
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        >
          {seat.label}
        </div>
      </Popconfirm>
    ))}
  </div>
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
