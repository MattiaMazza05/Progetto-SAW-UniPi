import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Measurements from "./pages/Measurements";
import Workouts from "./pages/Workouts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "../src/context/AuthContext";
import { logoutUser } from "./firebase/auth";

function NavigationBar() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  return (
    <nav className="p-4 flex gap-4 border-b">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/measurements">Measurements</Link>
      <Link to="/checklist">Checklist</Link>
      <Link to="/workouts">Workouts</Link>
      <button
        onClick={() => {
          logoutUser();
        }}
        className="text-red-500"
      >
        Logout
      </button>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/measurements"
          element={
            <ProtectedRoute>
              <Measurements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checklist"
          element={
            <ProtectedRoute>
              <Checklist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Workouts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
