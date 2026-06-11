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
