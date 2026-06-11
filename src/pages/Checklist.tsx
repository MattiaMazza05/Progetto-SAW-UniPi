import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    //TODO levare questa funzione prima di deploy
    function createId() {
      //mi serve solo in fase di sviluppo
      if (crypto.randomUUID) {
        return crypto.randomUUID();
      }

      return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    const newHabit: Habits = {
      id: createId(),
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await addHabits(habitDescription);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-24">
      <section className="flex justify-center">
        <h1 className=" flex text-2xl font-bold gap-2 items-center">
          Diario Alimentare
        </h1>
      </section>
      <section>
        <Dialog>
          <DialogTrigger asChild>
            <section className="grid gap-3 sm:grid-cols-3 sm:items-center">
              <Button className="h-11">
                <CirclePlus />
                Nuovo
              </Button>
            </section>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <DialogHeader>
                <DialogTitle>Nuova Abitudine</DialogTitle>
                <DialogDescription>
                  Inserisci una nuova abitudine, clicca su Aggiungi e poi
                  Chiudi.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Input
                    id="habit-1"
                    name="habit"
                    value={habitDescription}
                    placeholder="es. 20gr di olio al giorno"
                    onChange={(event) =>
                      setHabitDescription(event.target.value)
                    }
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Chiudi</Button>
                </DialogClose>
                <Button type="submit">Aggiungi</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section>
        <CheckListTable
          habits={userHabits}
          today={today}
          onToggleHabit={toggleHabit}
        />
      </section>
    </main>
  );
}
