import api from "../utils/api";

const prefix = "/order";

export const getAllTicket = async (params) => {
  const { data } = await api.get(prefix, { params });
  return data;
};

export const verifyTicket = async (code) => {
  const { data } = await api.get(`/order/code/${code}`);
  return data;
};

export const confirmTicket = async (id) => {
  const token = localStorage.getItem("accessToken");

  const { data } = await api.patch(
    `${prefix}/confirm/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
