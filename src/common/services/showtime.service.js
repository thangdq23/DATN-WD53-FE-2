import api from "../utils/api";

const prefix = "/showtime";

export const getMovieHasShowtime = async (params) => {
  const { data } = await api.get(`${prefix}/movie`, { params });
  return data;
};

export const getAllShowtime = async (params) => {
  const { data } = await api.get(`${prefix}`, { params });
  return data;
};

export const getDetailShowtime = async (id) => {
  const { data } = await api.get(`${prefix}/detail/${id}`);
  return data;
};

export const getShowtimeWeekday = async (params) => {
  const { data } = await api.get(`${prefix}/weekday`, { params });
  return data;
};

export const createManyShowtime = async (payload) => {
  const { data } = await api.post(`${prefix}/many`, payload);
  return data;
};

export const createShowtime = async (payload) => {
  const { data } = await api.post(`${prefix}`, payload);
  return data;
};

export const updateShowtime = async (id, payload) => {
  const realId = typeof id === "object" ? id._id || id.id : id;

  const { data } = await api.patch(`${prefix}/update/${realId}`, payload);
  return data;
};



