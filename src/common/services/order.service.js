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

// =========================
// LIST ORDER (ADMIN)
// =========================
export const getAllOrder = async (params) => {
  const finalParams = buildParams(params);
  const { data } = await api.get(prefix, { params: finalParams });
  return data;
};

// =========================
// ORDER DETAIL
// =========================
export const getDetailOrder = async (id) => {
  const { data } = await api.get(`${prefix}/detail/${id}`);
  return data;
};

// =========================
// ✅ QR VERIFY (KHÔNG SỬA BACKEND)
// - Gọi /order?search=code (KHÔNG limit=1)
// - FE lọc đúng ticketId === code
// =========================
export const verifyOrderByCode = async (code) => {
  const { data } = await api.get(prefix, {
    params: {
      search: code,
      // không set limit=1 để tránh backend trả "mới nhất"
      pagination: { page: 1, limit: 50 },
    },
  });

  // backend list trả về { data: [] }
  if (Array.isArray(data?.data)) {
    // lọc chính xác theo ticketId
    const exact = data.data.find((o) => o?.ticketId === code) || null;
    return { ...data, data: exact };
  }

  // nếu backend trả object đơn lẻ (hiếm)
  if (data?.data && data.data.ticketId === code) return data;

  return { ...data, data: null };
};

// =========================
// CONFIRM USED
// =========================
export const confirmOrder = async (id) => {
  const { data } = await api.patch(`${prefix}/${id}`, {
    status: "used",
  });
  return data;
};
