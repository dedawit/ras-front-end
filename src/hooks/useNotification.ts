import { useState, useCallback } from "react";

type NotificationType = "success" | "error";

interface NotificationState {
  type: NotificationType;
  message: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );

  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      setNotification({ type, message });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
