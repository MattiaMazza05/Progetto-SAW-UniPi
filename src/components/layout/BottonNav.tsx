import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ruler,
  Plus,
  ListTodo,
  User,
  ListChecks,
  PencilRuler,
  Gauge,
  SportShoe
} from "lucide-react";
import { Link } from "react-router-dom";

export default function BottomNav() {
      return (
    <div className=" fixed bottom-6 left-0 right-0 flex justify-center">
      <nav className="flex items-center justify-center space-x-4 rounded-full border bg-background p-2 shadow-lg ">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/measurements">
            <PencilRuler className="h-5 w-5" />
            <span className="sr-only">PencilRuler</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="workouts">
            <Gauge className="h-5 w-5" />
            <span className="sr-only">Gauge</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-full bg-primary text-primary-foreground"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem>
              <Ruler className="mr-2 h-4 w-4" />
              Nuova misurazione
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SportShoe className="mr-2 h-4 w-4" />
              Nuovo allenamento 
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ListTodo className="mr-2 h-4 w-4" />
              Nuovo habit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/checklist">
            <ListChecks className="h-5 w-5" />
            <span className="sr-only">checklist</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/dashboard">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Link>
        </Button>
      </nav>
    </div>
  );
}
