export const ORDER_STATUS = {
  pending: {
    label: "Chờ thanh toán",
    color: "#FAAD14",
    bgColor: "rgba(250,173,20,0.2)",
    root: "pending",
  },
  buyed: {
    label: "Đã mua",
    color: "#52C41A",
    bgColor: "rgba(82,196,26,0.2)",
    root: "buyed",
  },
  used: {
    label: "Đã sử dụng",
    color: "#1890FF",
    bgColor: "rgba(24,144,255,0.2)",
    root: "used",
  },
  cancelled: {
    label: "Đã bị huỷ",
    color: "#FF4D4F",
    bgColor: "rgba(255,77,79,0.2)",
    root: "cancelled",
  },
};
export const ORDER_OPTIONS_STATUS = {
  pending: "Chờ thanh toán",
  buyed: "Đã mua",
  used: "Đã sử dụng",
  cancelled: "Đã bị huỷ",
};
