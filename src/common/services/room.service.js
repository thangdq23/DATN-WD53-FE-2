import api from "../utils/api";

export const getAllRoom = async (params) => {
  const { data } = await api.get(`/room`, { params });
  return data;
};

export const getSeatByRoom = async (roomId) => {
  const { data } = await api.get(`/room/seat/${roomId}`);
  return data;
};

export const createRoom = async (payload) => {
  const { data } = await api.post("/room", payload);
  return data;
};

export const updateRoom = async (id, payload) => {
  const { data } = await api.patch(`/room/update/${id}`, payload);
  return data;
};

export const updateStatusRoom = async (id) => {
  const { data } = await api.patch(`/room/status/${id}`);
  return data;
};
