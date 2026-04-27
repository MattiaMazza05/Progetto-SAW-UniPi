import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Measurements from "./pages/Mesaurements";
import Workouts from "./pages/Workouts";

function App() {
  return (
    <BrowserRouter>
      {/* Menu di Navigazione Temporaneo (lo faremo poi più bello con Flowbite) */}
      <Navbar fluid rounded>
        <NavbarBrand as={Link} to="/">
          <img
            src="/favicon.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Mia App
          </span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarLink as={Link} to="/">
            Dashboard
          </NavbarLink>
          <NavbarLink as={Link} to="/misure">
            Misure
          </NavbarLink>
          <NavbarLink as={Link} to="/allenamenti" >Allenamenti</NavbarLink>
          <NavbarLink as={Link} to="/checklist" >Checklist</NavbarLink>
        </NavbarCollapse>
      </Navbar>

      {/* Area in cui vengono iniettate le pagine al cambio rotta */}
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/misure" element={<Measurements />} />
          <Route path="/allenamenti" element={<Workouts />} />
          <Route path="/checklist" element={<Checklist />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
