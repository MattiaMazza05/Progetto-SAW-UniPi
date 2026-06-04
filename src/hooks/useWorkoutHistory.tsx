import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

export interface WorkoutType {
  id: string;
  date: string;
  distance: number | null;
  duration: number;
  title: string;
  type: string;
  volume: number | null;
}

export function useWorkoutHistory(forChart: boolean) {
  const { currentUser } = useAuth();
  const [dataHistory, setDataHistory] = useState<WorkoutType[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setDataHistory([]);
      return;
    }

    const workoutRef = collection(
      db,
      "userData",
      currentUser.uid,
      "workoutHistory",
    );

    let q;
    if (forChart) {
      q = query(workoutRef, orderBy("date", "asc"));
    } else {
      q = query(workoutRef, orderBy("date", "desc"));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rawData = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as WorkoutType;
      });

      setDataHistory(rawData);
    });

    return () => unsubscribe();
  }, [currentUser, forChart]);

  return dataHistory;
}
