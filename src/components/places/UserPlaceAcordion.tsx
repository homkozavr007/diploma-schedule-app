"use client";

import PlaceEditForm from "./place-edit-form";
import { usePlacesFormStore } from "./store/places-form-store";
import { useUserPlacesListStore } from "./store/user-places-list-store";

export function UserPlaceFormAcordion() {
  const formOpen = usePlacesFormStore((state) => state.open);
  const placeToEdit = useUserPlacesListStore((state) => state.placeToEdit);
  return <div>{formOpen && <PlaceEditForm placeToEdit={placeToEdit} />}</div>;
}
