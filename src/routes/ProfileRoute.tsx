import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SpinnerEmpty } from "@/components/layout/SpinnerComponent";

export default function ProfileRoute() {
  const { currentUser, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (!currentUser) {
        setCheckingProfile(false);
        return;
      }

      const userRef = doc(db, "userData", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setProfileCompleted(false);
        setCheckingProfile(false);
        return;
      }

      const data = userSnap.data();

      setProfileCompleted(data.profileCompleted === true);
      setCheckingProfile(false);
    }

    checkProfile();
  }, [currentUser]);

  if (loading || checkingProfile) {
    return <SpinnerEmpty />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!profileCompleted) {
    return <Navigate to="/userInfo" replace />;
  }

  return <Outlet />;
}
