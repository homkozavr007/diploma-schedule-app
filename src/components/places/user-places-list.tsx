"use client";

import { useUserPlacesListStore } from "./store/user-places-list-store";
import UserPlaceCard from "./user-place-card";

export default function UserPlacesList() {
  const places = useUserPlacesListStore((state) => state.places);
  return (
    <div className="flex flex-col space-y-4 p-4">
      {places.map((place) => (
        <UserPlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
}
