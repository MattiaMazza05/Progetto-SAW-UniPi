import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

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


export function useMeasurementsHistory(forChart: boolean) {
const { currentUser } = useAuth();
  const [dataHistory, setDataHistory] = useState<MesauremetType[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setDataHistory([]);
      return;
    }

    const measurementsRef = collection(
      db,
      "userData",
      currentUser.uid,
      "mesaurementsHistory",
    );

    let q;
    if (forChart) {
      q = query(measurementsRef, orderBy("dateInput", "asc"));
    }else{
     q = query(measurementsRef, orderBy("dateInput", "desc"));
    }


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rawData = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as MesauremetType;
      });

      setDataHistory(rawData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return dataHistory;
}