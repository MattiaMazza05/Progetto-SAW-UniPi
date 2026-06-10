import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Trash2, SportShoe, Dumbbell } from "lucide-react";
import { formatDate } from "@/hooks/commonHooks";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export function WorkoutTable() {
  const workoutHistory = useWorkoutHistory(false);
  const { currentUser } = useAuth();
  const [stravaAccessToken, setStravaAccessToken] = useState("");

  async function deleteWorkout(id: string) {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid, "workoutHistory", id);
    await deleteDoc(docRef);
  }

  function formatDuration(duration: number) {
    return duration / 60;
  }

  function customIcon(type: string) {
    const normalizedType = normalizedWorkoutType(type);
    if (normalizedType == "Corsa") {
      return <SportShoe className="h-4 w-4" />;
    } else {
      return <Dumbbell className="h-4 w-4" />;
    }
  }
  useEffect(() => {
    async function getStravaAccesToken() {
      if (!currentUser) return;
      const userRef = doc(db, "userData", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.stravaAccessToken) {
          setStravaAccessToken(userData.stravaAccessToken);
        }
      }
    }
    getStravaAccesToken();
  }, [currentUser]);

  type StravaActivity = {
    id: number;
    start_date: string;
    name: string;
    sport_type: string;
    moving_time: number;
    distance: number;
    device_name: string;
  };

  useEffect(() => {
    if (!stravaAccessToken) return;
    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const after = Math.floor(oneMonthAgo.getTime() / 1000);

    const url = `https://www.strava.com/api/v3/athlete/activities?before=${now}&after=${after}&page=1&per_page=60`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${stravaAccessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Attività Strava:", data);
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

        console.log("Attività formattate: ", formattedActivity);
      });
  }, [stravaAccessToken]);

  function normalizedWorkoutType(type: string) {
    if (type == "Corsa" || type == "Run") {
      return "Corsa";
    }
    if (type == "Pesi" || type == "WeightTraining") {
      return "Pesi";
    }
    return type;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-3">Elimina</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo attività</TableHead>
          <TableHead>Durata (min)</TableHead>
          <TableHead> Distanza / Volume</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workoutHistory.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  deleteWorkout(entry.id);
                  toast.success("Misurazione eliminata.", {
                    position: "top-center",
                  });
                }}
              >
                <Trash2 />
              </Button>
            </TableCell>
            <TableCell className="font-medium">
              Settimana: {formatDate(entry.date)}
            </TableCell>
            <TableCell>{entry.title}</TableCell>
            <TableCell className="flex items-center gap-2">
              {customIcon(normalizedWorkoutType(entry.type))}
              <span>{normalizedWorkoutType(entry.type)}</span>
            </TableCell>
            <TableCell>{formatDuration(entry.duration)} h</TableCell>
            <TableCell>
              {normalizedWorkoutType(entry.type) == "Corsa"
                ? `${entry.distance ?? 0} km`
                : `${entry.volume ?? 0} kg`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
