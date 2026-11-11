import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Plane,
  CalendarDays,
  Wallet,
  MapPin,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";

import "./MyTrips.css";

const initialForm = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  notes: "",
};

function getTripStatus(trip) {
  const today = new Date().toLocaleDateString("en-CA");

  if (trip.endDate < today) {
    return "Completed";
  }

  if (trip.startDate > today) {
    return "Upcoming";
  }

  return "Ongoing";
}

function MyTrips() {
  const [trips, setTrips] = useState(() => {
    try {
      const savedTrips = JSON.parse(
        localStorage.getItem("wanderlyTrips") || "[]"
      );

      return Array.isArray(savedTrips) ? savedTrips : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("wanderlyTrips", JSON.stringify(trips));
  }, [trips]);

  const filteredTrips = trips.filter((trip) => {
    const query = search.toLowerCase();

    return (
      trip.title.toLowerCase().includes(query) ||
      trip.destination.toLowerCase().includes(query)
    );
  });

  const upcomingTrips = trips.filter(
    (trip) => getTripStatus(trip) === "Upcoming"
  ).length;

  const completedTrips = trips.filter(
    (trip) => getTripStatus(trip) === "Completed"
  ).length;

  const totalBudget = trips.reduce(
    (total, trip) => total + Number(trip.budget || 0),
    0
  );

  function openCreateModal() {
    setEditingId(null);
    setForm({ ...initialForm });
    setError("");
    setShowModal(true);
  }

  function openEditModal(trip) {
    setEditingId(trip.id);

    setForm({
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: String(trip.budget),
      notes: trip.notes || "",
    });

    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.destination.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    if (
      form.budget === "" ||
      !Number.isFinite(Number(form.budget)) ||
      Number(form.budget) < 0
    ) {
      setError("Please enter a valid budget.");
      return;
    }

    const tripData = {
      title: form.title.trim(),
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget),
      notes: form.notes.trim(),
    };

    if (editingId !== null) {
      setTrips((previous) =>
        previous.map((trip) =>
          trip.id === editingId
            ? { ...trip, ...tripData }
            : trip
        )
      );
    } else {
      const newTrip = {
        id: crypto.randomUUID(),
        ...tripData,
        createdAt: new Date().toISOString(),
      };

      setTrips((previous) => [...previous, newTrip]);
    }

    closeModal();
  }

  function deleteTrip(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) return;

    setTrips((previous) =>
      previous.filter((trip) => trip.id !== id)
    );
  }

  return (
    <main className="trips-page">

      {/* HEADER */}
      <section className="trips-header">
        <div>
          <span className="trips-eyebrow">
            YOUR PERSONAL TRAVEL SPACE
          </span>

          <h1 className="mytrips-title">
            My Trips
            <Plane size={52} strokeWidth={1.8} />
            </h1>

          <p>
            Plan your adventures, organize your journeys,
            and keep your travel dreams in one place.
          </p>
        </div>

        <button
          className="trips-primary-button"
          onClick={openCreateModal}
        >
          <Plus size={20} />
          Create New Trip
        </button>
      </section>

      <div className="trips-container">

        {/* DASHBOARD STATISTICS */}
        <section className="trips-stats">
          <div className="trip-stat-card">
            <div className="trip-stat-icon purple">
              <Plane size={25} />
            </div>

            <div>
              <span>Total Trips</span>
              <h2>{trips.length}</h2>
            </div>
          </div>

          <div className="trip-stat-card">
            <div className="trip-stat-icon blue">
              <CalendarDays size={25} />
            </div>

            <div>
              <span>Upcoming Trips</span>
              <h2>{upcomingTrips}</h2>
            </div>
          </div>

          <div className="trip-stat-card">
            <div className="trip-stat-icon green">
              <CheckCircle2 size={25} />
            </div>

            <div>
              <span>Completed Trips</span>
              <h2>{completedTrips}</h2>
            </div>
          </div>

          <div className="trip-stat-card">
            <div className="trip-stat-icon orange">
              <Wallet size={25} />
            </div>

            <div>
              <span>Total Planned Budget</span>
              <h2>${totalBudget.toLocaleString()}</h2>
            </div>
          </div>
        </section>

        <div className="trips-calendar-navigation">
  <Link to="/calendar" className="trips-calendar-link">
    <CalendarDays size={19} />
    Open Travel Calendar
  </Link>
</div>

        <section className="trips-toolbar">
          <div>
            <h2>Your Adventures</h2>
            <p>All your travel plans in one place.</p>
          </div>

          <div className="trips-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search your trips..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </section>

        {/* TRIPS */}
        {filteredTrips.length === 0 ? (
          <div className="trips-empty">
            <div className="trips-empty-icon">
              <Plane size={40} />
            </div>

            <h2>
              {trips.length === 0
                ? "Your next adventure starts here!"
                : "No matching trips found"}
            </h2>

            <p>
              {trips.length === 0
                ? "Create your first trip and start exploring the world."
                : "Try searching for another destination or trip name."}
            </p>

            {trips.length === 0 && (
              <button
                className="trips-primary-button"
                onClick={openCreateModal}
              >
                <Plus size={19} />
                Create Your First Trip
              </button>
            )}
          </div>
        ) : (
          <div className="trips-grid">
            {filteredTrips.map((trip) => {
              const status = getTripStatus(trip);

              return (
                <article className="trip-card" key={trip.id}>
                  <div className="trip-card-banner">
                    <span className="trip-banner-icon">
                      ✈️
                    </span>

                    <span
                      className={`trip-status ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="trip-card-content">
                    <h3>{trip.title}</h3>

                    <p className="trip-destination">
                      <MapPin size={17} />
                      {trip.destination}
                    </p>

                    <div className="trip-card-details">
                      <div>
                        <CalendarDays size={17} />

                        <span>
                          {trip.startDate} — {trip.endDate}
                        </span>
                      </div>

                      <div>
                        <Wallet size={17} />

                        <span>
                          Budget: ${Number(trip.budget).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {trip.notes && (
                      <p className="trip-notes">
                        {trip.notes}
                      </p>
                    )}
                    <Link
  to={`/trips/${trip.id}`}
  className="trip-plan-button"
>
  <CalendarDays size={18} />
  Plan Trip
</Link>
                    <div className="trip-card-actions">
                      <button
                        className="trip-edit-button"
                        onClick={() => openEditModal(trip)}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        className="trip-delete-button"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div
          className="trip-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="trip-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-modal-title"
          >
            <div className="trip-modal-header">
              <div>
                <h2 id="trip-modal-title">
                  {editingId !== null
                    ? "Edit Your Trip"
                    : "Create New Trip"}
                </h2>

                <p>
                  Let's make your next journey unforgettable.
                </p>
              </div>

              <button
                className="trip-modal-close"
                onClick={closeModal}
                aria-label="Close form"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="trip-form-group">
                <label htmlFor="trip-title">
                  Trip Name *
                </label>

                <input
                  id="trip-title"
                  type="text"
                  name="title"
                  placeholder="e.g. Summer in Italy"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="trip-form-group">
                <label htmlFor="trip-destination">
                  Destination *
                </label>

                <input
                  id="trip-destination"
                  type="text"
                  name="destination"
                  placeholder="e.g. Rome, Italy"
                  value={form.destination}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="trip-form-row">
                <div className="trip-form-group">
                  <label htmlFor="trip-start">
                    Start Date *
                  </label>

                  <input
                    id="trip-start"
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="trip-form-group">
                  <label htmlFor="trip-end">
                    End Date *
                  </label>

                  <input
                    id="trip-end"
                    type="date"
                    name="endDate"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="trip-form-group">
                <label htmlFor="trip-budget">
                  Estimated Budget (USD) *
                </label>

                <input
                  id="trip-budget"
                  type="number"
                  name="budget"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 2000"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="trip-form-group">
                <label htmlFor="trip-notes">
                  Notes (Optional)
                </label>

                <textarea
                  id="trip-notes"
                  name="notes"
                  rows="3"
                  placeholder="What are you excited to explore?"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <p className="trip-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="trip-form-actions">
                <button
                  type="button"
                  className="trip-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="trips-primary-button"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyTrips;