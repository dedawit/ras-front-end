import { FC } from "react";
import { User } from "../../types/user";
interface UserProfileProps {
  user: User;
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-start px-4 py-2 space-y-3 my-2">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-20 h-20 rounded-full object-cover"
      />
      <div>
        <h3 className="font-bold text-gray-900">{user.name}</h3>
        <button className="text-primary text-sm hover:underline my-2">
          My Account
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
