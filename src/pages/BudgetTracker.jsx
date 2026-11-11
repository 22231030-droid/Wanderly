import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./BudgetTracker.css";

const categories = [
  "Food",
  "Transport",
  "Hotel",
  "Shopping",
  "Activities",
  "Other",
];

const colors = [
  "#6750A4",
  "#9575CD",
  "#42A5F5",
  "#FFB74D",
  "#66BB6A",
  "#EF5350",
];

const emptyForm = {
  title: "",
  amount: "",
  category: "Food",
  date: "",
};

function BudgetTracker() {
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

  const storageKey = `wanderlyExpenses_${tripId}`;

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(`wanderlyExpenses_${tripId}`) || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(expenses));
  }, [expenses, storageKey]);

  if (!trip) {
    return (
      <main className="budget-not-found">
        <h1>Trip not found</h1>
        <Link to="/my-trips">Back to My Trips</Link>
      </main>
    );
  }

  const budget = Number(trip.budget) || 0;

  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const remaining = budget - totalSpent;

  const percentage =
    budget > 0 ? (totalSpent / budget) * 100 : totalSpent > 0 ? 100 : 0;

  const chartData = categories
    .map((category) => ({
      name: category,
      value: expenses
        .filter((expense) => expense.category === category)
        .reduce(
          (total, expense) => total + Number(expense.amount),
          0
        ),
    }))
    .filter((item) => item.value > 0);

  function openAddModal() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: trip.startDate,
    });
    setError("");
    setShowModal(true);
  }

  function openEditModal(expense) {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
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

    if (!form.title.trim() || !form.date || form.amount === "") {
      setError("Please complete all required fields.");
      return;
    }

    if (
      !Number.isFinite(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!categories.includes(form.category)) {
      setError("Please select a valid category.");
      return;
    }

    if (form.date < trip.startDate || form.date > trip.endDate) {
      setError("Expense date must be within your trip dates.");
      return;
    }

    const expenseData = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    };

    if (editingId !== null) {
      setExpenses((previous) =>
        previous.map((expense) =>
          expense.id === editingId
            ? { ...expense, ...expenseData }
            : expense
        )
      );
    } else {
      setExpenses((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...expenseData,
        },
      ]);
    }

    closeModal();
  }

  function deleteExpense(id) {
    if (!window.confirm("Delete this expense?")) return;

    setExpenses((previous) =>
      previous.filter((expense) => expense.id !== id)
    );
  }

  return (
    <main className="budget-page">
      <section className="budget-header">
        <Link to={`/trips/${tripId}`} className="budget-back">
          <ArrowLeft size={18} />
          Back to Trip Planner
        </Link>

        <span>TRAVEL FINANCES</span>

        <h1 className="budget-title">
          Budget Tracker
          <Wallet size={52} strokeWidth={1.8} />
          </h1>

        <p>
          Manage your expenses for {trip.title} — {trip.destination}
        </p>
      </section>

      <div className="budget-container">
        <section className="budget-stats">
          <div className="budget-stat-card">
            <Wallet size={28} />
            <span>Total Budget</span>
            <h2>${budget.toLocaleString()}</h2>
          </div>

          <div className="budget-stat-card">
            <Wallet size={28} />
            <span>Total Spent</span>
            <h2>${totalSpent.toLocaleString()}</h2>
          </div>

          <div className="budget-stat-card">
            <Wallet size={28} />
            <span>Remaining Budget</span>
            <h2 className={remaining < 0 ? "budget-negative" : ""}>
              ${remaining.toLocaleString()}
            </h2>
          </div>
        </section>

        <section className="budget-overview">
          <div className="budget-progress-card">
            <h2>Budget Overview</h2>

            <p>
              You've used {percentage.toFixed(1)}% of your budget.
            </p>

            <div className="budget-progress-track">
              <div
                className={`budget-progress-fill ${
                  remaining < 0 ? "over-limit" : ""
                }`}
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />
            </div>

            {remaining < 0 && (
              <div className="budget-alert">
                <AlertTriangle size={20} />
                You've exceeded your travel budget!
              </div>
            )}

            {budget === 0 && totalSpent === 0 && (
              <p>
                Set a trip budget in My Trips to track your spending.
              </p>
            )}
          </div>

          <div className="budget-chart-card">
            <h2>Expenses by Category</h2>

            {chartData.length === 0 ? (
              <div className="budget-chart-empty">
                No expenses yet. Add one to see your chart.
              </div>
            ) : (
              <div className="budget-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={colors[categories.indexOf(entry.name)]}
                        />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        <section className="budget-expenses">
          <div className="budget-expenses-heading">
            <div>
              <h2>Your Expenses</h2>
              <p>Keep track of everything you spend.</p>
            </div>

            <button
              className="budget-primary-button"
              onClick={openAddModal}
            >
              <Plus size={19} />
              Add Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="budget-empty">
              <Wallet size={42} />
              <h3>No expenses recorded</h3>
              <p>Start tracking your travel spending.</p>
            </div>
          ) : (
            <div className="budget-expense-list">
              {[...expenses]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((expense) => (
                  <article
                    className="budget-expense-item"
                    key={expense.id}
                  >
                    <div>
                      <h3>{expense.title}</h3>
                      <p>
                        {expense.category} • {expense.date}
                      </p>
                    </div>

                    <strong>
                      ${Number(expense.amount).toLocaleString()}
                    </strong>

                    <div className="budget-expense-actions">
                      <button
                        onClick={() => openEditModal(expense)}
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => deleteExpense(expense.id)}
                        aria-label={`Delete ${expense.title}`}
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

      {showModal && (
        <div className="budget-modal-overlay">
          <div
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-modal-title"
          >
            <div className="budget-modal-heading">
              <h2 id="budget-modal-title">
                {editingId !== null ? "Edit Expense" : "Add Expense"}
              </h2>

              <button onClick={closeModal} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="expense-title">Expense Name *</label>
              <input
                id="expense-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Lunch"
                required
              />

              <label htmlFor="expense-amount">Amount (USD) *</label>
              <input
                id="expense-amount"
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
              />

              <label htmlFor="expense-category">Category *</label>
              <select
                id="expense-category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="expense-date">Date *</label>
              <input
                id="expense-date"
                type="date"
                name="date"
                min={trip.startDate}
                max={trip.endDate}
                value={form.date}
                onChange={handleChange}
                required
              />

              {error && (
                <p className="budget-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="budget-form-actions">
                <button
                  type="button"
                  className="budget-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="budget-primary-button"
                >
                  {editingId !== null ? "Save Changes" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default BudgetTracker;