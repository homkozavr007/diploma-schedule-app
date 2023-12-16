"use client";

import { MainPageViewTabNames } from "@/types/main-page-view-tabs";
import { useMainPageView } from "../../store/main-page-view/main-page-view";
import { VisitorCalendar } from "../visitor-calendar/VisitorCalendar";
import { VisitorEventList } from "../visitor-event-list/VisitorEventList";
import { BookDialogContext } from "@/contexts/booking-dialog-context";
import { useDialogOpener } from "@/utils/use-dialog-opener";
import { BookDialogProps } from "../book-dialog/book-dialog";
import DialogHandler from "../dialog-handler/dialog-handler";
import { useFoundEvents } from "@/store/found-events/found-events";
import Link from "next/link";

export function MainPageViewTabs() {
  const tab = useMainPageView((state) => state.tab);
  const setTab = useMainPageView((state) => state.setTab);
  const {
    openDialog: openBookDialog,
    dialogProps: bookDialogProps,
    onDialogRef: onBookDialogRef,
  } = useDialogOpener<BookDialogProps>();

  const eventList = useFoundEvents((state) => state.events);

  return (
    <>
      {bookDialogProps && (
        <DialogHandler
          DialogComponent={bookDialogProps.DialogComponent}
          params={bookDialogProps.params}
          onDialogRef={onBookDialogRef}
        />
      )}

      <BookDialogContext.Provider value={openBookDialog}>
        <div className="h-full flex flex-col">
          <div className="navbar bg-base-100 shadow-sm shadow-gray-300 z-10">
            <ul className="menu menu-horizontal flex-1">
              <li>
                <a
                  className={`${
                    tab === MainPageViewTabNames.CALENDAR && "active"
                  }`}
                  onClick={() => setTab(MainPageViewTabNames.CALENDAR)}
                >
                  Calendar
                </a>
              </li>
              <li>
                <a
                  className={`${tab === MainPageViewTabNames.LIST && "active"}`}
                  onClick={() => setTab(MainPageViewTabNames.LIST)}
                >
                  Event list
                  <span className="badge badge-sm">{eventList.length}</span>
                </a>
              </li>
            </ul>
            <Link href="/">
              <img src="/yabudu-logo.png" alt="yaBudu logo" className="h-12" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            {tab === MainPageViewTabNames.CALENDAR && <VisitorCalendar />}
            {tab === MainPageViewTabNames.LIST && <VisitorEventList />}
          </div>
        </div>
      </BookDialogContext.Provider>
    </>
  );
}
