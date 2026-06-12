import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { sendNotification } from "@/hooks/commonHooks";

export default function CallBack({}) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const code = param.get("code");

    if (code && currentUser) {
      fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
          client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.access_token) {
            const userRef = doc(db, "userData", currentUser.uid);
            await setDoc(
              userRef,
              {
                stravaAccessToken: data.access_token,
                stravaRefreshToken: data.refresh_token,
                stravaExpiresAt: data.expires_at,
                stravaAthleteId: data.athlete.id,
              },
              { merge: true },
            );
            sendNotification("Notifica da:", "Strava Collegato con successo.")
            navigate("/workouts");
          } else {
            console.error("Risposta di Strava: ", data);
          }
        })
        .catch((error) => {
          console.error("Errore durante la fetch: ", error);
        });
    }
  }, [currentUser]);

  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>In collegamento con Strava</EmptyTitle>
        <EmptyDescription>
          Attendi mentre elaboro la tua richiesta. Non aggiornare la pagina.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
