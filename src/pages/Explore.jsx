import { useState, useEffect } from "react";
import DestinationMap from "../components/DestinationMap";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Heart,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

import { destinations } from "../data/destinations";
import "./Explore.css";

function Explore() {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [country, setCountry] = useState("All");
  const [maxBudget, setMaxBudget] = useState(3000);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("wanderlyWishlist") || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(
      "wanderlyWishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const countries = [
    "All",
    ...new Set(destinations.map((destination) => destination.country)),
  ];

  const categories = [
    "All",
    "Adventure",
    "Beach",
    "Nature",
    "City",
    "Romantic",
  ];

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(search.toLowerCase()) ||
      destination.country.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || destination.category === category;

    const matchesCountry =
      country === "All" || destination.country === country;

    const matchesBudget = destination.budget <= maxBudget;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCountry &&
      matchesBudget
    );
  });

  function toggleWishlist(id) {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setCountry("All");
    setMaxBudget(3000);
  }

  return (
    <main className="explore-page">

      <section className="explore-hero">
        <span>DISCOVER YOUR NEXT ADVENTURE</span>

        <h1>Explore Destinations</h1>

        <p>
          Find beautiful places around the world and
          start planning your dream journey.
        </p>
      </section>

      <section className="explore-container">

        <div className="explore-toolbar">
          <div className="explore-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search destinations or countries..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="results-count">
            <SlidersHorizontal size={18} />
            {filteredDestinations.length} destinations found
          </div>
        </div>

        <div className="explore-layout">

          <aside className="explore-sidebar">
            <div className="filter-heading">
              <h3>Filters</h3>

              <button onClick={resetFilters}>
                <RotateCcw size={15} />
                Reset
              </button>
            </div>

            <div className="filter-group">
              <label htmlFor="category-filter">
                Travel Category
              </label>

              <select
                id="category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="country-filter">
                Country
              </label>

              <select
                id="country-filter"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Countries" : item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="budget-filter">
                Maximum Estimated Budget
              </label>

              <input
                id="budget-filter"
                type="range"
                min="500"
                max="3000"
                step="100"
                value={maxBudget}
                onChange={(event) =>
                  setMaxBudget(Number(event.target.value))
                }
              />

              <div className="budget-label">
                Up to ${maxBudget.toLocaleString()}
              </div>
            </div>
          </aside>

          <div className="explore-results">
            {filteredDestinations.length === 0 ? (
              <div className="explore-empty">
                <Search size={42} />

                <h2>No destinations found</h2>

                <p>
                  Try another search or adjust your filters.
                </p>

                <button onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="explore-grid">
                {filteredDestinations.map((destination) => {
                  const isFavorite = wishlist.includes(destination.id);

                  return (
                    <article
                      className="explore-card"
                      key={destination.id}
                    >
                      <div className="explore-card-image">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          loading="lazy"
                        />

                        <span className="explore-card-category">
                          {destination.category}
                        </span>

                        <button
                          className={`wishlist-button ${
                            isFavorite ? "is-favorite" : ""
                          }`}
                          onClick={() => toggleWishlist(destination.id)}
                          aria-label={
                            isFavorite
                              ? `Remove ${destination.name} from wishlist`
                              : `Add ${destination.name} to wishlist`
                          }
                          aria-pressed={isFavorite}
                        >
                          <Heart
                            size={21}
                            fill={isFavorite ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      <div className="explore-card-content">
                        <h3>{destination.name}</h3>

                        <p className="explore-location">
                          <MapPin size={15} />
                          {destination.country}
                        </p>

                        <p className="explore-description">
                          {destination.description}
                        </p>

                        <div className="explore-card-footer">
                          <div>
                            <small>Illustrative budget</small>
                            <strong>
                              ${destination.budget.toLocaleString()}
                            </strong>
                          </div>

                          <button
                            className="explore-details-button"
                            onClick={() => toggleWishlist(destination.id)}
                          >
                            {isFavorite ? "Saved ♥" : "Save ♡"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

        </div>
        <section className="explore-map-section">
  <div className="explore-map-heading">
    <span>EXPLORE THE WORLD</span>

    <h2>Discover Destinations on the Map</h2>

    <p>
      Explore destinations around the world.
      Click on a marker to discover more information.
    </p>
  </div>

  <DestinationMap destinations={filteredDestinations} />
</section>
      </section>
    </main>
  );
}

export default Explore;