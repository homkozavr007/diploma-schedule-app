"use client";

import { forwardRef, useEffect, useState } from "react";
import OrganizationEventEditForm from "./organization-event-form";
import { SlotInfo } from "react-big-calendar";
import { OrganizationEvent } from "../../models/OrganizationEvent";
import BookersList from "./BookersList";

export interface EventEditDialogProps {
  slotInfo?: SlotInfo;
  event?: OrganizationEvent;
  onDeleteClickHandler?: (event: OrganizationEvent) => void;
}

const EventEditDialog = forwardRef<HTMLDialogElement, EventEditDialogProps>(
  ({ event, slotInfo, onDeleteClickHandler }, ref) => {
    const [tab, setTab] = useState<"event" | "activity">(
      event ? "activity" : "event"
    );

    useEffect(() => {
      if (event) {
        setTab("activity");
      } else {
        setTab("event");
      }
    }, [event, event?._id]);

    return (
      <dialog id="event_edit_modal" className="modal" ref={ref}>
        <div className="modal-box min-h-[40rem] flex flex-col">
          {event && (
            <div role="tablist" className="tabs tabs-bordered">
              <a
                role="tab"
                className={`tab ${tab === "event" && "tab-active"}`}
                onClick={() => setTab("event")}
              >
                Event
              </a>
              <a
                role="tab"
                className={`tab ${tab === "activity" && "tab-active"}`}
                onClick={() => setTab("activity")}
              >
                Activity
              </a>
            </div>
          )}

          {!event && <h3 className="font-bold text-lg">Create event</h3>}

          {tab === "event" && (
            <>
              <OrganizationEventEditForm
                eventToEdit={event ?? null}
                timeFromCalendar={
                  slotInfo
                    ? {
                        start: slotInfo.start,
                        end: slotInfo.end,
                      }
                    : null
                }
                onDelete={onDeleteClickHandler}
                onCompleted={function (): void {
                  (ref as any).current?.close();
                }}
                onCancel={function (): void {
                  (ref as any).current?.close();
                }}
              />
            </>
          )}

          {tab === "activity" && event && <BookersList event={event} />}

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
              tabIndex={0}
            >
              ✕
            </button>
          </form>
        </div>
      </dialog>
    );
  }
);

EventEditDialog.displayName = "EventEditDialog";

export default EventEditDialog;
