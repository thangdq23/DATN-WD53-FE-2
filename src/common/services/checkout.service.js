import api from "../utils/api";

const prefix = `/order`;
export const checkoutPayos = async (body) => {
  const { data } = await api.post(`${prefix}`, body);
  return data;
};
