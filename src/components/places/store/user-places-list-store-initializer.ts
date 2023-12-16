"use client";

import { useRef } from "react";
import { Organization } from "../../../models/Organization";
import { useUserPlacesListStore } from "./user-places-list-store";

export default function UserPlacesListStoreStoreInitializer({
  places,
}: {
  places: Organization[];
}) {
  const initialied = useRef(false);
  if (!initialied.current) {
    useUserPlacesListStore.setState({ places });
    initialied.current = true;
  }
  return null;
}
