export function formatDate(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

 export function normalizedWorkoutType(type: string) {
    if (type === "Corsa" || type === "Run") {
      return "Corsa";
    }

    if (type === "Pesi" || type === "WeightTraining") {
      return "Pesi";
    }

    return type;
  }
export function sendNotification(titolo: string, messaggio: string) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.ready.then((registration) => {

      registration.showNotification(titolo, {
        body: messaggio,
        icon: "/icons/app-icon-192.png",
        badge: "/icons/app-icon-192.png",
      });
    });
  } else {
    console.log("Notifica non inviata: permesso non concesso.");
  }
}