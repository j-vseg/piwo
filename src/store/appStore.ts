import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { storage } from "./storage";

type AppState = {
  role: Role | null;
  approval: Approval | null;
};

type Actions = {
  setAccount: (data: { role: Role; approval: Approval }) => void;
  clearAccount: () => void;
};

const defaultState: AppState = {
  role: null,
  approval: null,
};

export const useAppStore = create<AppState & Actions>()(
  persist(
    immer((set) => ({
      ...defaultState,

      setAccount: (data) =>
        set((state) => {
          state.role = data.role;
          state.approval = data.approval;
        }),

      clearAccount: () =>
        set((state) => {
          Object.assign(state, defaultState);
        }),
    })),
    {
      name: "app-store",
      storage: createJSONStorage(() => storage),
    },
  ),
);
