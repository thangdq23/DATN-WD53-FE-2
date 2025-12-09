import api from "../utils/api";

const prefix = `/seat-status`;

export const getSeatShowtime = async (roomId, showtimeId, params) => {
  try {
    const { data } = await api.get(`${prefix}/seat-map/${roomId}/${showtimeId}`, {
      params,
    });
    return data;
  } catch (err) {
    if (err?.response?.status === 404) {
      try {
        const { data } = await api.get(`${prefix}/seat-map/${showtimeId}/${roomId}`, {
          params,
        });
        return data;
      } catch (err2) {
        if (err2?.response?.status === 404) {
          const { data } = await api.get(`${prefix}/seat-map/${showtimeId}`, {
            params,
          });
          return data;
        }
        throw err2;
      }
    }
    throw err;
  }
};

export const toggleSeat = async (payload) => {
  try {
    const { data } = await api.post(`${prefix}/toggle-seat`, payload);
    return data;
  } catch (err) {
    const { data } = await api.post(`${prefix}/toogle-seat`, payload);
    return data;
  }
};

export const unHoldSeat = async () => {
  const { data } = await api.patch(`${prefix}/un-hold`);
  return data;
};
