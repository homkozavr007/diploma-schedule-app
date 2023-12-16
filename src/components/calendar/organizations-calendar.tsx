"use client";

import { Calendar } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useOrganizationEventsStore } from "../../store/organization-events-store/organization-events-store";
import EventEditDialog, {
  EventEditDialogProps,
} from "../organizarion-events/event-edit-dialog";
import DialogHandler from "../dialog-handler/dialog-handler";
import { useDialogOpener } from "@/utils/use-dialog-opener";
import EventWrapper from "./components/event-wrapper";
import { OrganizationEvent } from "@/models/OrganizationEvent";
import { useCallback, useEffect, useState } from "react";
import ConfirmationDialog, {
  ConfirmationDialogData,
} from "../confirmation-dialog/confirmation-dialog";
import { localizer } from "../../utils/localizer";
import CustomEventComponent from "./components/custom-event";
import { useUserPlacesListStore } from "../places/store/user-places-list-store";
import { set } from "date-fns";

export default function OrganizationsCalendar() {
  const {
    openDialog: openEditDialog,
    dialogProps,
    onDialogRef,
    closeDialog: closeEditDialog,
    setDialogProps: setEditDialogProps,
  } = useDialogOpener<EventEditDialogProps>();

  const eventList = useOrganizationEventsStore((state) => state.events);
  const deleteEvent = useOrganizationEventsStore((state) => state.deleteEvent);
  const organizations = useUserPlacesListStore((state) => state.places);

  const [createOrganizationToast, setCreateOrganizationToast] =
    useState<boolean>(false);

  useEffect(() => {
    if (createOrganizationToast) {
      const timer = setTimeout(() => {
        setCreateOrganizationToast(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [createOrganizationToast]);

  const {
    openDialog: openDeleteDialog,
    dialogProps: confirmationDialogProps,
    onDialogRef: onConfirmationDialogRef,
  } = useDialogOpener<ConfirmationDialogData>();

  const onDeleteHandler = useCallback(
    (event: OrganizationEvent) => {
      openDeleteDialog(ConfirmationDialog, {
        title: "Delete event",
        content: (
          <p>
            Are you sure you want to delete <strong>{event.title}</strong>{" "}
            event?
          </p>
        ),
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
      })
        .then((res) => {
          if (res === "delete") {
            return deleteEvent(event._id).then(() => "deleted");
          }
        })
        .then((res) => {
          if (res === "deleted") {
            closeEditDialog();
          }
        });
    },
    [openDeleteDialog, deleteEvent, closeEditDialog]
  );

  const onEditHandler = useCallback(
    (event: OrganizationEvent) => {
      openEditDialog(EventEditDialog, {
        event,
        onDeleteClickHandler: onDeleteHandler,
      }).then(() => {
        setEditDialogProps(null);
      });
    },
    [openEditDialog, setEditDialogProps, onDeleteHandler]
  );

  // const EventWrapperWithCallback = ({
  //   event,
  //   children,
  // }: {
  //   event: OrganizationEvent;
  //   children: any;
  // }) => {
  //   return EventWrapper({ event, children, onDeleteHandler, onEditHandler });
  // };

  return (
    <>
      <div className="toast toast-bottom toast-end z-10">
        {createOrganizationToast && (
          <div className="alert alert-info">
            <span>Create organization first</span>
          </div>
        )}
      </div>
      {confirmationDialogProps && (
        <DialogHandler
          DialogComponent={confirmationDialogProps.DialogComponent}
          params={confirmationDialogProps.params}
          onDialogRef={onConfirmationDialogRef}
        />
      )}
      {dialogProps && (
        <DialogHandler
          DialogComponent={dialogProps.DialogComponent}
          params={dialogProps.params}
          onDialogRef={onDialogRef}
        />
      )}
      <Calendar
        localizer={localizer}
        events={eventList}
        components={{
          event: CustomEventComponent as any,
          // eventWrapper: EventWrapperWithCallback as any,
        }}
        startAccessor="start"
        endAccessor="end"
        style={{}}
        showMultiDayTimes
        selectable
        onSelectSlot={(slotInfo) => {
          if (organizations.length === 0) {
            setCreateOrganizationToast(true);
            return;
          }
          openEditDialog(EventEditDialog, { slotInfo });
        }}
        onSelectEvent={onEditHandler}
      />
    </>
  );
}
