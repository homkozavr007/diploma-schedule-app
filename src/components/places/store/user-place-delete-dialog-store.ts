import { create } from "zustand";
import { Organization } from "../../../models/Organization";

interface UserPlaceDeleteDialogState {
  place: Organization | null;
}

export const useUserPlaceDeleteDialogStore = create<UserPlaceDeleteDialogState>(
  (set) => ({
    place: null,
  })
);
