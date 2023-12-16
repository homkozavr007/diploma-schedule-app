"use client";

import { useFoundEvents } from "@/store/found-events/found-events";
import BookDialog from "../book-dialog/book-dialog";
import { useCallback, useContext } from "react";
import { OrganizationEvent } from "@/models/OrganizationEvent";
import VisitorEventCard from "./VisitorEventCard";
import { useSession } from "next-auth/react";
import { BookDialogContext } from "@/contexts/booking-dialog-context";

export function VisitorEventList() {
  const eventList = useFoundEvents((state) => state.events);

  const openBookDialog = useContext(BookDialogContext);

  const onBookHandler = useCallback(
    (event: OrganizationEvent) => {
      openBookDialog(BookDialog, { event });
    },
    [openBookDialog]
  );

  const { data } = useSession();
  return (
    <div className="p-4 grid gap-4 justify-center viewer-events-grid-template">
      {eventList.map((event) => {
        return (
          <VisitorEventCard
            key={event._id}
            event={event}
            userId={data?.user?.id ?? ""}
            onBookClickHandler={() => {
              onBookHandler(event);
            }}
          />
        );
      })}
    </div>
  );
}
