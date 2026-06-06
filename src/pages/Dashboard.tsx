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
import { Field } from "@/components/ui/field";
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
import { Separator } from "@/components/ui/separator";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  type UserData = {
    fullName: string;
    gender: string;
    birthdate: string;
    height: number;
    email: string;
    photoURL: string | null;
  };

  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newHeight, setNewHeight] = useState(0);
  const [newGender, setNewGender] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  useEffect(() => {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function heightModifier() {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    await updateDoc(docRef, {
      height: newHeight,
    });
    toast.success("Altezza modificata.", {
      position: "top-center",
    });
  }

  async function genderModifier() {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    await updateDoc(docRef, {
      gender: newGender,
    });
    toast.success("Sesso modificato.", {
      position: "top-center",
    });
  }
  async function birthDateModifier() {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    await updateDoc(docRef, {
      birthdate: newBirthDate,
    });
    toast.success("Data di Nascita modificata.", {
      position: "top-center",
    });
  }

  const avatarSrc = userData?.photoURL ?? undefined;
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-24 min-h-screen">
      <section className="flex justify-center">
        <h1 className="text-2xl font-bold gap-2 items-center flex">
          Il tuo profilo
        </h1>
      </section>
      <section>
        <Card size="sm" className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle>👋 Ciao, {userData?.fullName}</CardTitle>
            <CardDescription>La tua mail è: {userData?.email}</CardDescription>
            <CardAction>
              <Avatar className="size-14">
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
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                Altezza: {userData?.height}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11">
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
                      <Input
                        className="h-11"
                        id="height"
                        type="number"
                        required
                        onChange={(event) => {
                          setNewHeight(Number(event.target.value));
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={heightModifier}
                          type="button"
                          className="h-11"
                        >
                          Modifica
                        </Button>
                      </div>
                    </Field>
                  </PopoverContent>
                </Popover>
              </li>
              <Separator />
              <li className="flex items-center justify-between">
                Sesso: {userData?.gender}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11">
                      <Pen />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader>
                      <PopoverTitle>Modifica sesso</PopoverTitle>
                      <PopoverDescription>
                        Seleziona un'opzione.
                      </PopoverDescription>
                    </PopoverHeader>
                    <Field>
                      <Select
                        defaultValue={userData?.gender}
                        onValueChange={(value) => setNewGender(value)}
                        required
                      >
                        <SelectTrigger id="form-sex" className="h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Uomo">Uomo</SelectItem>
                          <SelectItem value="Donna">Donna</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button
                          onClick={genderModifier}
                          type="button"
                          className="h-11"
                        >
                          Modifica
                        </Button>
                      </div>
                    </Field>
                  </PopoverContent>
                </Popover>
              </li>
              <Separator />

              <li className="flex items-center justify-between">
                Data di nascita: {userData?.birthdate}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11">
                      <Pen />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader>
                      <PopoverTitle>Modifica data di nascita</PopoverTitle>
                      <PopoverDescription>
                        Inserisci la nuova data di nascita.
                      </PopoverDescription>
                    </PopoverHeader>
                    <Field>
                      <Input
                        className="h-11"
                        id="birthday"
                        type="date"
                        required
                        onChange={(event) =>
                          setNewBirthDate(event.target.value)
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={birthDateModifier}
                          type="button"
                          className="h-11"
                        >
                          Modifica
                        </Button>
                      </div>
                    </Field>
                  </PopoverContent>
                </Popover>
              </li>
            </ul>
          </CardContent>
          <Separator />
          <CardFooter className="flex-col gap-2">
            <Button
              onClick={logoutUser}
              className="w-full h-11"
              variant="destructive"
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
