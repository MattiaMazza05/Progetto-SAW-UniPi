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
import { doc, getDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export default function MesaurementsForm() {
  const [weight, setWeight] = useState(0);
  const [neck, setNeck] = useState(0);
  const [waist, setWaist] = useState(0);
  const [hips, setHips] = useState(0);
  const [date, setDate] = useState("");
  const { currentUser } = useAuth();
  const [isCalculating, setIsCalculating] = useState(false);

  async function BodyFatCalculator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    setIsCalculating(true);
    try {
      const userUid = currentUser.uid;
      const docRef = doc(db, "userData", userUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        const height = Number(userData.height);
        const gender = String(userData.gender);
        console.log({
          height,
          gender,
          weight,
          neck,
          waist,
          hips,
        });
        if (!Number.isFinite(height) || height <= 0) {
          toast.error("Altezza non valida", {
            description: "Controlla il valore dell'altezza nel profilo.",
            position: "top-center",
          });
          return;
        }
        //converto in inch sennò formula da valore diverso
        const hInch = height / 2.54;
        const wInch = waist / 2.54;
        const nInch = neck / 2.54;
        const hipsInch = hips / 2.54;
        let bf = 0;
        console.log("Dati formula:", {
          height: userData.height,
          heightNumber: Number(userData.height),
          sex: userData.sex,
          weight,
          neck,
          waist,
          hips,
        });
        if (gender == "Uomo") {
          bf =
            86.01 * Math.log10(wInch - nInch) -
            70.041 * Math.log10(hInch) +
            36.76;
        } else {
          bf =
            163.205 * Math.log10(wInch + hipsInch - nInch) -
            97.684 * Math.log10(hInch) -
            78.387;
        }
        const fatMass = weight * (bf / 100);
        const leanMass = weight - fatMass;
        if (!Number.isFinite(bf)) {
          toast.error("Calcolo non valido", {
            description: "Uno dei dati inseriti non permette il calcolo.",
            position: "top-center",
          });
          return;
        }
        await saveMesaurements(bf, fatMass, leanMass);
        toast.success("Misurazione salvata.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Errore nel calcolo", error);
    } finally {
      setIsCalculating(false);
    }
  }
  async function saveMesaurements(
    bfValue: number,
    fmValue: number,
    lmValue: number,
  ) {
    if (!currentUser) return;
    await addDoc(
      collection(db, "userData", currentUser.uid, "mesaurementsHistory"),
      {
        //salvo lo storico in una subcollection legata all'user uid
        weight: weight,
        neck: neck,
        waist: waist,
        hips: hips,
        bfP: bfValue,
        fatMass: fmValue,
        leanMass: lmValue,
        dateInput: date,
        timeStamp: Timestamp.fromDate(new Date()),
      },
    );
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-11">
            <CirclePlus />
            Nuovo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form
            onSubmit={BodyFatCalculator}
            id="measurement-form"
            className="grid gap-6"
          >
            <DialogHeader>
              <DialogTitle>Nuova Misurazione</DialogTitle>
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
                  <Label htmlFor="weight">Peso</Label>
                </div>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="espresso in kg"
                  onChange={(event) => setWeight(Number(event.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="NeckC">Circonferenza collo</Label>
                </div>
                <Input
                  id="NeckC"
                  type="number"
                  step="0.1"
                  placeholder="espresso in cm"
                  onChange={(event) => setNeck(Number(event.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="WaistC">Circonferenza vita</Label>
                </div>
                <Input
                  id="WaistC"
                  type="number"
                  step="0.1"
                  placeholder="espresso in cm"
                  onChange={(event) => setWaist(Number(event.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="HipsC">Circonferenza fianchi</Label>
                </div>
                <Input
                  id="HipsC"
                  type="number"
                  step="0.1"
                  placeholder="espresso in cm"
                  onChange={(event) => setHips(Number(event.target.value))}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <Button
                form="measurement-form"
                type="submit"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  "Calcola"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
