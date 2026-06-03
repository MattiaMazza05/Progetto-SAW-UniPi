import { cn } from "@/lib/utils.ts";
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
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { googleLogin, loginUser } from "@/firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 const handleGoogleLogin = async () => {
    try{
      const userCredential = await googleLogin();
      console.log("Utente loggato: ", userCredential.user);
    }catch(error){
      console.error("Errore dutante il login con google: ", error);
    }
  }
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Email e password errati");
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login con il tuo account Google</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={handleGoogleLogin}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Inserisci la tua mail"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Password dimenticata?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                />
              </Field>
              <Field>
                {error && <p className="text-red-600">{error}</p>}
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Non hai un account? <Link to="/register">Registrati</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Cliccando Login accetti i nostri <a href="#">Termini & Condizioni</a> e{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
