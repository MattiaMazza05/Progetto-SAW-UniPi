import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
} from "flowbite-react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore";
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
    <div className="overflow-x-auto">
      <div className="flex flex-wrap gap-2"></div>
      <Table striped>
        <TableHead>
          <TableHeadCell>Data</TableHeadCell>
          <TableHeadCell>Peso</TableHeadCell>
          <TableHeadCell>Collo (cm)</TableHeadCell>
          <TableHeadCell>Vita (cm)</TableHeadCell>
          <TableHeadCell>Fianchi (cm)</TableHeadCell>
          <TableHeadCell>BF %</TableHeadCell>
          <TableHeadCell>Massa Grassa (kg)</TableHeadCell>
          <TableHeadCell>Massa Magra (kg)</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {dataHistory.length == 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Nessuna misurazione trovata.
              </TableCell>
            </TableRow>
          ) : (
            dataHistory.map((entry) => (
              <TableRow
                key={entry.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {entry.dateInput}
                </TableCell>
                <TableCell>{entry.weight}</TableCell>
                <TableCell>{entry.neck}</TableCell>
                <TableCell>{entry.waist}</TableCell>
                <TableCell>{entry.hips}</TableCell>
                <TableCell>{entry.bfP?.toFixed(1)}%</TableCell>
                <TableCell>{entry.fatMass?.toFixed(1)}</TableCell>
                <TableCell>{entry.leanMass?.toFixed(1)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
