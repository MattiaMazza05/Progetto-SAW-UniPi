import type { Habits } from "@/pages/Checklist";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pen } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { useState } from "react";


type CheckListTableProps = {
  habits: Habits[];
  today: string;
  onToggleHabit: (habit: Habits) => void;
  onDeleteHabit: (id: string) => void;
  onUpdateHabit: (id: string, newDescription: string) => void;
};

export function CheckListTable({
  habits,
  today,
  onToggleHabit,
  onDeleteHabit,
  onUpdateHabit,
}: CheckListTableProps) {
  const [newHabit, setNewHabit] = useState("");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">Fatto</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Streak</TableHead>
          <TableHead className="w-8">Elimina</TableHead>
          <TableHead className="w-8">Modifica</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {habits.map((habit) => (
          <TableRow key={habit.id}>
            <TableCell>
              <Checkbox
                id={`habit-${habit.id}`}
                checked={habit.lastCompletedDate === today}
                onCheckedChange={() => onToggleHabit(habit)}
              />
            </TableCell>

            <TableCell className="font-medium">{habit.description}</TableCell>

            <TableCell>{habit.streak} 🔥</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                className="h-11 w-11"
                onClick={() => onDeleteHabit(habit.id)}
              >
                <Trash2 />
              </Button>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="h-11 w-11">
                    <Pen />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>Modifica habit</PopoverTitle>
                  </PopoverHeader>
                  <Field>
                    <Input
                      className="h-11"
                      id="newhabit"
                      type="text"
                      required
                      onChange={(event) => setNewHabit(event.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={()=>onUpdateHabit(habit.id , newHabit)}
                        type="button"
                        className="h-11"
                      >
                        Modifica
                      </Button>
                    </div>
                  </Field>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
