import { Organization } from "../../../models/Organization";
import { useUserPlaceDeleteDialogStore } from "../store/user-place-delete-dialog-store";

export function openUserPlaceDeleteDialog(
  place: Organization
): Promise<string | null> {
  useUserPlaceDeleteDialogStore.setState({ place });
  const dialogId = "user_place_delete_dialog";
  return new Promise((resolve) => {
    const dialog: HTMLDialogElement | null = document.getElementById(
      dialogId
    ) as HTMLDialogElement;
    if (!dialog) {
      throw new Error(`Dialog with id ${dialogId} not found`);
    }
    dialog.showModal();

    const onClose = () => {
      dialog.removeEventListener("close", onClose);
      tearDown();
      resolve(dialog.returnValue);
    };

    const onCancel = () => {
      dialog.removeEventListener("cancel", onCancel);
      tearDown();
      resolve(null);
    };

    function tearDown() {
      dialog?.removeEventListener("close", onClose);
      dialog?.removeEventListener("cancel", onCancel);
    }

    // Listen for the 'close' event on the dialog
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("cancel", onCancel);
  });
}
