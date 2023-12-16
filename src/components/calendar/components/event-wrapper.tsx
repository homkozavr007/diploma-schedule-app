"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { OrganizationEvent } from "@/models/OrganizationEvent";
import { useCallback } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useDialogOpener } from "@/utils/use-dialog-opener";
import ConfirmationDialog, {
  ConfirmationDialogData,
} from "@/components/confirmation-dialog/confirmation-dialog";
import DialogHandler from "@/components/dialog-handler/dialog-handler";

export default function EventWrapper({
  event,
  children,
  onDeleteHandler,
  onEditHandler,
}: {
  event: OrganizationEvent;
  children: any;
  onDeleteHandler: (event: OrganizationEvent) => void;
  onEditHandler: (event: OrganizationEvent) => void;
}) {
  const { openDialog, dialogProps, onDialogRef } =
    useDialogOpener<ConfirmationDialogData>();
  const deleteClickHandler = useCallback(() => {
    openDialog(ConfirmationDialog, {
      title: "Delete event",
      content: "Are you sure you want to delete this event?",
      buttons: [
        {
          label: "Cancel",
          value: "cancel",
          className: "btn-ghost",
        },
        {
          label: "Delete",
          value: "delete",
          className: "btn-error",
        },
      ],
    }).then((res) => console.log("res:", res));
  }, [openDialog]);
  return (
    <>
      {dialogProps && (
        <DialogHandler
          DialogComponent={dialogProps.DialogComponent}
          params={dialogProps.params}
          onDialogRef={onDialogRef}
        />
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div
            className={`${
              (event.bookings?.length ?? 0) >= event.slotsAvailable
                ? `full`
                : ""
            }`}
          >
            {children}
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          {/* className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade" */}
          <DropdownMenu.Content
            sideOffset={5}
            className="rounded-2xl shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          >
            <ul className="menu bg-base-200 w-56 rounded-box">
              <DropdownMenu.Item asChild>
                <li>
                  <a onClick={() => onEditHandler(event)}>
                    <PencilIcon className="w-5 h-5" />
                    Edit
                  </a>
                </li>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <li>
                  <a onClick={() => onDeleteHandler(event)}>
                    <TrashIcon className="w-5 h-5" />
                    Delete
                  </a>
                </li>
              </DropdownMenu.Item>
            </ul>

            <DropdownMenu.Arrow className="fill-base-200" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
