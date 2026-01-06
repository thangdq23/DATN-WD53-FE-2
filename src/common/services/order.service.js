import api from "../utils/api";

const prefix = "/order";

const buildParams = (params = {}) => {
  const result = {
    pagination: {
      page: 1,
      limit: 10,
    },
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (
      [
        "search",
        "status",
        "movieId",
        "roomName",
        "createdAtFrom",
        "createdAtTo",
      ].includes(key)
    ) {
      result[key] = Array.isArray(value) ? value[0] : value;
    }
  });

  return result;
};

export const getAllOrder = async (params) => {
  const finalParams = buildParams(params);
  const { data } = await api.get(prefix, { params: finalParams });
  return data;
};

export const getDetailOrder = async (id) => {
  const { data } = await api.get(`${prefix}/detail/${id}`);
  return data;
};

export const verifyOrderByCode = async (code) => {
  const { data } = await api.get(prefix, {
    params: {
      search: code,

      pagination: { page: 1, limit: 50 },
    },
  });

  if (Array.isArray(data?.data)) {
    const exact = data.data.find((o) => o?.ticketId === code) || null;
    return { ...data, data: exact };
  }

  if (data?.data && data.data.ticketId === code) return data;

  return { ...data, data: null };
};

export const confirmOrder = async (id) => {
  const { data } = await api.patch(`${prefix}/${id}`, {
    status: "used",
  });
  return data;
};

export const getMyOrders = async (params) => {
  const finalParams = buildParams(params);
  const { data } = await api.get(`${prefix}/my`, { params: finalParams });
  return data;
};
