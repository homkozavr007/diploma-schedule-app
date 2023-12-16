import { usePlacesFormStore } from "./store/places-form-store";
import PlacesFormStoreInitializer from "./store/places-form-store-initializer";
import UserPlacesNavbar from "./user-places-navbar";
import { UserPlaceFormAcordion } from "./UserPlaceAcordion";
import { getUserPlaces } from "@/data/places";
import UserPlacesListStoreStoreInitializer from "./store/user-places-list-store-initializer";
import { UserPlaceListAcordion } from "./user-places-list-acordion";
import PlaceFormCloseHandler from "./place-form-close-handler";
import UserPlaceDeleteDialog from "./user-place-delete-dialog";

export async function PlacesManagement() {
  const formOpen = usePlacesFormStore.getState().open;
  const userPlaces = await getUserPlaces();

  return (
    <>
      <PlacesFormStoreInitializer open={formOpen} />
      <UserPlacesListStoreStoreInitializer places={userPlaces} />
      <PlaceFormCloseHandler />
      <UserPlaceDeleteDialog />
      <div className="flex flex-col h-full">
        <UserPlacesNavbar />
        <div className="grow overflow-auto">
          <UserPlaceFormAcordion />
          <UserPlaceListAcordion />
        </div>
      </div>
    </>
  );
}
