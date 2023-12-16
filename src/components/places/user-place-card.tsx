"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Organization } from "../../models/Organization";
import { usePlacesFormStore } from "./store/places-form-store";
import { useUserPlacesListStore } from "./store/user-places-list-store";
import { openUserPlaceDeleteDialog } from "./utils/open-user-place-delete-dialog";

export default function UserPlaceCard({ place }: { place: Organization }) {
  const switchForm = usePlacesFormStore((state) => state.switchForm);
  const editPlace = useUserPlacesListStore((state) => state.editPlace);
  const deletePlace = useUserPlacesListStore((state) => state.deletePlace);
  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{place.name}</h2>
        <address>
          <span className="font-semibold mr-2">{place.city}</span>
          {place.address}
          <div className="truncate">
            tel: <a href={`tel:${place.phone}`}>{place.phone}</a>
          </div>
          <div className="truncate">
            url:{" "}
            <a href={`${place.url}`} target="_blank">
              {place.url}
            </a>
          </div>
        </address>
        <p>{place.description}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-outline btn-xs"
            onClick={async () => {
              const result = await openUserPlaceDeleteDialog(place);
              if (result === "delete") {
                await deletePlace(place._id);
              }
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline btn-primary btn-xs"
            onClick={() => {
              editPlace(place);
              switchForm();
            }}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
