import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import type { Measurement } from "@/types/measurement";

export function useMeasurementsHistory(forChart: boolean) {
const { currentUser } = useAuth();
  const [dataHistory, setDataHistory] = useState<Measurement[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setDataHistory([]);
      return;
    }

    const measurementsRef = collection(
      db,
      "userData",
      currentUser.uid,
      "measurementsHistory",
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
        } as Measurement;
      });

      setDataHistory(rawData);
    });

    return () => unsubscribe();
  }, [currentUser, forChart]);

  return dataHistory;
}
