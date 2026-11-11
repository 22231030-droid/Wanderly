import { Link } from "react-router-dom";

import {
  Plane,
  Heart,
  Globe2,
  Sparkles,
  MapPinned,
  CalendarDays,
  Wallet,
  ArrowRight,
  Compass,
} from "lucide-react";

import "./About.css";

function About() {
  const values = [
    {
      icon: <Heart size={28} />,
      title: "Travel with Passion",
      description:
        "We believe every journey should be filled with unforgettable experiences and meaningful memories.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Plan with Confidence",
      description:
        "We make travel planning easier by bringing your itinerary, budget, and essentials together.",
    },
    {
      icon: <Globe2 size={28} />,
      title: "Explore Without Limits",
      description:
        "Discover inspiring destinations and turn your travel dreams into organized adventures.",
    },
  ];

  const features = [
    {
      icon: <MapPinned size={24} />,
      title: "Discover Destinations",
      description: "Explore places around the world.",
    },
    {
      icon: <CalendarDays size={24} />,
      title: "Organize Your Journey",
      description: "Plan trips, activities, and schedules.",
    },
    {
      icon: <Wallet size={24} />,
      title: "Manage Your Budget",
      description: "Track expenses and travel smarter.",
    },
  ];

  return (
    <main className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">
            <Plane size={16} />
            GET TO KNOW WANDERLY
          </span>

          <h1>
            Every Great Journey
            <br />
            <span>Starts with a Dream.</span>
          </h1>

          <p>
            Wanderly is your personal travel companion,
            designed to make planning adventures simple,
            enjoyable, and stress-free.
          </p>

          <Link to="/explore" className="about-hero-button">
            Start Exploring
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story">
        <div className="about-story-image">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200"
            alt="Beautiful mountain landscape"
          />

          <div className="about-image-badge">
            <Compass size={24} />
            <div>
              <strong>Dream. Plan. Explore.</strong>
              <span>Your adventure starts here.</span>
            </div>
          </div>
        </div>

        <div className="about-story-content">
          <span className="about-section-label">
            WHO WE ARE
          </span>

          <h2>
            Making Travel Planning
            <span> Beautifully Simple.</span>
          </h2>

          <p>
            Planning a trip should be just as exciting as
            the journey itself. But organizing destinations,
            activities, budgets, and packing lists can
            quickly become overwhelming.
          </p>

          <p>
            That's why Wanderly was created: to bring
            everything you need for your next adventure
            into one easy-to-use platform.
          </p>

          <p>
            Whether you're dreaming of exploring Paris,
            discovering Tokyo, or relaxing in Bali,
            Wanderly helps you plan every step.
          </p>

          <Link to="/features" className="about-text-link">
            Discover Our Features
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="about-section-heading">
          <span className="about-section-label">
            WHAT WE BELIEVE
          </span>

          <h2>Our Core Values</h2>

          <p>
            The ideas that inspire every feature
            we build for travelers.
          </p>
        </div>

        <div className="about-values-grid">
          {values.map((value) => (
            <article
              className="about-value-card"
              key={value.title}
            >
              <div className="about-value-icon">
                {value.icon}
              </div>

              <h3>{value.title}</h3>

              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="about-mission">
        <div className="about-mission-content">
          <span className="about-section-label">
            OUR MISSION
          </span>

          <h2>
            Less Time Planning.
            <br />
            <span>More Time Exploring.</span>
          </h2>

          <p>
            Our mission is to make travel planning
            accessible, organized, and inspiring.
            We want travelers to spend less time
            managing details and more time enjoying
            the experiences that matter.
          </p>

          <div className="about-mission-features">
            {features.map((feature) => (
              <div
                className="about-mission-feature"
                key={feature.title}
              >
                <div>{feature.icon}</div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-content">
          <span>YOUR NEXT ADVENTURE AWAITS</span>

          <h2>
            Ready to Explore the World?
          </h2>

          <p>
            Start organizing your dream trip with Wanderly.
          </p>

          <Link to="/my-trips">
            Plan Your First Trip
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;