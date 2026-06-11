import { Button } from "@/components/ui/button";
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
import { CirclePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkoutsForm() {
  const { currentUser } = useAuth();
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [type, setType] = useState("");
  const [volume, setVolume] = useState(0);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) {
      setError("Utente non loggato");
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(
        collection(db, "userData", currentUser.uid, "workoutHistory"),
        {
          date: date,
          title: title,
          duration: duration,
          type: type,
          volume: volume || null,
          distance: distance || null,
        },
      );
      setIsSaving(false);
      toast.success("Allenamento aggiunto.", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      setError("Errore durante il salvataggio dell'allenamento.");
    }
  }

  function gymVsRun() {
    if (type == "Pesi") {
      return (
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="volume">Totale volume</Label>
          </div>
          <Input
            id="volume"
            type="number"
            step="0.1"
            placeholder="espresso in kg"
            onChange={(event) => setVolume(Number(event.target.value))}
            required
          />
        </div>
      );
    } else if (type == "Corsa") {
      return (
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="distance">Distanza</Label>
          </div>
          <Input
            id="distance"
            type="number"
            step="0.01"
            placeholder="espresso in km"
            onChange={(event) => setDistance(Number(event.target.value))}
            required
          />
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-11 w-full justify-center gap-2">
            <CirclePlus className="h-5 w-5" />
            <span>Nuovo</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form
            onSubmit={handleSubmit}
            id="workout-form"
            className="grid gap-6"
          >
            <DialogHeader>
              <DialogTitle>Inserisci nuovo allenamento</DialogTitle>
              <DialogDescription>
                Inserisci i dati, clicca su Calcola e poi Chiudi.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="title">Titolo</Label>
                </div>
                <Input
                  id="title"
                  type="text"
                  placeholder="Scheda A/ Easy Run"
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="duration">Durata</Label>
                </div>
                <Input
                  id="duration"
                  type="number"
                  step="0.1"
                  placeholder="espresso in min."
                  onChange={(event) => setDuration(Number(event.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="WorkoutType">Tipo di allenamento</Label>
                </div>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value)}
                  required
                >
                  <SelectTrigger id="workout-type" className="w-full">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corsa">Corsa</SelectItem>
                    <SelectItem value="Pesi">Pesi</SelectItem>
                  </SelectContent>
                </Select>
                <div>{gymVsRun()}</div>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <Button form="workout-form" type="submit" disabled={isSaving}>
                {isSaving ? <Spinner data-icon="inline-start" /> : "Inserisci"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
