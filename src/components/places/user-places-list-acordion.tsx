"use client";

import { usePlacesFormStore } from "./store/places-form-store";
import UserPlacesList from "./user-places-list";

export function UserPlaceListAcordion() {
  const formOpen = usePlacesFormStore((state) => state.open);
  return <>{!formOpen && <UserPlacesList />}</>;
}
