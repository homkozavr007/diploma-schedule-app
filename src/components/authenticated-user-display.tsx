import { User } from "next-auth";

export default async function AuthenticatedUserDisplay({
  user,
}: {
  user: User;
}) {
  return (
    <div className="flex gap-2 items-center">
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src={user.image ?? undefined} alt={`${user.name}'s avatar`} />
        </div>
      </div>
      <div className="flex items-center flex-1 min-w-0">
        <strong className="flex-1 truncate">{user.name}</strong>
      </div>
    </div>
  );
}
