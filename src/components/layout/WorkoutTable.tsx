import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { deleteDoc, doc } from "firebase/firestore";
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

export function WorkoutTable() {
  const workoutHistory = useWorkoutHistory(false);
  const { currentUser } = useAuth();

  async function deleteWorkout(id: string) {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid, "workoutHistory", id);
    await deleteDoc(docRef);
  }

  function formatDuration(duration: number) {
    return duration / 60;
  }

  function customIcon(type: string) {
    if (type == "Corsa") {
      return <SportShoe className="h-4 w-4" />;
    } else {
      return <Dumbbell className="h-4 w-4" />;
    }
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
              {customIcon(entry.type)}
              <span>{entry.type}</span>
            </TableCell>
            <TableCell>{formatDuration(entry.duration)} h</TableCell>
            <TableCell>
              {entry.type == "Corsa"
                ? `${entry.distance ?? 0} km`
                : `${entry.volume ?? 0} kg`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
