import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Measurements from "./pages/Measurements";
import Workouts from "./pages/Workouts";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useAuth } from "../src/context/AuthContext";
import BottomNav from "./components/layout/BottonNav";
import { Toaster } from "sonner";
import UserInformation from "./pages/UserInformation";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function AppBottomNav() {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  if (location.pathname == "/userInfo") return null;

  return <BottomNav />;
}
function App() {
  useEffect(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (prefersDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/register" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/userInfo" element={<UserInformation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/workouts" element={<Workouts />} />
        </Route>
      </Routes>
      <AppBottomNav />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
