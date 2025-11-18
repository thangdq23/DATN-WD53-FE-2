import api from "../utils/api";

export const getAllRoom = async (params) => {
    const { data } = await api.get(`/room`, { params });
    return data;
};