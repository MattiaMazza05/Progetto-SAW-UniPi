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
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import { sendNotification } from "@/hooks/commonHooks";
import { BellRing, Cake, VenusAndMars, Ruler,AlarmClock } from "lucide-react";
import type { UserData } from "@/types/user";
export default function Dashboard() {

  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newHeight, setNewHeight] = useState(0);
  const [newGender, setNewGender] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [newNotificationTime, setNewNotificationTime] = useState("");
  const avatarSrc = userData?.photoURL ?? undefined;

  type UserPreferenceValue = string | number | boolean;

  useEffect(() => {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        setUserData(data);
        setEnableNotification(data.notificationsEnabled ?? false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  async function userPreferenceModifier(
    setting: string,
    value: UserPreferenceValue,
  ) {
    if (!currentUser) return;
    const docRef = doc(db, "userData", currentUser.uid);
    await updateDoc(docRef, {
      [setting]: value,
    });
    toast.success("Campo modificato", {
      position: "top-center",
    });
  }

  async function handleNotificationChange(checked: boolean) {
    if (!currentUser) return;
    if (checked) {
      if (!("Notification" in window)) {
        toast.error("Il browser non supporta le notifiche.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setEnableNotification(false);
        toast.error("permesso notifiche negato.");
        return;
      }

      const userRef = doc(db, "userData", currentUser.uid);

      await updateDoc(userRef, {
        notificationsEnabled: true,
      });

      setEnableNotification(true);
      toast.success("Notifiche abilitate.");
      sendNotification("Notifica da:", "Le notifiche appariranno così.");
      return;
    }
    const userRef = doc(db, "userData", currentUser.uid);

    await updateDoc(userRef, {
      notificationsEnabled: false,
    });

    setEnableNotification(false);
    toast.success("Notifiche disattivate.");
  }

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
                <span className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Altezza: {userData?.height}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11 w-11">
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
                          onClick={() => {
                            userPreferenceModifier("height", newHeight);
                          }}
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
                <span className="flex items-center gap-2">
                  <VenusAndMars className="h-4 w-4" />
                  Sesso: {userData?.gender}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11 w-11">
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
                          onClick={() => {
                            userPreferenceModifier("gender", newGender);
                          }}
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
                <span className="flex items-center gap-2">
                  <Cake className="h-4 w-4" />
                  Data di nascita: {userData?.birthdate}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11 w-11">
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
                          onClick={() => {
                            userPreferenceModifier("birthdate", newBirthDate);
                          }}
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
                <span className="flex items-center gap-2">
                  <AlarmClock className="h-4 w-4" />
                  Orario promemoria: {userData?.notificationTime}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-11 w-11">
                      <Pen />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader>
                      <PopoverTitle>
                        Modifica l'ora a cui vuoi ricevere il promemoria
                      </PopoverTitle>
                      <PopoverDescription>
                        Inserisci nuovo orario .
                      </PopoverDescription>
                    </PopoverHeader>
                    <Field>
                      <Input
                        className="h-11"
                        id="newNotificationTime"
                        type="time"
                        required
                        onChange={(event) =>
                          setNewNotificationTime(event.target.value)
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            userPreferenceModifier(
                              "notificationTime",
                              newNotificationTime,
                            );
                          }}
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
                <span className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  Abilita notifiche
                </span>

                <Switch
                  id="switch-notification"
                  checked={enableNotification}
                  onCheckedChange={handleNotificationChange}
                />
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
