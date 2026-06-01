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
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, getDoc, addDoc, collection, setDoc } from "firebase/firestore";

interface Habits {
  id: string;
  description: string;
  completed: boolean;
  consecutiveStreak: number;
}

export default function Checklist() {
  const [userHabits, setUserHabits] = useState<Habits[]>([]);
  const [habitDescription, setHabitDescription] = useState("");

  function addHabits(description: string) {
    const h: Habits = {
      id: crypto.randomUUID(),
      description,
      completed: false,
      consecutiveStreak: 0,
    };
    const newHabitsArray = [...userHabits, h];
    setUserHabits(newHabitsArray);
    saveHabits(newHabitsArray);
  }

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set(["1"]));

  const selectAll = selectedRows.size === userHabits.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(userHabits.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };
  const { currentUser } = useAuth();
  async function saveHabits(arrayHabits: Habits[]) {
    if (!currentUser) return;
    const userDocRef = doc(db, "userData", currentUser.uid);
    const habitsToSave = arrayHabits.map(
      ({ description, completed, consecutiveStreak }) => ({
        description,
        completed,
        consecutiveStreak,
      }),
    );
    try {
      await setDoc(userDocRef, {
        habitsList: habitsToSave,
      });
    } catch (error) {
      console.error("Errore durante il salvataggio: ", error);
    }
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold dark:text-white">
          Abituidini Alimentari
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
                onChange={(event) => setHabitDescription(event.target.value)}
              />
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
      <ul>
        {userHabits.map((entry) => (
          <li>Hai inserito: {entry.description}</li>
        ))}
      </ul>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                id="select-all-checkbox"
                name="select-all-checkbox"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Streak consecutive</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userHabits.map((row) => (
            <TableRow
              key={row.id}
              data-state={selectedRows.has(row.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  id={`row-${row.id}-checkbox`}
                  name={`row-${row.id}-checkbox`}
                  checked={selectedRows.has(row.id)}
                  onCheckedChange={(checked) =>
                    handleSelectRow(row.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{row.description}</TableCell>
              <TableCell>{row.consecutiveStreak}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
