import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function Measurements() {
  const [weight, setWeight] = useState(0);
  const [neck, setNeck] = useState(0);
  const [waist, setWaist] = useState(0);
  const [hips, setHips] = useState(0);
  const [date, setDate] = useState("");
  const { currentUser } = useAuth();
  const [resultBF, setResultBf] = useState<number | null> (null);
  const [isCalculating, setIsCalculating] = useState(false);

  async function BodyFatCalculator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    setIsCalculating(true);
    try{const userUid = currentUser.uid;
    const docRef = doc(db, "userData", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      let bf = 0;
      if (userData.sex == "Uomo") {
         bf =
          86.01 * Math.log10(waist - neck) -
          70.041 * Math.log10(userData.height) +
          36.76;
      } else {
        bf = 163.205 * Math.log10(waist + hips - neck) - 97.684 * Math.log10(userData.height) - 78.387;
      }
      setResultBf(bf);
    }}catch(error){
      console.error("Errore nel calcolo", error);
    } finally{
      setIsCalculating(false);
    }
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold dark:text-white">
        Sezione Mesaurements
      </h1>
      <p className="dark:text-gray-300">
        Benvenuto nella tua sezione mesaurements.
      </p>
      <h2>Inserisci i tuoi dati:</h2>
      <form className="flex max-w-md flex-col gap-4" onSubmit={BodyFatCalculator}>
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
            <li><strong>Data misurazione:</strong> {date}</li>
            <li><strong>Body Fat Stimata:</strong> {resultBF.toFixed(1)}%</li>
          </ul>
        </div>
      )}
    </div>
  );
}
