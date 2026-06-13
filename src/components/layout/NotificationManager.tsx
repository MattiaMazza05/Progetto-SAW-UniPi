import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { sendNotification } from "@/hooks/commonHooks";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function NotificationManager() {
  type NotificationUserData = {
    notificationsEnabled: boolean;
    notificationTime: string;
  };
  const { currentUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");
  useEffect(() => {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as NotificationUserData;
        setNotificationsEnabled(data.notificationsEnabled);
        setNotificationTime(data.notificationTime);
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
  if (!notificationsEnabled || !notificationTime) {
    return;
  }

  function getDelay() {
    const [hours, minutes] = notificationTime.split(":").map(Number);

    const now = new Date();

    const userTime = new Date();
    userTime.setHours(hours, minutes, 0, 0);

    if (userTime <= now) {
      userTime.setDate(userTime.getDate() + 1);
    }

    return userTime.getTime() - now.getTime();
  }

  function scheduleNotification() {
    const delay = getDelay();

    const timer = window.setTimeout(() => {
      sendNotification(
        "Promemoria giornaliero",
        "Ricordati di completare la checklist!"
      );

      scheduleNotification();
    }, delay);

    return timer;
  }

  const timer = scheduleNotification();

  return () => clearTimeout(timer);
}, [notificationsEnabled, notificationTime]);
  return null;
}
