import { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";

import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  Plane,
  Wallet,
} from "lucide-react";

import "react-calendar/dist/Calendar.css";
import "./TravelCalendar.css";

// Read saved data safely
function readSavedArray(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Convert a Date into YYYY-MM-DD
function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Format dates for display
function formatDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

function TravelCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [trips] = useState(() =>
    readSavedArray("wanderlyTrips")
  );

  // Load activities belonging to each trip
  const activities = trips.flatMap((trip) => {
    const savedActivities = readSavedArray(
      `wanderlyActivities_${trip.id}`
    );

    return savedActivities.map((activity) => ({
      ...activity,
      tripId: trip.id,
      tripTitle: trip.title,
      destination: trip.destination,
    }));
  });

  const selectedDateKey = toDateKey(selectedDate);

  // Find trips happening on the selected day
  const selectedTrips = trips.filter(
    (trip) =>
      selectedDateKey >= trip.startDate &&
      selectedDateKey <= trip.endDate
  );

  // Find activities happening on the selected day
  const selectedActivities = activities
    .filter((activity) => activity.date === selectedDateKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Check whether a calendar day belongs to a trip
  function hasTrip(dateKey) {
    return trips.some(
      (trip) =>
        dateKey >= trip.startDate &&
        dateKey <= trip.endDate
    );
  }

  // Check whether a calendar day has activities
  function hasActivity(dateKey) {
    return activities.some(
      (activity) => activity.date === dateKey
    );
  }

  return (
    <main className="travel-calendar-page">

      {/* HEADER */}
      <section className="travel-calendar-header">
        <span>YOUR TRAVEL SCHEDULE</span>

        <h1>Travel Calendar 📅</h1>

        <p>
          See your adventures, organize your activities,
          and never miss a moment of your journey.
        </p>
      </section>

      <div className="travel-calendar-container">

        {/* INTRODUCTION */}
        <div className="travel-calendar-intro">
          <div>
            <h2>Your Journey at a Glance</h2>

            <p>
              Select a date to explore your trips and
              scheduled activities.
            </p>
          </div>

          <div className="travel-calendar-legend">
            <span>
              <i className="legend-dot trip-dot" />
              Trip Day
            </span>

            <span>
              <i className="legend-dot activity-dot" />
              Activity
            </span>
          </div>
        </div>

        <div className="travel-calendar-layout">

          {/* CALENDAR */}
          <section className="travel-calendar-card">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              calendarType="gregory"
              tileClassName={({ date, view }) => {
                if (view !== "month") return null;

                const dateKey = toDateKey(date);

                return hasTrip(dateKey)
                  ? "calendar-trip-day"
                  : null;
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;

                const dateKey = toDateKey(date);

                if (!hasActivity(dateKey)) return null;

                return (
                  <span className="calendar-activity-indicator" />
                );
              }}
            />
          </section>

          {/* SELECTED DAY */}
          <section className="travel-calendar-details">

            <div className="calendar-details-heading">
              <CalendarDays size={25} />

              <div>
                <span>SELECTED DATE</span>
                <h2>{formatDate(selectedDateKey)}</h2>
              </div>
            </div>

            {/* TRIPS */}
            <div className="calendar-detail-section">
              <h3>
                <Plane size={19} />
                Trips
              </h3>

              {selectedTrips.length === 0 ? (
                <p className="calendar-no-data">
                  No trips scheduled for this day.
                </p>
              ) : (
                selectedTrips.map((trip) => (
                  <div
                    className="calendar-trip-item"
                    key={trip.id}
                  >
                    <h4>{trip.title}</h4>

                    <p>
                      <MapPin size={15} />
                      {trip.destination}
                    </p>

                    <Link to={`/trips/${trip.id}`}>
                      View Trip
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* ACTIVITIES */}
            <div className="calendar-detail-section">
              <h3>
                <Clock size={19} />
                Activities
              </h3>

              {selectedActivities.length === 0 ? (
                <p className="calendar-no-data">
                  No activities planned for this day.
                </p>
              ) : (
                selectedActivities.map((activity) => (
                  <div
                    className="calendar-activity-item"
                    key={`${activity.tripId}-${activity.id}`}
                  >
                    <div className="calendar-activity-time">
                      <Clock size={16} />
                      {activity.time}
                    </div>

                    <h4>{activity.title}</h4>

                    <p>
                      <MapPin size={15} />
                      {activity.location || activity.destination}
                    </p>

                    <p>
                      <Wallet size={15} />
                      Estimated: ${Number(
                        activity.cost || 0
                      ).toLocaleString()}
                    </p>

                    <Link to={`/trips/${activity.tripId}`}>
                      Open Trip Planner
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ))
              )}
            </div>

          </section>
        </div>

        {/* EMPTY STATE */}
        {trips.length === 0 && (
          <div className="calendar-empty-state">
            <Plane size={38} />

            <h2>Your calendar is waiting for an adventure!</h2>

            <p>
              Create your first trip to see it here.
            </p>

            <Link to="/my-trips">
              Create a Trip
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

export default TravelCalendar;