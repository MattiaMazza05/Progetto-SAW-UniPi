import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutUser } from "@/firebase/auth";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pen } from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const avatarSrc = currentUser?.photoURL ?? undefined;
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>👋 Ciao, {currentUser?.displayName}</CardTitle>
        <CardDescription>La tua mail è: {currentUser?.email}</CardDescription>
        <CardAction>
          <Avatar>
            <AvatarImage
              src={avatarSrc}
              alt="Foto profilo"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul>
          <li>
            Altezza{" "}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Pen />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Modifica altezza</PopoverTitle>
                  <PopoverDescription>
                    Inserisci la nuova altezza in centimetri.
                  </PopoverDescription>
                </PopoverHeader>

                <Field>
                  <Input id="height" type="number" required />
                  <div className="flex gap-2">
                    <Button type="button">Modifica</Button>
                    <Button type="button" variant="outline">
                      Chiudi
                    </Button>
                  </div>
                </Field>
              </PopoverContent>
            </Popover>
          </li>
          <li>Sesso</li>
          <li>Data di nascita</li>
          <li>
            <Field>
              <FieldLabel htmlFor="picture">Foto</FieldLabel>
              <Input id="picture" type="file" />
              <FieldDescription>Selezione una foto Utente</FieldDescription>
            </Field>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={logoutUser} className="w-full" variant="destructive">
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
