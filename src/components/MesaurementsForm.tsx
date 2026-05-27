import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { doc, getDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

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
    <div className="p-4 ">
      <h2>Inserisci i tuoi dati:</h2>
      <form
        className="flex max-w-md flex-col gap-4"
        onSubmit={BodyFatCalculator}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="date">Data</Label>
          </div>
          <TextInput
            id="date"
            type="date"
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="weight">Peso</Label>
          </div>
          <TextInput
            id="weight"
            type="number"
            step="0.1"
            placeholder="espresso in kg"
            onChange={(event) => setWeight(Number(event.target.value))}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="NeckC">Circonferenza collo</Label>
          </div>
          <TextInput
            id="NeckC"
            type="number"
            step="0.1"
            placeholder="espresso in cm"
            onChange={(event) => setNeck(Number(event.target.value))}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="WasteC">Circonferenza vita</Label>
          </div>
          <TextInput
            id="WaistC"
            type="number"
            step="0.1"
            placeholder="espresso in cm"
            onChange={(event) => setWaist(Number(event.target.value))}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="HipC">Circonferenza fianchi</Label>
          </div>
          <TextInput
            id="HipsC"
            type="number"
            step="0.1"
            placeholder="espresso in cm"
            onChange={(event) => setHips(Number(event.target.value))}
            required
          />
        </div>
        <Button type="submit" disabled={isCalculating}>
          {isCalculating ? "Caricamento database..." : "Calcola e Inserisci"}
        </Button>
      </form>
      {resultBF !== null && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
          <ul className="text-gray-800">
            <li>
              <strong>Data misurazione:</strong> {date}
            </li>
            <li>
              <strong>Peso:</strong>
              {weight}
            </li>
            <li>
              <strong>Body Fat Stimata:</strong> {resultBF.toFixed(1)}%
            </li>
            <li>
              <strong>Massa grassa:</strong>
              {((weight * resultBF) / 100).toFixed(1)} kg
            </li>
            <li>
              <strong>Massa magra:</strong>
              {(weight - (weight * resultBF) / 100).toFixed(1)} kg
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
