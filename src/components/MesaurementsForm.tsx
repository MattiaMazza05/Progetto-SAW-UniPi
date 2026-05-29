import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { doc, getDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "./ui/spinner";

export default function MesaurementsForm() {
  const [weight, setWeight] = useState(0);
  const [neck, setNeck] = useState(0);
  const [waist, setWaist] = useState(0);
  const [hips, setHips] = useState(0);
  const [date, setDate] = useState("");
  const { currentUser } = useAuth();
  const [resultBF, setResultBf] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [fatMass, setFatMass] = useState(0);
  const [leanMass, setLeanMass] = useState(0);

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
        //converto in inch sennò formula da valore diverso
        const hInch = userData.height / 2.54;
        const wInch = waist / 2.54;
        const nInch = neck / 2.54;
        const hipsInch = hips / 2.54;
        let bf = 0;
        if (userData.sex == "Uomo") {
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
        setResultBf(bf);
        const fatMass = weight * (bf / 100);
        const leanMass = weight - fatMass;
        setFatMass(fatMass);
        setLeanMass(leanMass);
        await saveMesaurements(bf, fatMass, leanMass);
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
    const docRef = await addDoc(
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Inserisci i tuoi dati</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={BodyFatCalculator} id="measurement-form">
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
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          form="measurement-form"
          type="submit"
          disabled={isCalculating}
          className="w-full"
        >
          {isCalculating ? <Spinner data-icon="inline-start" /> : "Calcola e inserisci"}
        </Button>
      </CardFooter>
    </Card>
  );
}
