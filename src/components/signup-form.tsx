import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [BirthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("Uomo");
  const [height, setHeight] = useState(0);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      const userCredential = await registerUser(email, password);
      const userUid = userCredential.user.uid;
      await setDoc(doc(db, "userData", userUid), {
        fullName: fullName,
        sex: sex,
        birthdate: BirthDate,
        height: height,
        email: email,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Errore");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea il tuo account</CardTitle>
          <CardDescription>Inserisci email password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Nome e Cognome</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Mario Rossi"
                  required
                  onChange={(event) => {
                    setFullName(event.target.value);
                  }}
                  value={fullName}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </Field>
              <Field>
                <Field>
                  <Field>
                    <FieldLabel htmlFor="form-password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(event) => setPassword(event.target.value)}
                      value={password}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Inserisci una password sicura.
                </FieldDescription>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Qualche informazione su di te...
              </FieldSeparator>
              <Field>
                <Field>
                  <Field>
                    <FieldLabel htmlFor="form-birthDate">
                      Data di nascita
                    </FieldLabel>
                    <Input
                      id="birthday"
                      type="date"
                      required
                      onChange={(event) => setBirthDate(event.target.value)}
                      value={BirthDate}
                    />
                  </Field>
                </Field>
              </Field>
              <Field>
                <Field>
                  <Field>
                    <FieldLabel htmlFor="form-height">Altezza</FieldLabel>
                    <Input
                      id="height"
                      type="number"
                      required
                      onChange={(event) =>
                        setHeight(Number(event.target.value))
                      }
                      value={height}
                    />
                  </Field>
                  <FieldDescription>
                    Inserisci l'altezza in cm.
                  </FieldDescription>
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="form-sex">Sesso</FieldLabel>
                <Select
                  defaultValue="Uomo"
                  value={sex}
                  onValueChange={(value) => setSex(value)}
                  required
                >
                  <SelectTrigger id="form-sex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Uomo">Uomo</SelectItem>
                    <SelectItem value="Donna">Donna</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Necessario per calcolare %BF
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Crea Account</Button>
                <FieldDescription className="text-center">
                  Hai gia un account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Cliccando Crea Account accetti i nostri{" "}
        <a href="#">Termini & Condizioni</a> e <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
