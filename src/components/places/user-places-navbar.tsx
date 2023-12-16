import { AddUserPlaceButton } from "./AddUserPlaceButton";

export default function UserPlacesNavbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm shadow-gray-300 z-10">
      <div className="flex-1">
        <h2 className="text-xl font-semibold">My Organizations</h2>
      </div>
      <div className="flex-none">
        <AddUserPlaceButton />
      </div>
    </div>
  );
}
