import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { updateUser as apiUpdateUser } from "../common/services/user.service";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        profile: null,
        tickets: [],
        setProfile: (profile) => set({ profile }),
        updateProfile: async (payload) => {
          const res = await apiUpdateUser(payload);
          if (res?.data) set({ profile: res.data });
          return res;
        },
        addTicket: (ticket) => {
          const { tickets } = get();
          const next = [ticket, ...tickets];
          set({ tickets: next });
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
