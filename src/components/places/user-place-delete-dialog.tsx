"use client";

import { useUserPlaceDeleteDialogStore } from "./store/user-place-delete-dialog-store";

export default function UserPlaceDeleteDialog() {
  const place = useUserPlaceDeleteDialogStore((state) => state.place);
  return (
    <dialog id="user_place_delete_dialog" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirmation</h3>
        <p className="py-4">
          Are you sure to delete the place{" "}
          <span className="font-semibold">{place?.name}</span>
        </p>
        <div className="modal-action">
          <form method="dialog" className="space-x-4">
            <button className="btn" value="cancel" type="submit">
              Cancel
            </button>
            <button className="btn btn-neutral" value="delete" type="submit">
              Delete
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
