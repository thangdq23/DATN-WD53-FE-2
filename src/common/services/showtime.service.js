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
