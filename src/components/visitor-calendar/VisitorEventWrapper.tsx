"use client";

import { OrganizationEvent } from "@/models/OrganizationEvent";
import { useMemo } from "react";

export default function VisitorEventWrapper({
  event,
  children,
  userId,
}: {
  event: OrganizationEvent;
  children: any;
  userId: string | null;
}) {
  const isUserBooked = useMemo(() => {
    return event.bookings?.some(
      (booking) => booking.user.toString() === userId
    );
  }, [userId, event]);

  const isSlotsAvailable = useMemo(() => {
    return (event.bookings?.length ?? 0) < event.slotsAvailable;
  }, [event]);

  return (
    <div
      className={`${
        isUserBooked
          ? `cal-user-booked`
          : !isSlotsAvailable
          ? `cal-event-full`
          : ``
      }`}
    >
      {children}
    </div>
  );
}
