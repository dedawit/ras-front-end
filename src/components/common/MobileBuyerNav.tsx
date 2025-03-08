import { FC } from "react";
import { SidebarLink } from "../../types/side-bar-link";
import Mode from "../ui/Mode";
import UserProfile from "../ui/UserProfile";
import { cn } from "../../lib/utils";
import { LogoInside } from "./LogoInside";
import { useUser } from "../../context/UserContext";

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
  avatar: "/place_holder/fasika.jpg",
};

interface MobileBuyerNavProps {
  onClose: () => void;
}

const MobileBuyerNav: FC<MobileBuyerNavProps> = ({ onClose }) => {
  const { fullName } = useUser();

  return (
    <div className="relative h-full  bg-brand">
      {/* Mobile Header */}
      <div className="flex items-center justify-between w-full p-4 bg-transparent mobile-header">
        {/* Hamburger Menu Icon */}
        <img
          src="/icons/menu.svg"
          alt="Hamburger Menu"
          className="w-8 h-8 cursor-pointer"
          onClick={onClose}
        />

        {/* Logo */}
        <LogoInside />

        {/* Search Icon */}
        <img
          src="/icons/x.svg"
          alt="Search"
          className="w-8 h-8 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const isActive =
            location.pathname.startsWith(link.href) ||
            (location.pathname === "/" && link.href === "/rfqs");
          const iconSrc = isActive ? link.activeIcon : link.passiveIcon;

          return (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-md group transition-colors",
                isActive
                  ? "bg-white text-primary-color"
                  : "text-gray-600 hover:bg-white hover:text-primary-color"
              )}
            >
              <img
                src={iconSrc}
                className={cn(
                  "w-5 h-5 transition-transform group-hover:hidden"
                )}
                alt={`${link.label} Icon`}
              />
              <span
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-primary-color"
                    : "text-gray-600 group-hover:text-primary-color"
                )}
              >
                {link.label}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="flex flex-col justify-between mt-10 mb-10 w-full ">
        <Mode />
        <UserProfile
          user={{
            name: fullName || "Anonymous User",
            avatar: mockUser.avatar || "/place_holder/default-avatar.jpg",
          }}
        />
        <button className="rounded-md mx-2 px-4 py-2 text-white bg-logout-color hover:bg-opacity-80 font-bold ">
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileBuyerNav;
