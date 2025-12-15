import api from "../utils/api";

export const getAllUser = async (params) => {
  const { data } = await api.get(`/user`, { params });
  return data;
};