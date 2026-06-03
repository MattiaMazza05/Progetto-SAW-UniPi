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
  FieldSeparator
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLogin } from "@/firebase/auth";
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      await registerUser(email, password);
      navigate("/userInfo", {replace: true});
    } catch (error) {
      console.error(error);
      setError("Errore");
    }
  }

  async function handleGoogleRegister() {
    try {
      setError("");
      await googleLogin();
      navigate("/userInfo", {replace: true});
    } catch (error) {
      console.error(error);
      setError("Registrazione con Google non riuscita");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea il tuo account</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={handleGoogleRegister}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Registrati con Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Oppure continua con 
              </FieldSeparator>
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
              <Field>
                {error && <p className="text-sm text-red-600">{error}</p>}
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
