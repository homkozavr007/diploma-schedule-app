"use client";
import { usePlacesFormStore } from "./store/places-form-store";
import { useUserPlacesListStore } from "./store/user-places-list-store";

usePlacesFormStore.subscribe((state) => {
  if (!state.open) {
    useUserPlacesListStore.setState({ placeToEdit: null });
  }
});

export default function PlaceFormCloseHandler() {
  return null;
}
