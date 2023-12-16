import { Organization } from "@/models/Organization";
import { OrganizationEvent } from "@/models/OrganizationEvent";
import { format, formatDistance } from "date-fns";

export default function EventDescription({
  event,
}: {
  event: OrganizationEvent;
}) {
  return (
    <>
      <time dateTime={event.start.toISOString()} className="text-xs">
        {format(event.start, "EEEE, MMMM d, yyyy HH:mm")}
        <br />
        {formatDistance(event.start, event.end)}
      </time>
      <p>{event.description}</p>
      <p>
        {(event.organization as any as Organization).name}
        <br />
        {(event.organization as any as Organization).address}
        <br />
        <a href={`tel:${(event.organization as any as Organization).phone}`}>
          {(event.organization as any as Organization).phone}
        </a>
        <br />
      </p>
    </>
  );
}
