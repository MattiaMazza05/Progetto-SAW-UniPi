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
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

export function UserInfoForm({ className, ...props }: React.ComponentProps<"div">) {
  const { currentUser } = useAuth();
  const [BirthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("Uomo");
  const [height, setHeight] = useState(0);
  const [fullName, setFullName] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) {
      setError("Utente non autenticato");
      return;
    }
    try {
      setError("");
      await setDoc(
        doc(db, "userData", currentUser.uid),
        {
          fullName: fullName || currentUser.displayName || "",
          gender: gender,
          birthdate: BirthDate,
          height: height,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          notificationTime: notificationTime,
        },
        { merge: true },
      );
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Errore durante il salvataggio del profilo");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Completa il profilo</CardTitle>
          <CardDescription>
            Inserisci i dati necessari per calcolare la composizione corporea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                  value={gender}
                  onValueChange={(value) => setGender(value)}
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
                <FieldLabel htmlFor="form-name">A che ora vuoi essere inviato/a un promemoria? </FieldLabel>
                <Input
                  id="notificationTime"
                  type="time"
                  required
                  onChange={(event) => {
                    setNotificationTime(event.target.value);
                  }}
                  value={notificationTime}
                />
                <FieldDescription>
                  Le notifiche arriveranno solo se hai apperto l'app.
                </FieldDescription>
              </Field>
              <Field>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit">Salva Profilo</Button>
              </Field>
              
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
