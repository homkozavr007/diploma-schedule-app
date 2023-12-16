import { create } from "zustand";

interface PlacesFormState {
  open: boolean;
  switchForm: () => void;
}

export const usePlacesFormStore = create<PlacesFormState>((set) => ({
  open: false,
  switchForm: () => set((store) => ({ open: !store.open })),
}));
