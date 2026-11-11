import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  Plane,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Features", path: "/features" },
  { label: "Explore", path: "/explore" },
  { label: "My Trips", path: "/my-trips" },
  { label: "Calendar", path: "/calendar" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when pressing Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="wanderly-navbar">
      <div className="wanderly-nav-container">

        {/* LOGO */}
        <Link
          to="/"
          className="wanderly-nav-logo"
          onClick={() => setMenuOpen(false)}
        >
          <span className="wanderly-logo-icon">
            <Plane size={23} />
          </span>

          <span>
            Wanderly<span className="wanderly-logo-dot">.</span>
          </span>
        </Link>

        {/* DESKTOP + MOBILE LINKS */}
        <nav
          id="wanderly-navigation"
          className={`wanderly-nav-links ${
            menuOpen ? "open" : ""
          }`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `wanderly-nav-link ${
                  isActive ? "active" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* MOBILE CTA */}
          <Link
            to="/my-trips"
            className="wanderly-mobile-cta"
            onClick={() => setMenuOpen(false)}
          >
            Plan a Trip
            <ArrowUpRight size={17} />
          </Link>
        </nav>

        {/* DESKTOP CTA */}
        <Link
          to="/my-trips"
          className="wanderly-nav-cta"
        >
          Plan a Trip
          <ArrowUpRight size={17} />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="wanderly-menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="wanderly-navigation"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>
    </header>
  );
}

export default Navbar;