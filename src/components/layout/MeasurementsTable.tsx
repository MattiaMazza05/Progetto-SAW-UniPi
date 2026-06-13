import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMeasurementsHistory } from "@/hooks/useMeasurementsHistory";
import { db } from "@/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/hooks/commonHooks";
//creo un interfaccia per i dati
//ho usato l'AI per aiutarmi nella creazione della tabella dinamica e per la creazione della query

export function MeasurementsTable() {
  const dataHistory = useMeasurementsHistory(false);
  const { currentUser } = useAuth();
  async function deleteData(id: string) {
    if (!currentUser) return;
    const docRef = doc(
      db,
      "userData",
      currentUser.uid,
      "measurementsHistory",
      id,
    );
    await deleteDoc(docRef);
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-3">Elimina</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Peso</TableHead>
          <TableHead>Collo (cm)</TableHead>
          <TableHead>Vita (cm)</TableHead>
          <TableHead>Fianchi (cm)</TableHead>
          <TableHead>BF %</TableHead>
          <TableHead>Massa Grassa (kg)</TableHead>
          <TableHead>Massa Magra (kg)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataHistory.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  deleteData(entry.id);
                  toast.success("Misurazione eliminata.", {
                    position: "top-center",
                  });
                }}
              >
                <Trash2 />
              </Button>
            </TableCell>
            <TableCell className="font-medium">
              {formatDate(entry.dateInput)}
            </TableCell>
            <TableCell>{entry.weight}</TableCell>
            <TableCell>{entry.neck}</TableCell>
            <TableCell>{entry.waist}</TableCell>
            <TableCell>{entry.hips}</TableCell>
            <TableCell>{entry.bfP?.toFixed(1)}%</TableCell>
            <TableCell>{entry.fatMass?.toFixed(1)}</TableCell>
            <TableCell>{entry.leanMass?.toFixed(1)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
