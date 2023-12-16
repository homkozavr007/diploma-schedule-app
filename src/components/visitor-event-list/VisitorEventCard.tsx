import { useMemo } from "react";
import { OrganizationEvent } from "../../models/OrganizationEvent";
import EventDescription from "../event-description/EventDescription";

export default function VisitorEventCard({
  event,
  onBookClickHandler,
  userId,
}: {
  event: OrganizationEvent;
  userId: string;
  onBookClickHandler: (event: OrganizationEvent) => void;
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
    <div className="card-compact bg-base-100 shadow-xl" key={event._id}>
      <div className="card-body h-full relative">
        <div
          className={`badge gap-2 font-semibold absolute top-4 right-4 ${
            (event.bookings?.length ?? 0) < event.slotsAvailable
              ? "badge-info"
              : "badge-warning"
          }`}
        >
          {event.bookings?.length ?? 0}/{event.slotsAvailable}
        </div>
        <h2 className="card-title mr-20">{event.title}</h2>
        <EventDescription event={event} />
        <div className="card-actions justify-end">
          {isUserBooked && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                onBookClickHandler(event);
              }}
            >
              Cancel booking
            </button>
          )}
          {!isUserBooked && (
            <button
              className="btn btn-primary btn-sm"
              disabled={!isSlotsAvailable}
              onClick={() => {
                onBookClickHandler(event);
              }}
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
