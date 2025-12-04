export const SHOWTIME_STATUS = {
  SCHEDULED: "scheduled",
  SOLD_OUT: "sold_out",
  IN_PROGRESS: "in_progress",
  ENDED: "ended",
  CANCELLED: "cancelled",
};

export const SHOWTIME_STATUS_BADGE = {
  scheduled: { label: "Chưa chiếu", color: "#3B82F6" },
  sold_out: { label: "Hết vé", color: "#EF4444" },
  in_progress: { label: "Đang chiếu", color: "#10B981" },
  ended: { label: "Kết thúc", color: "#6B7280" },
  cancelled: { label: "Đã hủy", color: "#F59E0B" },
};
