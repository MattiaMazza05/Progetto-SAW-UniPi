import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { CheckListTable } from "@/components/layout/ChecklistTable";

export interface Habits {
  id: string;
  description: string;
  lastCompletedDate: string | null;
  streak: number;
}

export default function Checklist() {
  const { currentUser } = useAuth();
  const [userHabits, setUserHabits] = useState<Habits[]>([]);
  const [habitDescription, setHabitDescription] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  useEffect(() => {
    if (!currentUser) {
      setUserHabits([]);
      return;
    }

    const userDocRef = doc(db, "userData", currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().habitsList) {
        setUserHabits(docSnap.data().habitsList);
      } else {
        setUserHabits([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function saveHabits(arrayHabits: Habits[]) {
    if (!currentUser) return;

    const userDocRef = doc(db, "userData", currentUser.uid);

    await setDoc(
      userDocRef,
      {
        habitsList: arrayHabits,
      },
      { merge: true },
    );
  }

  async function addHabits(description: string) {
    if (description.trim() === "") {
      setError("Inserisci una descrizione");
      return;
    }

    const newHabit: Habits = {
      id: crypto.randomUUID(),
      description: description.trim(),
      lastCompletedDate: null,
      streak: 0,
    };

    const newHabitsArray = [...userHabits, newHabit];

    setUserHabits(newHabitsArray);
    setHabitDescription("");
    setError("");

    await saveHabits(newHabitsArray);
  }

  async function toggleHabit(clickedHabit: Habits) {
    const newHabitsArray = userHabits.map((habit) => {
      if (habit.id !== clickedHabit.id) {
        return habit;
      }

      let newStreak = habit.streak;
      let newDate = habit.lastCompletedDate;

      if (habit.lastCompletedDate !== today) {
        newDate = today;

        if (habit.lastCompletedDate === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      } else {
        newDate = habit.streak > 1 ? yesterday : null;
        newStreak = habit.streak > 0 ? habit.streak - 1 : 0;
      }

      return {
        ...habit,
        streak: newStreak,
        lastCompletedDate: newDate,
      };
    });

    setUserHabits(newHabitsArray);
    await saveHabits(newHabitsArray);
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold dark:text-white">
          Abitudini Alimentari
        </h1>
        <p className="dark:text-gray-300">
          Benvenuto nella tua sezione checklist.
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <CirclePlus />
            Nuovo
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cosa vuoi tenere sott'occhio?</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                required
                value={habitDescription}
                onChange={(event) => {
                  setHabitDescription(event.target.value);
                  setError("");
                }}
              />

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => addHabits(habitDescription)}>
              Inserisci
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CheckListTable
        habits={userHabits}
        today={today}
        onToggleHabit={toggleHabit}
      />
    </>
  );
}
