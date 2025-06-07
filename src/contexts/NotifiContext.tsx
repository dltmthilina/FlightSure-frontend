"use client";

import { createContext } from "react";
import { Toaster, toast } from "sonner";
import { NotificationType } from "../types";


interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

NotificationContext.displayName = "NotificationContext";

export function NotificationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const showNotification = (type: NotificationType, message: string) => {
    if (type === "success") {
      toast.success("Success", { description: message, duration: 4000 });
    } else if (type === "error") {
      toast.error("Error", { description: message, duration: 7000 });
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Toaster position="top-right" richColors={false} />
    </NotificationContext.Provider>
  );
}
