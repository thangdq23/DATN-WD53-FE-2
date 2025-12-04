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
  };

  if (!seat.status) {
    // Locked seat style
    return {
      ...baseStyle,
      backgroundColor: "#f3f4f6",
      color: "#9ca3af",
      border: "1px dashed #d1d5db",
      borderRadius: "4px",
      boxShadow: "none",
      '&:hover': {
        backgroundColor: "#f3f4f6",
      },
    };
  }

  // Active seat style
  const isVip = seat.type === 'VIP';
  const baseSeatStyle = {
    ...baseStyle,
    backgroundColor: seatTypeColor[seat.type],
    color: "#fff",
    border: `1px solid ${darkenColor(seatTypeColor[seat.type], 10)}`,
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  };

  if (isVip) {
    return {
      ...baseSeatStyle,
      position: 'relative',
      border: '2px solid #FF4D4F',
      boxShadow: '0 0 0 1px #FF4D4F, 0 0 0 3px rgba(255, 77, 79, 0.3)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 0 0 2px #FF4D4F, 0 0 0 4px rgba(255, 77, 79, 0.3), 0 4px 8px rgba(0,0,0,0.15)'
      }
    };
  }

  return baseSeatStyle;
  //   '&:hover': {
  //     transform: 'translateY(-2px)',
  //     boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  //   },
  // };
};
// Helper function to darken colors
function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
}