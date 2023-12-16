import { create } from "zustand";
import { OrganizationEvent } from "../../models/OrganizationEvent";
import { View, Views } from "react-big-calendar";
import { bookEvent, cancelEvent } from "../../data/organization-events";

interface FoundEventsState {
  events: OrganizationEvent[];
  view: View;
  setEvents: (events: OrganizationEvent[]) => void;
  setView: (view: View) => void;
  bookEvent: (eventId: string, userId: string) => Promise<void>;
  cancelEvent: (eventId: string, userId: string) => Promise<void>;
}

export const useFoundEvents = create<FoundEventsState>((set) => {
  return {
    events: [],
    view: Views.MONTH,

    setEvents: (events: OrganizationEvent[]) => set(() => ({ events })),
    setView: (view: View) => set(() => ({ view })),
    bookEvent: async (eventId: string, userId: string) => {
      const bookedEvent = await bookEvent(eventId, userId);
      set((state) => ({
        events: state.events.map((e) =>
          e._id === bookedEvent._id ? bookedEvent : e
        ),
      }));
    },
    cancelEvent: async (eventId: string, userId: string) => {
      const bookedEvent = await cancelEvent(eventId, userId);
      set((state) => ({
        events: state.events.map((e) =>
          e._id === bookedEvent._id ? bookedEvent : e
        ),
      }));
    },
  } satisfies FoundEventsState;
});
