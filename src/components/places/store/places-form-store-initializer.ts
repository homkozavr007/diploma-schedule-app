"use client";

import { useRef } from "react";
import { usePlacesFormStore } from "./places-form-store";

export default function PlacesFormStoreInitializer({
  open,
}: {
  open: boolean;
}) {
  const initialied = useRef(false);
  if (!initialied.current) {
    usePlacesFormStore.setState({ open });
    initialied.current = true;
  }
  return null;
}
