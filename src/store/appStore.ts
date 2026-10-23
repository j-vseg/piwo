import { Approval } from "@/constants/Approval";
import { Role } from "@/constants/Role";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { storage } from "./storage";

type AppState = {
  role: Role | null;
  approval: Approval | null;
  lastSeenFeaturesVersion: number | undefined;
};

type Actions = {
  setAccount: (data: { role: Role; approval: Approval }) => void;
  clearAccount: () => void;
  setLastSeenFeaturesVersion: (version: number) => void;
};

const defaultState: AppState = {
  role: null,
  approval: null,
  lastSeenFeaturesVersion: undefined,
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
          state.role = null;
          state.approval = null;
        }),

      setLastSeenFeaturesVersion: (version) =>
        set((state) => {
          state.lastSeenFeaturesVersion = version;
        }),
    })),
    {
      name: "app-store",
      storage: createJSONStorage(() => storage),
    },
  ),
);
