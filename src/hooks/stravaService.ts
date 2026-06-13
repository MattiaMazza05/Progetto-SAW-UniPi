import { db } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

type StravaUserData = {
  stravaAccessToken?: string;
  stravaRefreshToken?: string;
  stravaExpiresAt?: number;
};

export async function getValidStravaToken(
  userId: string,
  userData: StravaUserData,
) {
  const now = Math.floor(Date.now() / 1000);
  if (
    userData.stravaAccessToken &&
    userData.stravaExpiresAt &&
    userData.stravaExpiresAt > now
  ) {
    return userData.stravaAccessToken;
  }
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
      client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: userData.stravaRefreshToken,
    }),
  });

  const data = await response.json();

  const userRef = doc(db, "userData", userId);
  await updateDoc(userRef, {
    stravaAccessToken: data.access_token,
    stravaRefreshToken: data.refresh_token,
    stravaExpiresAt: data.expires_at,
  });
  return data.access_token;
}
