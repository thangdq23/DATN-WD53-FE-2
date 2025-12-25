import {
  DeleteOutlined,
  LockOutlined,
  MergeCellsOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Tag,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { seatTypeColor, seatTypeText } from "../../../../common/constants";
import { QUERY } from "../../../../common/constants/queryKey";
import { useMessage } from "../../../../common/hooks/useMessage";
import {
  getSeatByRoom,
  updateRoom,
} from "../../../../common/services/room.service";
import { formRules } from "../../../../common/utils/formRule";
import {
  combineSeats,
  darkenColor,
  splitSeat,
  toggleSeatSelection,
} from "../../../../common/utils/seat";

const { Option } = Select;

const UpdateRoom = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const { HandleError, antdMessage: message } = useMessage();
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [seatsState, setSeatState] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isCombining, setIsCombining] = useState(false);
  const [seatType, setSeatType] = useState("NORMAL");
  const { data, isLoading } = useQuery({
    queryKey: [QUERY.ROOM, id],
    queryFn: async () => {
      const { data } = await getSeatByRoom(id);
      return data;
    },
  });
  const resetFormData = () => {
    form.setFieldsValue(data);
    const seatConvert = [];
    data.seats.forEach((item) => {
      if (item.type === "COUPLE" && item.span === 2) {
        const [_, label2] = item.label.split("-");
        const mainId = `seat-${item.row}-${item.col}`;
        const subId = `seat-${item.row}-${item.col + 1}`;
        seatConvert.push({
          _id: item._id,
          id: mainId,
          combinedSeatId: subId,
          label: item.label,
          row: item.row,
          col: item.col,
          span: 2,
          type: "COUPLE",
          locked: !item.status,
          selected: false,
          status: item.status,
        });
        seatConvert.push({
          _id: item._id,
          id: subId,
          combinedWith: mainId,
          label: label2,
          row: item.row,
          col: item.col + 1,
          span: 1,
          type: "NORMAL",
          locked: !item.status,
          selected: false,
          status: false,
        });
      } else {
        seatConvert.push({
          _id: item._id,
          id: `seat-${item.row}-${item.col}`,
          label: item.label,
          locked: !item.status,
          selected: false,
          ...item,
        });
      }
    });

    setSeatState(seatConvert);
    setCols(data.cols);
    setRows(data.rows);
  };
  useEffect(() => {
    if (data) {
      resetFormData();
    }
  }, [data, form]);

  // useEffect(() => {
  //   setSeatState((prev) => {
  //     const { seats: newSeats } = generatePreviewSeats(rows, cols);
  //     const merged = newSeats.map((n) => {
  //       const old = prev.find((o) => o.id === n.id);
  //       return old ? { ...n, ...old } : n;
  //     });
  //     return merged;
  //   });
  // }, [rows, cols]);
  const totalSeats = seatsState.filter((seat) => seat.status).length;
  const handleSeatClick = (seat, event) => {
    if (seat.locked) {
      message.info("Ghế này đã bị khóa");
      return;
    }
    if (isCombining) {
      const updatedSelected = [...selectedSeats, seat];
      if (updatedSelected.length === 2) {
        setSeatState((prevSeats) =>
          combineSeats(prevSeats, ...updatedSelected),
        );
        setSelectedSeats([]);
        setIsCombining(false);
      } else {
        setSelectedSeats(updatedSelected);
      }
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      setSeatState((prevSeats) => toggleSeatSelection(prevSeats, seat.id));
    } else {
      setSeatState((prevSeats) =>
        prevSeats.map((s) => ({
          ...s,
          selected: s.id === seat.id && !s.locked ? !s.selected : false,
        })),
      );
    }
  };

  const toggleSeatLock = (seatId) => {
    setSeatState((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              locked: !seat.locked,
              status: seat.locked,
              selected: false,
            }
          : seat,
      ),
    );
    message.success("Đã cập nhật trạng thái khóa ghế");
  };

  const handleUpdateSeatType = (type) => {
    setSeatState((prevSeats) => {
      const selectedSeats = prevSeats.filter(
        (seat) => seat.selected && !seat.locked,
      );

      if (selectedSeats.length === 0) {
        message.warning("Vui lòng chọn ít nhất một ghế chưa khóa để thay đổi");
        return prevSeats;
      }

      return prevSeats.map((seat) =>
        seat.selected && !seat.locked ? { ...seat, type } : seat,
      );
    });

    message.success(
      `Đã cập nhật loại ghế cho ${
        selectedSeats.filter((seat) => seat.selected && !seat.locked).length
      } ghế`,
    );
  };

  const toggleCombineMode = () => {
    setIsCombining(!isCombining);
    setSelectedSeats([]);
    message.info(
      isCombining ? "Đã thoát chế độ ghép ghế" : "Chọn 2 ghế liền kề để ghép",
    );
  };

  const handleSplitSeat = (seat) => {
    setSeatState((prevSeats) => splitSeat(prevSeats, seat));
    message.success("Đã tách ghế thành công");
  };
  const resizeSeatGrid = (newRows, newCols) => {
    setSeatState((prev) => {
      const updated = [];
      for (let r = 1; r <= newRows; r++) {
        for (let c = 1; c <= newCols; c++) {
          const exist = prev.find((s) => s.row === r && s.col === c);
          if (exist) {
            updated.push(exist);
          } else {
            updated.push({
              id: `seat-${r}-${c}`,
              row: r,
              col: c,
              label: `${String.fromCharCode(64 + r)}${c}`,
              type: "NORMAL",
              status: true,
              span: 1,
              selected: false,
              locked: false,
            });
          }
        }
      }

      return updated;
    });
  };
  const clearSelections = () => {
    setSeatState((prevSeats) =>
      prevSeats.map((seat) => ({ ...seat, selected: false })),
    );
  };
  const handleGridResize = (newRows, newCols) => {
    const r = parseInt(newRows) || 1;
    const c = parseInt(newCols) || 1;
    setRows(r);
    setCols(c);
    resizeSeatGrid(r, c);
    clearSelections();
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => updateRoom(id, payload),
    onSuccess: ({ message: messageSever }) => {
      message.success(messageSever);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey.includes(QUERY.ROOM),
      });
      nav("/admin/rooms");
    },
    onError: (err) => HandleError(err),
  });

  const handleReset = () => {
    resetFormData();
    message.success("Đã đặt lại về trạng thái ban đầu");
  };

  const handleSubmit = (values) => {
    const seatsToSubmit = seatsState
      .filter((seat) => !seat.combinedWith)
      .map((seat) => ({
        _id: `${id}-${seat.id}`,
        row: seat.row,
        col: seat.col,
        label: seat.label,
        type: seat.type,
        span: seat.span || 1,
        ...seat,
        status: !seat.locked,
      }));
    mutate({
      ...values,
      cols,
      rows,
      capacity: seatsToSubmit.length,
      seats: seatsToSubmit,
    });
  };

  const getSeatMenuItems = (seat) => {
    const items = [
      {
        key: "toggle-lock",
        icon: seat.locked ? <UnlockOutlined /> : <LockOutlined />,
        label: seat.locked ? "Mở khóa ghế" : "Khóa ghế",
        onClick: () => toggleSeatLock(seat.id),
      },
    ];

    if (!seat.locked) {
      items.push(
        ...(seat.type === "COUPLE"
          ? [
              {
                key: "split-seat",
                icon: <MergeCellsOutlined />,
                label: "Tách ghế",
                onClick: () => handleSplitSeat(seat),
              },
            ]
          : []),
      );
    }

    return items;
  };
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh] mb-6 pb-4 border-b border-gray-100">
          <Spin />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Cập nhật phòng chiếu
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Nhập thông tin chi tiết phòng chiếu
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/admin/rooms">
                <Button type="default" className="h-10 px-6">
                  Huỷ
                </Button>
              </Link>
              <Button
                type="primary"
                className="h-10 px-6 bg-blue-600 hover:bg-blue-700"
                onClick={() => form.submit()}
                loading={isPending}
              >
                Lưu thông tin
              </Button>
            </div>
          </div>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="space-y-4 xl:col-span-3">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
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

                <div className="bg-gray-50 p-6 rounded-lg xl:col-span-3">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-gray-700 flex items-center text-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 text-purple-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
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
                      <div className="absolute inset-0 bg-linear-to-b from-gray-200/20 via-transparent to-transparent rounded-t-full pointer-events-none"></div>

                      <div
                        className="relative z-10 h-16 md:h-20 lg:h-24 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
                        style={{
                          borderRadius: "100% 100% 0 0 / 15px",
                          transform: "perspective(80px) rotateX(4deg)",
                          transformOrigin: "center bottom",
                          borderBottom: "2px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 w-full h-1/3 bg-linear-to-t from-blue-900/30 to-transparent"></div>
                        </div>
                      </div>

                      <div className="relative z-0 mx-auto w-full max-w-2xl h-4 bg-linear-to-b from-gray-700 to-gray-600 rounded-b-lg shadow-inner">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gray-400 rounded-full"></div>
                        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gray-300 rounded-full"></div>
                      </div>

                      <div className="relative z-10 mx-auto w-full max-w-3xl h-1.5 bg-gray-400 rounded-b-md"></div>

                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5/6 h-3 bg-linear-to-b from-gray-300/50 to-transparent rounded-full blur-sm"></div>
                    </div>

                    <div className="mt-6">
                      <div className="inline-block px-4 py-1.5 bg-linear-to-r from-gray-100 to-gray-200 rounded-full shadow-sm">
                        <span className="text-sm font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          MÀN HÌNH CHIẾU PHIM
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="h-1 w-24 mx-auto bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full">
                          <div className="h-full w-1/3 bg-linear-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Khoảng cách tối ưu
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-gray-100 rounded-lg p-4">
                    <div className="w-full overflow-x-auto">
                      <div
                        className="grid gap-2 p-2"
                        style={{
                          gridTemplateColumns: `auto repeat(${cols}, minmax(40px, 1fr))`,
                          width: "fit-content",
                          minWidth: "100%",
                        }}
                      >
                        <div className="h-8 flex items-center justify-center font-medium text-gray-600"></div>
                        {Array.from({ length: cols }).map((_, colIndex) => (
                          <div
                            key={`col-${colIndex}`}
                            className="h-8 flex items-center justify-center font-medium text-gray-600"
                          >
                            {colIndex + 1}
                          </div>
                        ))}

                        {Array.from({ length: rows }).map((_, rowIndex) => {
                          const rowLetter = String.fromCharCode(65 + rowIndex);
                          const rowSeats = seatsState
                            .filter((seat) => seat.row === rowIndex + 1)
                            .sort((a, b) => a.col - b.col);

                          return (
                            <React.Fragment key={`row-${rowIndex}`}>
                              <div className="flex items-center justify-center font-medium text-gray-600">
                                {rowLetter}
                              </div>

                              {rowSeats.map((seat) => {
                                if (seat.combinedWith) {
                                  return null;
                                }

                                const isCombined =
                                  seat.type === "COUPLE" && seat.span === 2;
                                return (
                                  <Dropdown
                                    menu={{ items: getSeatMenuItems(seat) }}
                                    trigger={["contextMenu"]}
                                    key={seat.id}
                                  >
                                    <div
                                      onClick={(e) => handleSeatClick(seat, e)}
                                      className={`flex items-center justify-center font-medium
                                cursor-pointer rounded-md transition-all m-0.5
                                hover:opacity-90 active:scale-95
                                ${
                                  seat.selected
                                    ? "ring-2 ring-blue-500 ring-offset-1 z-10"
                                    : ""
                                }
                              `}
                                      style={{
                                        height: "40px",
                                        backgroundColor: seat.locked
                                          ? seatTypeColor.LOCKED
                                          : seat.status
                                          ? seatTypeColor[seat.type] ||
                                            seatTypeColor["NORMAL"]
                                          : seatTypeColor["DELETED"],
                                        border: `1px solid ${
                                          seat.locked
                                            ? darkenColor(
                                                seatTypeColor.LOCKED,
                                                10,
                                              )
                                            : seat.status
                                            ? darkenColor(
                                                seatTypeColor[seat.type] ||
                                                  seatTypeColor["NORMAL"],
                                                10,
                                              )
                                            : "#d1d5db"
                                        }`,
                                        color: seatTypeText[seat.type],
                                        minWidth: isCombined ? "80px" : "40px",
                                        gridColumn: isCombined
                                          ? `span 2`
                                          : "auto",
                                        opacity: seat.locked ? 0.9 : 1,
                                        cursor: seat.locked
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      {seat.label}
                                    </div>
                                  </Dropdown>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-end gap-4">
                        <Button
                          type="default"
                          onClick={handleReset}
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
                          Cập nhật phòng chiếu
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Thông tin cơ bản
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-lg xl:col-span-2">
                    <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Tổng quan ghế ngồi
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Số hàng ghế" className="mb-0">
                          <InputNumber
                            min={1}
                            max={20}
                            value={rows}
                            onChange={(value) => handleGridResize(value, cols)}
                            className="w-full"
                          />
                        </Form.Item>
                        <Form.Item label="Số ghế mỗi hàng" className="mb-0">
                          <InputNumber
                            min={1}
                            max={30}
                            value={cols}
                            onChange={(value) => handleGridResize(rows, value)}
                            className="w-full"
                          />
                        </Form.Item>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tổng số ghế:</span>
                          <span className="font-medium">{totalSeats} ghế</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hàng x Cột:</span>
                          <span className="font-medium">
                            {rows} x {cols}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 mb-1">
                          Loại ghế:
                        </div>
                        <Select
                          value={seatType}
                          onChange={setSeatType}
                          className="w-full"
                        >
                          <Option value="NORMAL">Thường</Option>
                          <Option value="VIP">VIP</Option>
                        </Select>
                        <Button
                          type="primary"
                          onClick={() => handleUpdateSeatType(seatType)}
                          className="w-full mt-2!"
                        >
                          Áp dụng cho ghế đã chọn
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                        <Button
                          icon={<MergeCellsOutlined />}
                          onClick={toggleCombineMode}
                          type={isCombining ? "primary" : "default"}
                          className="w-full"
                        >
                          {isCombining
                            ? "Đang chọn ghế để ghép..."
                            : "Ghép ghế đôi"}
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={clearSelections}
                          className="w-full mb-2"
                        >
                          Bỏ chọn
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Chú thích:
                      </h4>
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
                          color="#dc2626"
                          className="m-0 px-3 py-1 rounded-md font-medium"
                        >
                          Ghế bị khoá
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default UpdateRoom;
