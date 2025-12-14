export const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export const antdInputNumberPropsCurrency = (min = 10000, max = 10000000) => ({
  min: min,
  max: max,
  formatter: (value) =>
    value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "",
  parser: (value) => Number(value?.replace(/\./g, "") || 0),
});

export const getSeatPrice = (seat) => {
  const found = seat.price && seat.price.find((p) => p.seatType === seat.type);
  return found?.value || 0;
};
