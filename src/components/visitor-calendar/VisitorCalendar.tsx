"use client";

import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useFoundEvents } from "@/store/found-events/found-events";
import { Calendar, DateRange, View, Views } from "react-big-calendar";
import { localizer } from "@/utils/localizer";
import { dateRangeToString } from "@/utils/date-range-to-string";
import CustomEventComponent from "../calendar/components/custom-event";
import { OrganizationEvent } from "@/models/OrganizationEvent";
import { BookDialogContext } from "@/contexts/booking-dialog-context";
import BookDialog from "../book-dialog/book-dialog";
import VisitorEventWrapper from "./VisitorEventWrapper";
import { useSession } from "next-auth/react";
import { useEventsSearchParams } from "@/store/found-events/use-events-search-params";

export function VisitorCalendar() {
  const eventList = useFoundEvents((state) => state.events);
  const view = useFoundEvents((state) => state.view);
  const setView = useFoundEvents((state) => state.setView);
  const calendarRef = useRef<any>(null);
  const { patchEventsSearchParams, range } = useEventsSearchParams();

  // useEffect(() => {
  //   if (calendarRef.current && !range) {
  //     calendarRef.current.handleViewChange("month");
  //   }
  // }, [calendarRef, range]);

  const { data } = useSession();

  const dateToSet = useMemo(() => {
    if (!range) {
      return undefined;
    }
    return new Date((range.end.getTime() + range.start.getTime()) / 2);
  }, [range]);

  const onRangeChange = useCallback(
    (newRange: Date[] | DateRange) => {
      console.log("newRange", newRange);
      if (Array.isArray(newRange)) {
        const [start, end] = dateRangeToString(
          newRange[0],
          newRange[newRange.length - 1]
        );
        patchEventsSearchParams({ start, end });
      } else {
        const [start, end] = dateRangeToString(newRange.start, newRange.end);
        patchEventsSearchParams({ start, end });
      }
    },
    [patchEventsSearchParams]
  );

  const openBookDialog = useContext(BookDialogContext);

  const onSelectEvent = useCallback(
    (event: OrganizationEvent) => {
      openBookDialog(BookDialog, { event });
    },
    [openBookDialog]
  );

  const onView = useCallback(
    (newView: View) => {
      setView(newView);
    },
    [setView]
  );

  const EventWrapper = ({
    event,
    children,
  }: {
    event: OrganizationEvent;
    children: any;
  }) => {
    return VisitorEventWrapper({
      event,
      children,
      userId: data?.user?.id ?? null,
    });
  };

  return (
    <Calendar
      ref={calendarRef}
      components={{
        event: CustomEventComponent,
        eventWrapper: EventWrapper as any,
      }}
      localizer={localizer}
      events={eventList}
      showAllEvents={true}
      date={dateToSet}
      startAccessor="start"
      endAccessor="end"
      style={{}}
      showMultiDayTimes
      selectable
      onRangeChange={onRangeChange}
      onNavigate={(e) => {
        console.log("onNavigate", e);
      }}
      onView={onView}
      view={view}
      views={[Views.MONTH, Views.WEEK, Views.DAY]}
      onSelectEvent={onSelectEvent}
    />
  );
}
