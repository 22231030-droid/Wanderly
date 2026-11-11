import { Link } from "react-router-dom";

import {
  ArrowRight,
  Search,
  MapPinned,
  Heart,
  CalendarDays,
  Wallet,
  Luggage,
  ListChecks,
  Plane,
  Sparkles,
  CheckCircle2,
  Compass,
} from "lucide-react";

import "./Features.css";

const features = [
  {
    icon: Search,
    title: "Explore Destinations",
    description:
      "Discover beautiful destinations around the world. Search by name and filter places by category, country, and budget.",
    link: "/explore",
    button: "Explore Destinations",
    color: "purple",
  },
  {
    icon: MapPinned,
    title: "Interactive Travel Map",
    description:
      "Explore destinations on an interactive map. View locations and discover places you might want to visit.",
    link: "/explore",
    button: "View Map",
    color: "blue",
  },
  {
    icon: Heart,
    title: "Save Your Favorites",
    description:
      "Create your personal wishlist by saving destinations that inspire you. Keep your dream places together.",
    link: "/explore",
    button: "Find Favorites",
    color: "pink",
  },
  {
    icon: Plane,
    title: "Manage Your Trips",
    description:
      "Create, edit, and organize your trips. Keep track of destinations, travel dates, budgets, and notes.",
    link: "/my-trips",
    button: "My Trips",
    color: "orange",
  },
  {
    icon: ListChecks,
    title: "Daily Trip Planner",
    description:
      "Build a personalized itinerary with activities, times, locations, estimated costs, and notes.",
    link: "/my-trips",
    button: "Plan a Trip",
    color: "green",
  },
  {
    icon: Wallet,
    title: "Budget Tracker",
    description:
      "Record travel expenses, track your remaining budget, and understand your spending with visual charts.",
    link: "/my-trips",
    button: "Manage Budget",
    color: "purple",
  },
  {
    icon: CalendarDays,
    title: "Travel Calendar",
    description:
      "View your upcoming trips and scheduled activities in an interactive monthly calendar.",
    link: "/calendar",
    button: "Open Calendar",
    color: "blue",
  },
  {
    icon: Luggage,
    title: "Packing Checklist",
    description:
      "Create packing lists for each trip, organize items by category, and track your packing progress.",
    link: "/my-trips",
    button: "Get Organized",
    color: "pink",
  },
];

const steps = [
  {
    number: "01",
    icon: Compass,
    title: "Discover",
    description:
      "Explore destinations and find the perfect place for your next adventure.",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Plan",
    description:
      "Create your trip and organize your daily activities, travel dates, and budget.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Get Ready",
    description:
      "Prepare your packing checklist and keep your travel plans organized.",
  },
];

function Features() {
  return (
    <main className="features-page">

      {/* HERO */}
      <section className="features-hero">
        <div className="features-hero-content">

          <span className="features-hero-badge">
            <Sparkles size={16} />
            EVERYTHING YOU NEED TO TRAVEL
          </span>

          <h1>
            Powerful Tools for
            <br />
            <span>Unforgettable Journeys.</span>
          </h1>

          <p>
            From discovering your next destination to
            organizing every detail, Wanderly makes
            travel planning simple and enjoyable.
          </p>

          <Link to="/my-trips" className="features-hero-button">
            Start Planning
            <ArrowRight size={19} />
          </Link>

        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="features-main-section">

        <div className="features-section-heading">
          <span>EXPLORE OUR FEATURES</span>

          <h2>
            Everything You Need,
            <br />
            <span>All in One Place.</span>
          </h2>

          <p>
            Discover the tools that help you turn
            travel dreams into organized adventures.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="features-card"
                key={feature.title}
              >
                <div
                  className={`features-card-icon ${feature.color}`}
                >
                  <Icon size={27} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <Link to={feature.link}>
                  {feature.button}
                  <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="features-how-section">

        <div className="features-section-heading">
          <span>YOUR JOURNEY STARTS HERE</span>

          <h2>
            Travel Planning in
            <span> Three Simple Steps.</span>
          </h2>

          <p>
            Wanderly helps you organize your adventure
            from the first idea to the final checklist.
          </p>
        </div>

        <div className="features-steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                className="features-step-card"
                key={step.number}
              >
                <span className="features-step-number">
                  {step.number}
                </span>

                <div className="features-step-icon">
                  <Icon size={30} />
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            );
          })}
        </div>

      </section>

      {/* FEATURE HIGHLIGHT */}
      <section className="features-highlight">

        <div className="features-highlight-image">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
            alt="Travel planning with a map and travel essentials"
          />
        </div>

        <div className="features-highlight-content">

          <span>PLAN SMARTER, TRAVEL BETTER</span>

          <h2>
            Your Entire Adventure,
            <br />
            <strong>Beautifully Organized.</strong>
          </h2>

          <p>
            No more scattered notes or forgotten plans.
            Wanderly brings your travel details together
            in one convenient place.
          </p>

          <div className="features-highlight-list">
            <div>
              <CheckCircle2 size={20} />
              Personalized daily itineraries
            </div>

            <div>
              <CheckCircle2 size={20} />
              Travel budget and expense tracking
            </div>

            <div>
              <CheckCircle2 size={20} />
              Interactive calendar
            </div>

            <div>
              <CheckCircle2 size={20} />
              Organized packing checklists
            </div>
          </div>

          <Link to="/my-trips">
            Create Your Trip
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

      {/* CTA */}
      <section className="features-cta">
        <div className="features-cta-content">

          <span>READY FOR YOUR NEXT ADVENTURE?</span>

          <h2>
            Your Dream Trip Starts Here.
          </h2>

          <p>
            Discover amazing places and start planning
            your next unforgettable journey.
          </p>

          <div className="features-cta-buttons">
            <Link to="/explore" className="features-cta-primary">
              Explore Destinations
              <ArrowRight size={18} />
            </Link>

            <Link to="/my-trips" className="features-cta-secondary">
              My Trips
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Features;