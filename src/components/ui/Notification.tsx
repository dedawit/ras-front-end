import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`
      fixed top-4 left-1/2 -translate-x-1/2 mx-auto 
    w-full sm:w-auto md:w-96
    ${styles[type]}
    flex items-center justify-between p-4 border rounded-lg
    animate-notification shadow-lg
    `}
      role="alert"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
