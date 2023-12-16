import { create } from "zustand";
import { Organization, OrganizationInput } from "../../../models/Organization";
import { createPlace, deletePlace, updatePlace } from "../../../data/places";

interface UserPlacesListState {
  places: Organization[];
  placeToEdit: Organization | null;
  selectedPlaceId: string | null;
  addPlace: (place: OrganizationInput) => Promise<void>;
  deletePlace: (id: string) => Promise<void>;
  updatePlace: (place: OrganizationInput & { _id: string }) => Promise<void>;
  editPlace: (place: Organization | null) => void;
  setSelected: (placeId: string | null) => void;
}

export const useUserPlacesListStore = create<UserPlacesListState>((set) => ({
  places: [],
  placeToEdit: null,
  selectedPlaceId: null,
  addPlace: async (place) => {
    const createdPlace = await createPlace(place);
    set((store) => ({ places: [...store.places, createdPlace] }));
  },
  deletePlace: async (id) => {
    await deletePlace(id);
    set((store) => ({
      places: store.places.filter((place) => place._id !== id),
    }));
  },
  updatePlace: async (place: OrganizationInput & { _id: string }) => {
    const updatedPlace = await updatePlace(place);
    set((state) => ({
      places: state.places.map((p) =>
        p._id === updatedPlace._id ? updatedPlace : p
      ),
    }));
  },
  editPlace: (place: Organization | null) =>
    set(() => ({ placeToEdit: place })),
  setSelected: (placeId: string | null) =>
    set(() => ({ selectedPlaceId: placeId })),
}));
