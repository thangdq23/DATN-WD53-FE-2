import api from "../utils/api";

const prefix = `/seat-status`;

export const getSeatShowtime = async (roomId, showtimeId, params) => {
  const { data } = await api.get(`${prefix}/seat-map/${roomId}/${showtimeId}`, {
    params,
  });
  return data;
};

export const toggleSeat = async (payload) => {
  const { data } = await api.post(`${prefix}/toggle-seat`, payload);
  return data;
};

export const unHoldSeat = async () => {
  const { data } = await api.patch(`${prefix}/un-hold`);
  return data;
};
export const extendHoldSeat = async (showtimeId) => {
  const { data } = await api.patch(`${prefix}/extend-hold/${showtimeId}`);
  return data;
};