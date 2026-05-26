import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { Button, Card, Label, TextInput, Select } from "flowbite-react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import {db} from "../firebase/config"

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [BirthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("Uomo");
  const [height, setHeight] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      const userCredential = await registerUser(email, password);
      const userUid = userCredential.user.uid;
      await setDoc(doc(db, "userData", userUid), {
        sex: sex,
        birthdate: BirthDate,
        height: height,
        email: email
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Email e password errati");
    }
  }


  return (
    <Card className="max-w-sm">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Email</Label>
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="Inserisci la tua mail"
            required
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1">Password</Label>
          </div>
          <TextInput
            id="password1"
            type="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="birthday">Data di nascita</Label>
          </div>
          <TextInput
            id="birthday"
            type="date"
            required
            onChange={(event) => setBirthDate(event.target.value)}
            value={BirthDate}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="height">Altezza</Label>
          </div>
          <TextInput
            id="height"
            type="number"
            required
            onChange={(event) => setHeight(Number(event.target.value))}
            placeholder="Espressa in cm (potrai modificarla in seguito"
          />
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="sex">Sesso (Necessario per calcolare %BF)</Label>
          </div>
          <Select
            id="sex"
            value={sex}
            onChange={(event) => setSex(event.target.value)}
            required
          >
            <option>Uomo</option>
            <option>Donna</option>
          </Select>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit">Registrati</Button>
        Hai già un account? <Link to="/login">Login</Link>
      </form>
    </Card>
  );
}
