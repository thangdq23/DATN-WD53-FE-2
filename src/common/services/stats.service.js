import api from "../utils/api";

export const getOverviewStats = async (params) => {
  const { data } = await api.get("/v1/stats/overview", { params });
  return data.data;
};

export const getOverviewByMonth = async (year) => {
  const { data } = await api.get("/v1/stats/overview/month-of-year", {
    params: { year },
  });
  return data.data;
};

export const getOverviewRange = async (params) => {
  const { data } = await api.get("/v1/stats/overview/range", { params });
  return data.data;
};

export const getTopMoviesByTickets = async (params) => {
  const { data } = await api.get("/v1/stats/overview/top-by-tickets", {
    params,
  });
  return data.data;
};

export const getTopRevenueMovies = async (params) => {
  const { data } = await api.get("/v1/stats/overview/trend-movies", { params });
  return data.data;
};

export const getShowtimeStats = async (params) => {
  const { data } = await api.get("/v1/stats/overview/showtime-stats", {
    params,
  });
  return data.data;
};

export const getRoomStats = async (params) => {
  const { data } = await api.get("/v1/stats/overview/room-stats", { params });
  return data.data;
};

export default {
  getOverviewStats,
  getOverviewByMonth,
  getOverviewRange,
  getTopMoviesByTickets,
  getTopRevenueMovies,
  getShowtimeStats,
  getRoomStats,
};
