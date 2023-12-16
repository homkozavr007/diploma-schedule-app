import { getBookedUsersFromEventId } from "@/data/organization-events";
import { OrganizationEvent } from "@/models/OrganizationEvent";
import { User } from "@/models/User";
import { useEffect, useState } from "react";

export default function BookersList({ event }: { event: OrganizationEvent }) {
  const [bookers, setBookers] = useState<User[]>([]);
  useEffect(() => {
    (async () => {
      const users = await getBookedUsersFromEventId(event._id);
      setBookers(users);
    })();
  }, [event]);
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <tbody>
          {bookers.map((booker, i) => (
            <tr key={booker._id}>
              <th>{i + 1}</th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={booker.image} alt={booker.name} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{booker.name}</div>
                    <div className="text-sm opacity-50">
                      <a href={`mailto:${booker.email}`}>{booker.email}</a>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
