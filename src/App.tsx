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
import { logoutUser } from "./firebase/auth";
import BottomNav from "./components/layout/BottonNav";
import { Toaster } from "sonner";
function App() {
  const { currentUser } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/workouts" element={<Workouts />} />
        </Route>
      </Routes>
      {currentUser && <BottomNav />}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
