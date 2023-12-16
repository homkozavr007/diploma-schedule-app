"use client";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { usePlacesFormStore } from "./store/places-form-store";

export function AddUserPlaceButton() {
  const formOpen = usePlacesFormStore((state) => state.open);
  const switchForm = usePlacesFormStore((state) => state.switchForm);
  return (
    <label className="btn btn-circle swap swap-rotate">
      <input type="checkbox" checked={formOpen} onChange={switchForm} />
      <PlusIcon className="swap-off fill-current w-6 h-6" />
      <MinusIcon className="swap-on fill-current w-6 h-6" />
    </label>
  );
}
