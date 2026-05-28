import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Measurements from "./pages/Measurements";
import Workouts from "./pages/Workouts";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "../src/context/AuthContext";
import { logoutUser } from "./firebase/auth";
import { BottomNav } from "./components/BottonNav";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

function NavigationBar() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  return (
    <Navbar fluid rounded>
      <NavbarBrand href="https://flowbite-react.com">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Web App
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="src/assets/images/hacker.png"
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">
            </span>
            <span className="block truncate text-sm font-medium">
              {currentUser.email}
            </span>
          </DropdownHeader>
          <DropdownItem>Settings</DropdownItem>
          <DropdownDivider />
          <DropdownItem
            onClick={() => {
              logoutUser();
            }}
          >
            Esci
          </DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        {/* NavbarLink agisce come wrapper grafico per gli stili, il Link gestisce la rotta in autonomia */}
        <NavbarLink as="div">
          <Link to="/dashboard" className="block w-full">
            Dashboard
          </Link>
        </NavbarLink>
        <NavbarLink as="div">
          <Link to="/measurements" className="block w-full">
            Measurements
          </Link>
        </NavbarLink>
        <NavbarLink as="div">
          <Link to="/checklist" className="block w-full">
            Checklist
          </Link>
        </NavbarLink>
        <NavbarLink as="div">
          <Link to="/workouts" className="block w-full">
            Workouts
          </Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <BottomNav />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
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
