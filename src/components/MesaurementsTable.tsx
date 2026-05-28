import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

//creo un interfaccia per i dati
//ho usato l'AI per aiutarmi nella creazione della tabella dinamica e per la creazione della query
export interface MesauremetType {
  id: string;
  dateInput: string;
  weight: number;
  neck: number;
  waist: number;
  hips: number;
  bfP: number;
  fatMass: number;
  leanMass: number;
}

export function MesaurementsTable() {
  const { currentUser } = useAuth();
  const [dataHistory, setDataHistory] = useState<MesauremetType[]>([]);
  useEffect(() => {
    if (!currentUser) return;
    const mesaurementsRef = collection(
      db,
      "userData",
      currentUser.uid,
      "mesaurementsHistory",
    );
    const q = query(mesaurementsRef, orderBy("timeStamp", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const rawData = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as MesauremetType;
      });
      setDataHistory(rawData);
    });
    return () => unsub();
  }, [currentUser]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Data</TableHead>
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
            <TableCell className="font-medium">{entry.dateInput}</TableCell>
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
