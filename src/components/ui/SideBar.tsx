import { FC } from "react";
import { useLocation } from "react-router-dom";
import { SidebarLink } from "../../types/side-bar-link";
import { cn } from "../../lib/utils";
import Mode from "./Mode";
import UserProfile from "./UserProfile";

const sidebarLinks: SidebarLink[] = [
  {
    activeIcon: "/icons/rfq-active.svg",
    passiveIcon: "/icons/rfq-passive.svg",
    label: "RFQs",
    href: "/rfqs",
  },
  {
    activeIcon: "/icons/chat-active.svg",
    passiveIcon: "/icons/chat-passive.svg",
    label: "Chat",
    href: "/chat",
  },
  {
    activeIcon: "/icons/transaction-active.svg",
    passiveIcon: "/icons/transaction-passive.svg",
    label: "Transactions",
    href: "/transactions",
  },
  {
    activeIcon: "/icons/report-active.svg",
    passiveIcon: "/icons/report-passive.svg",
    label: "Report",
    href: "/report",
  },
];

const mockUser = {
  name: "Fasika Ewnetu",
  avatar: "icons/building.png",
};

const Sidebar: FC = () => {
  const location = useLocation();

  return (
    <aside className="w-72 bg-transparent h-screen p-4">
      <div className="mb-8 text-center flex flex-col items-center">
        <img src="/icons/logo.svg" alt="TradeBridgeSolutions" className="h-8" />
        <p className="font-bold text-black">TradeBridgeSolutions</p>
      </div>

      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const isActive =
            location.pathname === link.href ||
            (location.pathname === "/" && link.href === "/rfqs");
          const iconSrc = isActive ? link.activeIcon : link.passiveIcon;

          return (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-md group transition-colors",
                isActive
                  ? "bg-white primary-color"
                  : "text-gray-600 hover:bg-white"
              )}
            >
              <img
                src={isActive ? link.activeIcon : link.passiveIcon}
                className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "primary-color" : "group-hover:primary-color"
                )}
                alt={`${link.label} Icon`}
              />
              <span
                className={cn(
                  "transition-colors",
                  isActive
                    ? "primary-color"
                    : "text-gray-600 group-hover:primary-color"
                )}
              >
                {link.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="flex flex-col justify-between mt-32 mb-10">
        <Mode />
        <UserProfile user={mockUser} />
        <button className="w-full px-4 py-2 text-red-500 hover:bg-red-50">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
