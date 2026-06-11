import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { normalizedWorkoutType } from "@/hooks/commonHooks";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { Spinner } from "../ui/spinner";
type StravaActivity = {
  id: number;
  start_date: string;
  name: string;
  sport_type: string;
  moving_time: number;
  distance: number;
  device_name: string;
};

export function StravaSyncButton() {
  const { currentUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  async function syncStravaActivity() {
    if (!currentUser) return;

    setIsSyncing(true);

    try {
      const userRef = doc(db, "userData", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("Strava non collegato.");
        return;
      }

      const userData = userSnap.data();
      const stravaAccessToken = userData.stravaAccessToken;

      if (!stravaAccessToken) {
        toast.error("Strava non collegato.");
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const after = Math.floor(oneMonthAgo.getTime() / 1000);
      const url = `https://www.strava.com/api/v3/athlete/activities?before=${now}&after=${after}&page=1&per_page=60`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${stravaAccessToken}`,
        },
      });
      const data = await response.json();
      const formattedActivity = data.map((entry: StravaActivity) => {
        return {
          stravaId: entry.id,
          date: entry.start_date.split("T")[0],
          title: entry.name,
          type: normalizedWorkoutType(entry.sport_type),
          duration: Math.round(entry.moving_time / 60),
          distance: entry.distance
            ? Number((entry.distance / 1000).toFixed(2))
            : null,
          volume: null,
          source: entry.device_name,
        };
      });
      for (const activity of formattedActivity) {
        const workoutRef = doc(
          db,
          "userData",
          currentUser.uid,
          "workoutHistory",
          String(activity.stravaId),
        );
        await setDoc(workoutRef, activity, { merge: true });
      }
      toast.success("Sincronizzazione Strava completata", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Errore sincronizzazione Strava: ", error);
      toast.error("Errore durante la sincronizzazione");
    } finally {
      setIsSyncing(false);
    }
  }
  return (
    <Button
      className="h-11 w-full justify-center gap-2 bg-[#FC5200] text-white hover:bg-[#e84a00]"
      type="button"
      onClick={syncStravaActivity}
      disabled={isSyncing}
    >
      {isSyncing ? (
        <>
          <Spinner data-icon="inline-start" />
          <span>Sincronizzazione</span>
        </>
      ) : (
        <>
          <RefreshCcw className="h-5 w-5" />
          <span>Sincronizza Strava</span>
        </>
      )}
    </Button>
  );
}
