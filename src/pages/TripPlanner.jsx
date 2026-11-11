import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Luggage,
  X,
} from "lucide-react";

import "./TripPlanner.css";

const emptyActivity = {
  title: "",
  date: "",
  time: "",
  location: "",
  cost: "",
  notes: "",
};

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getTripDays(startDate, endDate) {
  const days = [];

  const current = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);

  while (current <= end && days.length < 366) {
    days.push(
      `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`
    );

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function TripPlanner() {
  const { tripId } = useParams();

  const [trips] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("wanderlyTrips") || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const trip = trips.find((item) => String(item.id) === tripId);

  const storageKey = `wanderlyActivities_${tripId}`;

  const [activities, setActivities] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`wanderlyActivities_${tripId}`) || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [selectedDate, setSelectedDate] = useState(
    trip?.startDate || ""
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyActivity);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(activities));
  }, [activities, storageKey]);

  if (!trip) {
    return (
      <main className="planner-not-found">
        <h1>Trip not found</h1>
        <p>This trip may have been deleted.</p>

        <Link to="/my-trips">Back to My Trips</Link>
      </main>
    );
  }

  const tripDays = getTripDays(trip.startDate, trip.endDate);

  const totalActivityCost = activities.reduce(
    (total, activity) => total + Number(activity.cost || 0),
    0
  );

  const remainingBudget = Number(trip.budget) - totalActivityCost;

  const selectedActivities = activities
    .filter((activity) => activity.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  function openAddModal() {
    setEditingId(null);
    setForm({
      ...emptyActivity,
      date: selectedDate,
    });
    setError("");
    setShowModal(true);
  }

  function openEditModal(activity) {
    setEditingId(activity.id);

    setForm({
      title: activity.title,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      cost: String(activity.cost),
      notes: activity.notes || "",
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

    if (!form.title.trim() || !form.date || !form.time) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.date < trip.startDate || form.date > trip.endDate) {
      setError("Activity date must be within your trip dates.");
      return;
    }

    if (
      form.cost === "" ||
      !Number.isFinite(Number(form.cost)) ||
      Number(form.cost) < 0
    ) {
      setError("Please enter a valid cost.");
      return;
    }

    const activityData = {
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      cost: Number(form.cost),
      notes: form.notes.trim(),
    };

    if (editingId !== null) {
      setActivities((previous) =>
        previous.map((activity) =>
          activity.id === editingId
            ? { ...activity, ...activityData }
            : activity
        )
      );
    } else {
      setActivities((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...activityData,
        },
      ]);
    }

    setSelectedDate(form.date);
    closeModal();
  }

  function deleteActivity(id) {
    if (!window.confirm("Delete this activity?")) return;

    setActivities((previous) =>
      previous.filter((activity) => activity.id !== id)
    );
  }

  return (
    <main className="planner-page">
      <section className="planner-header">
        <div className="planner-header-content">
          <Link to="/my-trips" className="planner-back">
            <ArrowLeft size={18} />
            Back to My Trips
          </Link>

          <span className="planner-label">
            YOUR PERSONAL ITINERARY
          </span>

          <h1>{trip.title}</h1>

          <p>
            <MapPin size={18} />
            {trip.destination}
          </p>

          <p>
            <CalendarDays size={18} />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </p>
        </div>
      </section>

      <div className="planner-container">
        <div className="planner-budget-navigation">
  <Link
    to={`/trips/${tripId}/budget`}
    className="planner-budget-link"
  >
    <Wallet size={20} />
    Open Budget Tracker
  </Link>

  <Link
    to={`/trips/${tripId}/packing`}
    className="planner-budget-link"
  >
    <Luggage size={20} />
    Packing Checklist
  </Link>
</div>
        <section className="planner-summary">
          <div className="planner-summary-card">
            <CalendarDays size={25} />

            <div>
              <span>Trip Duration</span>
              <strong>{tripDays.length} days</strong>
            </div>
          </div>

          <div className="planner-summary-card">
            <Wallet size={25} />

            <div>
              <span>Trip Budget</span>
              <strong>${Number(trip.budget).toLocaleString()}</strong>
            </div>
          </div>

          <div className="planner-summary-card">
            <Wallet size={25} />

            <div>
              <span>Planned Activities Cost</span>
              <strong>${totalActivityCost.toLocaleString()}</strong>
            </div>
          </div>

          <div className="planner-summary-card">
            <Wallet size={25} />

            <div>
              <span>Remaining Budget</span>
              <strong
                className={remainingBudget < 0 ? "over-budget" : ""}
              >
                ${remainingBudget.toLocaleString()}
              </strong>
            </div>
          </div>
        </section>

        {/* DAILY PLANNER */}
        <section className="planner-content">
          <div className="planner-section-heading">
            <div>
              <span className="planner-label">PLAN YOUR DAYS</span>
              <h2>Daily Itinerary</h2>
              <p>Organize activities for every day of your journey.</p>
            </div>

            <button
              className="planner-primary-button"
              onClick={openAddModal}
            >
              <Plus size={19} />
              Add Activity
            </button>
          </div>

          <div className="planner-days">
            {tripDays.map((day, index) => (
              <button
                key={day}
                className={`planner-day ${
                  selectedDate === day ? "active" : ""
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <strong>Day {index + 1}</strong>
                <span>{formatDate(day)}</span>
              </button>
            ))}
          </div>

          <div className="planner-day-heading">
            <h3>{formatDate(selectedDate)}</h3>

            <span>
              {selectedActivities.length} activities
            </span>
          </div>

          {selectedActivities.length === 0 ? (
            <div className="planner-empty">
              <CalendarDays size={45} />

              <h3>No activities planned yet</h3>

              <p>
                Add your first activity and start organizing this day.
              </p>

              <button
                className="planner-primary-button"
                onClick={openAddModal}
              >
                <Plus size={18} />
                Add Activity
              </button>
            </div>
          ) : (
            <div className="planner-activities">
              {selectedActivities.map((activity) => (
                <article
                  className="planner-activity"
                  key={activity.id}
                >
                  <div className="planner-activity-time">
                    <Clock size={18} />
                    {activity.time}
                  </div>

                  <div className="planner-activity-info">
                    <h3>{activity.title}</h3>

                    {activity.location && (
                      <p>
                        <MapPin size={16} />
                        {activity.location}
                      </p>
                    )}

                    {activity.notes && (
                      <p className="planner-activity-notes">
                        {activity.notes}
                      </p>
                    )}

                    <strong>
                      Estimated cost: ${Number(activity.cost).toLocaleString()}
                    </strong>
                  </div>

                  <div className="planner-activity-actions">
                    <button
                      onClick={() => openEditModal(activity)}
                      aria-label={`Edit ${activity.title}`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteActivity(activity.id)}
                      aria-label={`Delete ${activity.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ACTIVITY MODAL */}
      {showModal && (
        <div className="planner-modal-overlay">
          <div
            className="planner-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-modal-title"
          >
            <div className="planner-modal-header">
              <h2 id="activity-modal-title">
                {editingId !== null
                  ? "Edit Activity"
                  : "Add New Activity"}
              </h2>

              <button onClick={closeModal} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="activity-title">Activity Name *</label>
              <input
                id="activity-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Visit Eiffel Tower"
                required
              />

              <div className="planner-form-row">
                <div>
                  <label htmlFor="activity-date">Date *</label>
                  <input
                    id="activity-date"
                    type="date"
                    name="date"
                    min={trip.startDate}
                    max={trip.endDate}
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="activity-time">Time *</label>
                  <input
                    id="activity-time"
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label htmlFor="activity-location">Location</label>
              <input
                id="activity-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Paris, France"
              />

              <label htmlFor="activity-cost">Estimated Cost (USD) *</label>
              <input
                id="activity-cost"
                type="number"
                name="cost"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={handleChange}
                placeholder="e.g. 25"
                required
              />

              <label htmlFor="activity-notes">Notes</label>
              <textarea
                id="activity-notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional details..."
              />

              {error && (
                <p className="planner-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="planner-modal-actions">
                <button
                  type="button"
                  className="planner-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="planner-primary-button"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default TripPlanner;