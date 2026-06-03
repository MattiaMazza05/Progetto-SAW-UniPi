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

type CheckListTableProps = {
  habits: Habits[];
  today: string;
  onToggleHabit: (habit: Habits) => void;
};

export function CheckListTable({
  habits,
  today,
  onToggleHabit,
}: CheckListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">Fatto</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Streak</TableHead>
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

            <TableCell className="font-medium">
              {habit.description}
            </TableCell>

            <TableCell>{habit.streak}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}