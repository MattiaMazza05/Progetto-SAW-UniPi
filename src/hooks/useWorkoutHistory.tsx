import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import type { Workout } from "@/types/workout";

export function useWorkoutHistory(forChart: boolean) {
  const { currentUser } = useAuth();
  const [dataHistory, setDataHistory] = useState<Workout[]>([]);

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
        } as Workout;
      });

      setDataHistory(rawData);
    });

    return () => unsubscribe();
  }, [currentUser, forChart]);

  return dataHistory;
}
