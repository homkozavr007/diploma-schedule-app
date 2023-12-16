import mongoose, { Types } from "mongoose";

interface GoogleCalendarRecord {
  id: string;
}

export type OrganizationEventGoogleCalendar = mongoose.Mixed &
  GoogleCalendarRecord;

export interface OrganizationEventBooking {
  user: Types.ObjectId;
  googleCalendar?: OrganizationEventGoogleCalendar;
}

const OrganizationEventBookingSchema =
  new mongoose.Schema<OrganizationEventBooking>({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    googleCalendar: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },
  });

export interface OrganizationEvent extends mongoose.Document {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  organization: Types.ObjectId;
  description?: string;
  owner: Types.ObjectId;
  slotsAvailable: number;
  bookings: OrganizationEventBooking[];
}

const OrganizationEventSchema = new mongoose.Schema<OrganizationEvent>({
  start: {
    type: Date,
    required: [true, "Please provide the start date."],
  },
  end: {
    type: Date,
    required: [true, "Please provide the end date."],
  },
  title: {
    type: String,
    required: [true, "Please provide the event title."],
  },
  allDay: {
    type: Boolean,
    required: [false],
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: [true, "Please provide an organization"],
  },
  description: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
  slotsAvailable: {
    type: Number,
    required: [true, "Please provide the number of slots available"],
  },
  bookings: [OrganizationEventBookingSchema],
});

OrganizationEventSchema.index({ title: "text", description: "text" });

export default mongoose.models.OrganizationEvent ||
  mongoose.model<OrganizationEvent>(
    "OrganizationEvent",
    OrganizationEventSchema
  );

export type OrganizationEventInput = Pick<
  OrganizationEvent,
  "title" | "start" | "end" | "allDay" | "description" | "slotsAvailable"
>;
