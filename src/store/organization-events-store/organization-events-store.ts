import { create } from "zustand";
import {
  OrganizationEvent,
  OrganizationEventInput,
} from "../../models/OrganizationEvent";
import {
  createMyOrganizationEvent,
  deleteMyOrganizationEvent,
  updateMyOrganizationEvent,
} from "../../data/organization-events";

interface OrganizationEventsState {
  events: OrganizationEvent[];
  eventToEdit: OrganizationEvent | null;
  addEvent: (
    organizationId: string,
    eventInput: OrganizationEventInput
  ) => Promise<void>;
  updateEvent: (
    eventId: string,
    eventInput: OrganizationEventInput
  ) => Promise<void>;
  setEvents: (events: OrganizationEvent[]) => void;
  deleteEvent: (eventId: string) => Promise<void>;
}

export const useOrganizationEventsStore = create<OrganizationEventsState>(
  (set) => ({
    events: [],
    eventToEdit: null,
    setEvents: (events: OrganizationEvent[]) => set(() => ({ events })),
    addEvent: async (
      organizationId: string,
      eventInput: OrganizationEventInput
    ) => {
      const event = await createMyOrganizationEvent(organizationId, eventInput);
      set((store) => ({ events: [...store.events, event] }));
    },
    updateEvent: async (
      eventId: string,
      eventInput: OrganizationEventInput
    ) => {
      const updatedEvent = await updateMyOrganizationEvent({
        ...eventInput,
        _id: eventId,
      });
      set((state) => ({
        events: state.events.map((e) =>
          e._id === updatedEvent._id ? updatedEvent : e
        ),
      }));
    },

    deleteEvent: async (eventId: string) => {
      await deleteMyOrganizationEvent(eventId);
      set((store) => ({
        events: store.events.filter((event) => event._id !== eventId),
      }));
    },
  })
);
