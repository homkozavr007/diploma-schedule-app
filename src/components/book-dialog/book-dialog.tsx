"use client";

import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useSession } from "next-auth/react";
import { OrganizationEvent } from "../../models/OrganizationEvent";
import { useFoundEvents } from "../../store/found-events/found-events";
import EventDescription from "../event-description/EventDescription";

export interface BookDialogProps {
  event: OrganizationEvent;
}

const BookDialog = forwardRef<HTMLDialogElement, BookDialogProps>(
  ({ event }, ref) => {
    const { status: sessionStatus } = useSession();
    const bookEvent = useFoundEvents((state) => state.bookEvent);
    const cancelEvent = useFoundEvents((state) => state.cancelEvent);
    let [_, startTransition] = useTransition();
    const { data } = useSession();
    const [bookingInProgress, setBookingInProgress] = useState(false);

    const isUserBooked = useMemo(() => {
      return event.bookings?.some(
        (booking) => booking.user.toString() === data?.user?.id
      );
    }, [data, event]);

    const bookClickHandler = useCallback(() => {
      setBookingInProgress(true);
      startTransition(async () => {
        await bookEvent(event._id, data?.user?.id ?? "");
        setBookingInProgress(false);
        (ref as any).current?.close();
      });
    }, [bookEvent, event, data, ref]);

    const cancelClickHandler = useCallback(() => {
      setBookingInProgress(true);
      startTransition(async () => {
        await cancelEvent(event._id, data?.user?.id ?? "");
        setBookingInProgress(false);
        (ref as any).current?.close();
      });
    }, [cancelEvent, event._id, data?.user?.id, ref]);

    return (
      <dialog id="book_modal" className="modal" ref={ref}>
        <div className="modal-box">
          {sessionStatus === "unauthenticated" && (
            <div
              role="alert"
              className="alert alert-info p-2 rounded-lg text-xs"
            >
              <span>To book appointment you need to be authenticated</span>
            </div>
          )}
          <h3 className="font-bold text-lg">
            {isUserBooked
              ? "Cancel my appointment on "
              : "Book my appointment on "}
            {event.title}
          </h3>

          <EventDescription event={event} />
          <div className="modal-action">
            <button
              className="btn"
              onClick={function (): void {
                (ref as any).current?.close();
              }}
              disabled={bookingInProgress}
            >
              Close
            </button>
            {sessionStatus === "authenticated" && isUserBooked && (
              <button
                className="btn btn-warning"
                onClick={cancelClickHandler}
                disabled={bookingInProgress}
              >
                {bookingInProgress && (
                  <span className="loading loading-spinner"></span>
                )}
                Cancel my booking
              </button>
            )}
            {sessionStatus === "authenticated" && !isUserBooked && (
              <button
                className="btn btn-primary"
                onClick={bookClickHandler}
                disabled={bookingInProgress}
              >
                {bookingInProgress && (
                  <span className="loading loading-spinner"></span>
                )}
                I&apos;ll be there
              </button>
            )}
          </div>
        </div>
      </dialog>
    );
  }
);

BookDialog.displayName = "BookDialog";

export default BookDialog;
