import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {registerUser} from "../firebase/auth";
import { Button, Card, Label, TextInput } from "flowbite-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      await registerUser(email, password);
      navigate("/dashboard");
    } catch (error) {
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
          <TextInput id="password1" type="password" required onChange={(event) => setPassword(event.target.value)} value={password} />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit">Registrati</Button>
        Hai già un account? <Link to="/login">Login</Link>
      </form>
    </Card>
  );
}
