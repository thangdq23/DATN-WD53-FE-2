import api from "../utils/api";

export const getAllUser = async (params) => {
  const { data } = await api.get(`/user`, { params });
  return data;
};
export const createUser = async(payload)=>{
  const {data} = await api.post(`/user`, payload);
  return data;
};

export const updateUser = async (payload) => {
  const { data } = await api.patch(`/user/update/${payload._id}`, payload);
  return data;
};