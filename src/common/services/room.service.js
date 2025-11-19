import api from "../utils/api";

export const getAllRoom = async (params) => {
    const { data } = await api.get(`/room`, { params });
    return data;

};
export const createRoom = async (payload)=>{
    const {data}= await api.post("/room", payload);
    return data;
}

