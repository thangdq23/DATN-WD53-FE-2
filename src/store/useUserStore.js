import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { updateUser as apiUpdateUser } from "../common/services/user.service";
import { useAuthStore } from "./useAuthStore";
import { getMyOrders } from "../common/services/order.service";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        tickets: [],
        setProfile: (profile) => set({ profile }),
        updateProfile: async (payload) => {
          const res = await apiUpdateUser(payload);
          if (res?.data) {
            set({ profile: res.data });
            try {
              const authUser = useAuthStore.getState().user;
              if (authUser && authUser._id === res.data._id) {
                useAuthStore.setState({ user: res.data });
              }
            } catch (e) {
              // ignore
            }
          }
          return res;
        },
        addTicket: (ticket) => {
          const { tickets } = get();
          const next = [ticket, ...tickets];
          set({ tickets: next });
        },
        setTickets: (tickets) => set({ tickets }),
        fetchMyTickets: async (params) => {
          try {
            const res = await getMyOrders(params);
            if (res?.data) set({ tickets: res.data });
            return res;
          } catch (err) {
            return null;
          }
        },
        clear: () => set({ profile: null, tickets: [] }),
      }),
      { name: "user-storage" },
    ),
    { name: "userStore" },
  ),
);

export const useUserSelector = (selector) => useUserStore(useShallow(selector));

export default useUserStore;
