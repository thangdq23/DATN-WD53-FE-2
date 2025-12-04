import { FileAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, Popconfirm, Table, Tag } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  generatePreviewSeats,
  getStyleSeatCard,
} from "../../../../common/utils/seat";
import { formRules } from "../../../../common/utils/formRule";
import { seatTypeColor } from "../../../../common/constants";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessage } from "../../../../common/hooks/useMessage";
import { createRoom } from "../../../../common/services/room.service";
import { QUERY } from "../../../../common/constants/queryKey";

const CreateRoom = () => {
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
    mutationFn: (payload) => createRoom(payload),
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
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thêm phòng chiếu mới</h2>
          <p className="text-gray-500 text-sm mt-1">Nhập thông tin chi tiết phòng chiếu</p>
        </div>
        <Link 
          to={"/admin/rooms"} 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay về danh sách
        </Link>
      </div>
      
      <Form layout="vertical" onFinish={handleSubmit} form={form} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-4 xl:col-span-3">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Thông tin cơ bản
              </h3>
              
              <Form.Item
                required
                name={"name"}
                label={
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng chiếu
                  </span>
                }
                rules={[
                  formRules.required("Tên phòng chiếu"),
                  formRules.textRange("Tên phòng chiếu", 3, 20),
                ]}
                className="mb-4"
              >
                <Input
                  placeholder="VD: Phòng 1, Phòng VIP..."
                  className="h-10"
                />
              </Form.Item>

              <Form.Item
                name={"description"}
                label={
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả phòng chiếu
                  </span>
                }
                rules={[formRules.textRange("Mô tả phòng chiếu", 3, 200)]}
                className="mb-0"
              >
                <TextArea 
                  placeholder="Mô tả chi tiết về phòng chiếu..." 
                  rows={4}
                  className="resize-none"
                />
              </Form.Item>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg xl:col-span-2">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Tổng quan ghế ngồi
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng số ghế:</span>
                  <span className="font-medium">{totalSeats} ghế</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hàng x Cột:</span>
                  <span className="font-medium">{rows} x {cols}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Chú thích:</h4>
                <div className="flex flex-wrap gap-2">
                  <Tag 
                    color={seatTypeColor["NORMAL"]} 
                    className="m-0 px-3 py-1 rounded-md font-medium"
                  >
                    Ghế thường
                  </Tag>
                  <Tag 
                    color={seatTypeColor["VIP"]} 
                    className="m-0 px-3 py-1 rounded-md font-medium"
                  >
                    Ghế VIP
                  </Tag>
                  <Tag 
                    color={seatTypeColor["COUPLE"]} 
                    className="m-0 px-3 py-1 rounded-md font-medium"
                  >
                    Ghế đôi
                  </Tag>
                  <Tag 
                    color="error" 
                    className="m-0 px-3 py-1 rounded-md font-medium"
                  >
                    Ghế bị khoá
                  </Tag>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg xl:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-gray-700 flex items-center text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Sơ đồ ghế ngồi
              </h3>
              <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                👆 Nhấn vào ghế để đổi trạng thái
              </div>
            </div>

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


            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-end space-x-3">
                <Button
                  type="default"
                  htmlType="reset"
                  className="h-10 px-6"
                  disabled={isPending}
                >
                  Đặt lại
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="h-10 px-6"
                  loading={isPending}
                  disabled={isPending}
                >
                  Thêm phòng chiếu
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
        </Form>
      </div>
  );
};

export default CreateRoom;