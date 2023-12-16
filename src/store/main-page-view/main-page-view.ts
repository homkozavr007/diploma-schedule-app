import { create } from "zustand";
import { MainPageViewTabNames } from "../../types/main-page-view-tabs";

interface MainPageViewState {
  tab: MainPageViewTabNames | null;
  setTab: (tab: MainPageViewTabNames) => void;
}

export const useMainPageView = create<MainPageViewState>((set) => {
  return {
    tab: null,

    setTab: (tab: MainPageViewTabNames) => set(() => ({ tab })),
  } satisfies MainPageViewState;
});
