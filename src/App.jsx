import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";
import Contact from "./pages/Contact";
import TripPlanner from "./pages/TripPlanner";
import BudgetTracker from "./pages/BudgetTracker";
import TravelCalendar from "./pages/TravelCalendar";
import PackingChecklist from "./pages/PackingChecklist";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/trips/:tripId" element={<TripPlanner />} />
        <Route path="/trips/:tripId/budget" element={<BudgetTracker />} />
        <Route path="/calendar" element={<TravelCalendar />} />
        <Route path="/trips/:tripId/packing" element={<PackingChecklist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;