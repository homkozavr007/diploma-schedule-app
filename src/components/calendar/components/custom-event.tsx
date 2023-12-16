import { SlotInfo } from "react-big-calendar";
import { OrganizationEvent } from "../../../models/OrganizationEvent";

export default function CustomEventComponent({
  event,
  slotInfo,
}: {
  event: OrganizationEvent;
  slotInfo?: SlotInfo;
}) {
  return (
    <div>
      <div className="float-right">
        {event.bookings?.length ?? 0}/{event.slotsAvailable}
      </div>
      <div>{event.title}</div>
    </div>
  );
}
