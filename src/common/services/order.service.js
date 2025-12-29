import api from "../utils/api";

const prefix = `/order`;
export const getDetailOrder = async (id) => {
  const { data } = await api.get(`${prefix}/detail/${id}`);
  return data;
};
