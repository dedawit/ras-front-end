import { FC } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { SidebarLink } from "../../types/side-bar-link";
import { cn } from "../../lib/utils";
import Mode from "./Mode";
import UserProfile from "./UserProfile";
import { useUser } from "../../context/UserContext";
import { authService } from "../../services/auth";
import { Notification } from "../ui/Notification";
import { useNotification } from "../../hooks/useNotification";

const userId = localStorage.getItem("userId");

const sidebarLinks: SidebarLink[] = [
  {
    activeIcon: "/icons/rfq-active.svg",
    passiveIcon: "/icons/rfq-passive.svg",
    label: "RFQs",
    href: "/rfq-seller",
  },
  {
    activeIcon: "/icons/bid-active.svg",
    passiveIcon: "/icons/bid-passive.svg",
    label: "Bids",
    href: "/bids",
  },
  {
    activeIcon: "/icons/product-active.svg",
    passiveIcon: "/icons/product-passive.svg",
    label: "Product",
    href: "/products",
  },
  // {
  //   activeIcon: "/icons/subscribe-active.svg",
  //   passiveIcon: "/icons/subscribe-passive.svg",
  //   label: "Subscribe",
  //   href: "/subscribe",
  // },
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
    href: userId ? `/report-seller/${userId}` : "/report-seller",
  },
];

const mockUser = {
  name: "Fasika Ewnetu",
  avatar: "/place_holder/fasika.jpg",
};

const SidebarSeller: FC = () => {
  const { fullName, token } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();

  const handleLogout = async () => {
    try {
      await authService.logout();
      showNotification("success", "Logout successful!");
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed", error);
      showNotification(
        "error",
        error.message || "Logout failed. Please try again."
      );
    }
  };

  return (
    <aside className="sidebar w-72 bg-transparent h-screen p-4 relative">
      {/* Notification Toast */}
      {notification && (
        <div className="absolute top-4 right-4 z-50">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="mb-8 text-center flex flex-col items-center">
        <img src="/icons/logo.svg" alt="TradeBridgeSolutions" className="h-8" />
        <p className="font-bold text-black">TradeBridgeSolutions</p>
      </div>

      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const isActive =
            matchPath({ path: link.href, end: false }, location.pathname) ||
            (location.pathname === "/" && link.href === "/rfq-seller");
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
                src={isActive ? link.activeIcon : link.passiveIcon}
                className={cn(
                  "w-5 h-5 transition-transform group-hover:hidden"
                )}
                alt={`${link.label} Icon`}
              />
              {/* Hover Image */}
              <img
                src={link.activeIcon}
                className="w-5 h-5 transition-transform hidden group-hover:block"
                alt={`${link.label} Hover Icon`}
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

      <div className="flex flex-col justify-between mt-2 mb-10">
        <Mode />
        <UserProfile
          user={{
            name: fullName || mockUser.name,
            avatar: mockUser.avatar || "/place_holder/default-avatar.jpg",
          }}
        />
        <button
          className="rounded-md w-full px-4 py-2 text-white bg-logout-color hover:bg-opacity-80 font-bold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SidebarSeller;
