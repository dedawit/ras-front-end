import { FC } from "react";
import { User } from "../../types/user";
import { FaUserCircle } from "react-icons/fa";
interface UserProfileProps {
  user: User;
}

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-start px-4 py-2 space-y-3 my-2">
      <FaUserCircle
        className="w-28 h-28 rounded-full text-gray-400"
        title={user.name}
        aria-label={`Profile picture for ${user.name}`}
      />
      <div>
        <h3 className="font-bold text-gray-900">{user.name}</h3>
        <button className="primary-color text-sm  my-2 flex items-center">
          My Account{" "}
          <span className="ms-2">
            <img src="/icons/triangle.svg" className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
