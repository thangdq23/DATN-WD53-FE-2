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
  const cleaned = typeof code === "string" ? code.trim() : code;
  const { data } = await api.get(`${prefix}/verify`, {
    params: { code: cleaned },
  });
  return data;
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
