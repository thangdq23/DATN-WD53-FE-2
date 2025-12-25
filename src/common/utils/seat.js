import { seatTypeColor } from "../constants";
import { SEAT_STATUS, SEAT_STATUS_COLOR } from "../constants/seat";

// Generate seats based on rows and columns
export function generatePreviewSeats(rows = 10, cols = 10) {
  const seats = [];
  let seatCount = 0;

  for (let row = 1; row <= rows; row++) {
    const rowLetter = String.fromCharCode(64 + row); // A, B, C, ...

    for (let col = 1; col <= cols; col++) {
      const seatLabel = `${rowLetter}${col}`; // A1, A2, A3, ...
      const id = `seat-${row}-${col}`;

      seats.push({
        id,
        row,
        col,
        label: seatLabel,
        type: "NORMAL",
        span: 1,
        status: true,
        selected: false,
        locked: false,
      });

      seatCount++;
    }
  }

  return {
    totalSeats: seatCount,
    rows,
    cols,
    seats: seats.sort((a, b) => {
      // Sort by row first, then by column
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    }),
  };
}

// Toggle seat selection
export function toggleSeatSelection(seats, seatId) {
  return seats.map((seat) =>
    seat.id === seatId ? { ...seat, selected: !seat.selected } : seat,
  );
}

// Update selected seats type
export function updateSelectedSeatsType(seats, seatType) {
  return seats.map((seat) =>
    seat.selected ? { ...seat, type: seatType, selected: false } : seat,
  );
}

// Toggle seat status (active/inactive)
export function toggleSeatStatus(seats, seatId) {
  return seats.map((seat) =>
    seat.id === seatId ? { ...seat, status: !seat.status } : seat,
  );
}

// Xóa ghế bằng cách đánh dấu là đã xóa thay vì xóa khỏi mảng
export function deleteSeat(seats, seatId) {
  return seats.map((seat) => {
    // Nếu là ghế cần xóa, đánh dấu là đã xóa
    if (seat.id === seatId) {
      return {
        ...seat,
        status: false, // Đánh dấu là đã xóa
        type: "NORMAL", // Đặt lại loại ghế
        span: 1, // Đặt lại span
        combinedSeatId: null, // Xóa thông tin ghế gộp
        combinedWith: null, // Xóa thông tin ghế gộp
      };
    }

    // Nếu ghế hiện tại đang gộp với ghế bị xóa
    if (seat.combinedSeatId === seatId) {
      return {
        ...seat,
        type: "NORMAL",
        span: 1,
        combinedSeatId: null,
        combinedWith: null,
        label: seat.label.split("-")[0], // Lấy lại nhãn gốc
      };
    }

    // Giữ nguyên các ghế khác
    return seat;
  });
}

// Combine two adjacent seats
export function combineSeats(seats, seat1, seat2) {
  // Check if seats are in the same row and adjacent
  if (seat1.row !== seat2.row || Math.abs(seat1.col - seat2.col) !== 1) {
    console.warn("Chỉ có thể ghép các ghế liền kề trong cùng một hàng");
    return seats;
  }

  // Determine left and right seats
  const leftSeat = seat1.col < seat2.col ? seat1 : seat2;
  const rightSeat = seat1.col < seat2.col ? seat2 : seat1;

  return seats.map((seat) => {
    if (seat.id === leftSeat.id) {
      // Update left seat to be a combined seat
      return {
        ...leftSeat,
        type: "COUPLE",
        span: 2,
        label: `${leftSeat.label}-${rightSeat.label}`,
        combinedSeatId: rightSeat.id,
      };
    } else if (seat.id === rightSeat.id) {
      // Hide the right seat
      return {
        ...rightSeat,
        status: false,
        combinedWith: leftSeat.id,
      };
    }
    return seat;
  });
}

// Split a combined seat
export function splitSeat(seats, seat) {
  if (!seat.combinedSeatId) return seats;

  return seats.map((s) => {
    if (s.id === seat.id) {
      // Convert back to normal seat
      const [label1] = seat.label.split("-");
      return {
        ...seat,
        type: "NORMAL",
        span: 1,
        label: label1,
        combinedSeatId: null,
      };
    } else if (s.id === seat.combinedSeatId) {
      // Restore the hidden seat
      return {
        ...s,
        status: true,
        combinedWith: null,
      };
    }
    return s;
  });
}

export const getStyleSeatCard = (seat, color) => {
  const baseStyle = {
    gridRowStart: seat.row,
    gridColumnStart: seat.col,
    gridColumnEnd: `span ${seat.span || 1}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s ease",
    fontWeight: 600,
    fontSize: 12,
  };

  if (seat.locked) {
    return {
      ...baseStyle,
      backgroundColor: seatTypeColor.LOCKED || "#374151",
      color: seatTypeColor.LOCKED_TEXT,
      border: `1px solid ${darkenColor(seatTypeColor.LOCKED || "#374151", 10)}`,
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      cursor: "not-allowed",
      "&:hover": {
        transform: "none",
      },
    };
  }

  if (!seat.status) {
    return {
      ...baseStyle,
      backgroundColor: seatTypeColor.LOCKED,
      color: seatTypeColor.LOCKED_TEXT,
      border: "1px dashed #d1d5db",
      borderRadius: "10px",
      boxShadow: "none",
      cursor: "default",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    };
  }

  // Active seat style
  const bgColor = color || seatTypeColor[seat.type];
  const baseSeatStyle = {
    ...baseStyle,
    backgroundColor: bgColor,
    color: "#fff",
    border: `1px solid ${darkenColor(bgColor, 10)}`,
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  };

  return baseSeatStyle;
  //   '&:hover': {
};

export const getStatusSeat = (status, isMyHold) => {
  if (status === SEAT_STATUS.HOLD && isMyHold) {
    return SEAT_STATUS_COLOR[SEAT_STATUS.MYHOLD];
  }
  if (status === SEAT_STATUS.HOLD && !isMyHold) {
    return SEAT_STATUS_COLOR[SEAT_STATUS.BOOKED];
  }
  if (status === SEAT_STATUS.BOOKED && isMyHold) {
    return SEAT_STATUS_COLOR[SEAT_STATUS.MYBOOKED];
  }

  switch (status) {
    case SEAT_STATUS.HOLD:
      return SEAT_STATUS_COLOR[SEAT_STATUS.HOLD];
    case SEAT_STATUS.BOOKED:
      return SEAT_STATUS_COLOR[SEAT_STATUS.BOOKED];
    default:
      return "";
  }
};

// Helper function to darken colors
export function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = ((num >> 8) & 0x00ff) - amt,
    B = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
