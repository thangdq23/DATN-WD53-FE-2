import { seatTypeColor } from "../constants";

export function generatePreviewSeats(totalSeats = 140, cols = 14) {
  const seats = [];
  const rows = Math.ceil(totalSeats / cols);
  const coupleRow = rows;
  const vipStartRow = Math.floor(rows / 2);
  const vipEndRow = coupleRow - 1;
  let seatCount = 0;
  for (let row = 1; row <= rows; row++) {
    let typeRow = "NORMAL";
    if (row === coupleRow) {
      typeRow = "COUPLE";
    } else if (row >= vipStartRow && row <= vipEndRow) {
      typeRow = "VIP";
    }
    for (let col = 1; col <= cols; col++) {
      let type = typeRow;
      let span = 1;
      if (type === "COUPLE") {
        span = 2;
      }
      if (type === "VIP" && (col <= 2 || col > cols - 2)) {
        type = "NORMAL";
      }
      const seatLabel =
        type === "COUPLE"
          ? `${String.fromCharCode(64 + row)}${col}-${String.fromCharCode(
              64 + row,
            )}${col + 1}`
          : `${String.fromCharCode(64 + row)}${col}`;
      seats.push({
        row,
        col,
        label: seatLabel,
        type,
        span,
        status: true,
      });

      col += span - 1;
      seatCount += span;
    }
  }
  return {
    totalSeats: seatCount,
    rows,
    cols,
    seats,
  };
}

export const getStyleSeatCard = (seat) => {
  return {
    gridRowStart: seat.row,
    gridColumnStart: seat.col,
    gridColumnEnd: `span ${seat.span || 1}`,
    backgroundColor: seat.status ? seatTypeColor[seat.type] : "#ef4444",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    cursor: "pointer",
  };
};