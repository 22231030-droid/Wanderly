import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  Compass,
  CalendarDays,
  Heart,
  Wallet,
  Globe2,
  Sparkles,
  Mountain,
  Waves,
  Trees,
  Building2,
} from "lucide-react";

import "./Home.css";

const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    category: "Romantic",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    category: "City",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900",
  },
  {
    id: 4,
    name: "Santorini",
    country: "Greece",
    category: "Beach",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900",
  },
  {
    id: 5,
    name: "Switzerland",
    country: "Switzerland",
    category: "Adventure",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900",
  },
  {
    id: 6,
    name: "Rome",
    country: "Italy",
    category: "City",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900",
  },
];

const categories = [
  { name: "Adventure", icon: Mountain },
  { name: "Beach", icon: Waves },
  { name: "Nature", icon: Trees },
  { name: "City", icon: Building2 },
  { name: "Romantic", icon: Heart },
];

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/explore?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/explore");
    }
  }

  return (
    <main className="home">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={16} />
            Your next adventure starts here
          </span>

          <h1>
            Discover the world.
            <br />
            <span>Create your story.</span>
          </h1>

          <p>
            Explore breathtaking destinations, plan unforgettable
            journeys, and make every travel dream a reality.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={22} />

            <input
              type="text"
              placeholder="Where do you want to go?"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search destinations"
            />

            <button type="submit">
              Explore
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="hero-actions">
            <Link to="/explore" className="hero-secondary">
              <Compass size={18} />
              Explore Destinations
            </Link>

            <Link to="/my-trips" className="hero-secondary">
              <CalendarDays size={18} />
              Plan Your Trip
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="home-section destinations-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              EXPLORE THE WORLD
            </span>

            <h2>Popular Destinations</h2>

            <p>
              Beautiful places waiting to be discovered.
            </p>
          </div>

          <Link to="/explore" className="view-all">
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="destinations-grid">
          {destinations.map((destination) => (
            <Link
              to={`/explore?search=${encodeURIComponent(destination.name)}`}
              className="destination-card"
              key={destination.id}
            >
              <div className="destination-image">
                <img
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  loading="lazy"
                />

                <span className="destination-category">
                  {destination.category}
                </span>
              </div>

              <div className="destination-info">
                <div>
                  <h3>{destination.name}</h3>

                  <p>
                    <MapPin size={15} />
                    {destination.country}
                  </p>
                </div>

                <span className="destination-arrow">
                  <ArrowRight size={19} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRAVEL CATEGORIES */}
      <section className="home-section categories-section">
        <div className="center-heading">
          <span className="section-label">
            FIND YOUR PERFECT ESCAPE
          </span>

          <h2>Travel Your Way</h2>

          <p>
            Every traveler is different. Find the adventure
            that matches your style.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/explore?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              key={category.name}
            >
              <span className="category-icon">
                <category.icon size={42} strokeWidth={1.5} />
                </span>

              <h3>{category.name}</h3>

              <ArrowRight size={19} />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="home-section why-section">
        <div className="center-heading">
          <span className="section-label">
            WHY WANDERLY?
          </span>

          <h2>Everything You Need to Travel</h2>

          <p>
            From your first idea to your final itinerary,
            Wanderly helps you stay organized.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Globe2 size={28} />
            </div>

            <h3>Discover Destinations</h3>

            <p>
              Search beautiful places around the world
              and discover your next adventure.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <CalendarDays size={28} />
            </div>

            <h3>Plan Every Day</h3>

            <p>
              Organize activities, create itineraries,
              and keep your travel plans together.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Wallet size={28} />
            </div>

            <h3>Manage Your Budget</h3>

            <p>
              Track travel expenses and stay within
              your planned budget.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Heart size={28} />
            </div>

            <h3>Save Your Favorites</h3>

            <p>
              Create a wishlist of dream destinations
              and revisit them whenever you want.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="home-cta">
        <div className="cta-content">
          <span>YOUR ADVENTURE AWAITS</span>

          <h2>
            Ready to explore the world?
          </h2>

          <p>
            Start planning your next unforgettable journey
            with Wanderly.
          </p>

          <Link to="/my-trips" className="cta-button">
            Start Planning
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-brand">
          <Globe2 size={23} />
          <strong>Wanderly</strong>
        </div>

        <p>
          Explore more. Dream bigger. Travel better.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <span>
          © {new Date().getFullYear()} Wanderly.
          All rights reserved.
        </span>
      </footer>

    </main>
  );
}

export default Home;