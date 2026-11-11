import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  Check,
  Luggage,
  X,
  Sparkles,
} from "lucide-react";

import "./PackingChecklist.css";

const categories = [
  "Clothes",
  "Electronics",
  "Documents",
  "Toiletries",
  "Other",
];

const quickItems = [
  { name: "Passport", category: "Documents" },
  { name: "Phone Charger", category: "Electronics" },
  { name: "Toothbrush", category: "Toiletries" },
  { name: "T-Shirts", category: "Clothes" },
  { name: "Travel Adapter", category: "Electronics" },
  { name: "Travel Insurance", category: "Documents" },
];

function readSavedArray(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function PackingChecklist() {
  const { tripId } = useParams();

  const [trips] = useState(() =>
    readSavedArray("wanderlyTrips")
  );

  const trip = trips.find(
    (item) => String(item.id) === tripId
  );

  const storageKey = `wanderlyPacking_${tripId}`;

  const [items, setItems] = useState(() =>
    readSavedArray(`wanderlyPacking_${tripId}`)
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Clothes");
  const [editingId, setEditingId] = useState(null);

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(items)
    );
  }, [items, storageKey]);

  if (!trip) {
    return (
      <main className="packing-not-found">
        <h1>Trip not found</h1>

        <p>This trip may have been deleted.</p>

        <Link to="/my-trips">
          Back to My Trips
        </Link>
      </main>
    );
  }

  const totalItems = items.length;

  const packedItems = items.filter(
    (item) => item.packed
  ).length;

  const remainingItems = totalItems - packedItems;

  const progress =
    totalItems > 0
      ? Math.round((packedItems / totalItems) * 100)
      : 0;

  const filteredItems = items.filter(
    (item) =>
      filter === "All" ||
      item.category === filter
  );

  function resetForm() {
    setName("");
    setCategory("Clothes");
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) return;

    if (editingId !== null) {
      setItems((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: cleanName,
                category,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: crypto.randomUUID(),
        name: cleanName,
        category,
        packed: false,
      };

      setItems((previous) => [
        ...previous,
        newItem,
      ]);
    }

    resetForm();
  }

  function togglePacked(id) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              packed: !item.packed,
            }
          : item
      )
    );
  }

  function editItem(item) {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
  }

  function deleteItem(id) {
    setItems((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  function addQuickItem(quickItem) {
    const alreadyExists = items.some(
      (item) =>
        item.name.toLowerCase() ===
        quickItem.name.toLowerCase()
    );

    if (alreadyExists) return;

    setItems((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: quickItem.name,
        category: quickItem.category,
        packed: false,
      },
    ]);
  }

  return (
    <main className="packing-page">

      {/* HEADER */}
      <section className="packing-header">
        <Link
          to={`/trips/${tripId}`}
          className="packing-back"
        >
          <ArrowLeft size={18} />
          Back to Trip Planner
        </Link>

        <span>GET READY FOR YOUR ADVENTURE</span>

        <h1 className="packing-title">
          Packing Checklist
          <Luggage size={52} strokeWidth={1.8} />
          </h1>

        <p>
          Prepare everything you need for
          {" "}{trip.title} — {trip.destination}
        </p>
      </section>

      <div className="packing-container">

        {/* PROGRESS */}
        <section className="packing-progress-card">
          <div className="packing-progress-heading">
            <div>
              <span>PACKING PROGRESS</span>

              <h2>
                {progress === 100 && totalItems > 0
                  ? "Your bags are ready! 🎉"
                  : "Let's get packing!"}
              </h2>

              <p>
                {packedItems} of {totalItems} items packed
              </p>
            </div>

            <div className="packing-progress-circle">
              {progress}%
            </div>
          </div>

          <div className="packing-progress-track">
            <div
              className="packing-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="packing-stats">
            <div>
              <strong>{totalItems}</strong>
              <span>Total Items</span>
            </div>

            <div>
              <strong>{packedItems}</strong>
              <span>Packed</span>
            </div>

            <div>
              <strong>{remainingItems}</strong>
              <span>Remaining</span>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="packing-layout">

          {/* ADD ITEM FORM */}
          <aside className="packing-sidebar">
            <div className="packing-form-card">
              <h2>
                <Plus size={22} />
                {editingId !== null
                  ? "Edit Item"
                  : "Add New Item"}
              </h2>

              <form onSubmit={handleSubmit}>
                <label htmlFor="packing-item-name">
                  Item Name
                </label>

                <input
                  id="packing-item-name"
                  type="text"
                  placeholder="e.g. Sunglasses"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />

                <label htmlFor="packing-category">
                  Category
                </label>

                <select
                  id="packing-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="packing-primary-button"
                >
                  {editingId !== null ? (
                    <>
                      <Check size={18} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Item
                    </>
                  )}
                </button>

                {editingId !== null && (
                  <button
                    type="button"
                    className="packing-cancel-button"
                    onClick={resetForm}
                  >
                    <X size={16} />
                    Cancel Editing
                  </button>
                )}
              </form>
            </div>

            {/* QUICK ADD */}
            <div className="packing-quick-card">
              <h3>
                <Sparkles size={19} />
                Quick Add
              </h3>

              <p>
                Add common travel essentials
                with one click.
              </p>

              <div className="packing-quick-list">
                {quickItems.map((item) => {
                  const alreadyAdded = items.some(
                    (saved) =>
                      saved.name.toLowerCase() ===
                      item.name.toLowerCase()
                  );

                  return (
                    <button
                      key={item.name}
                      onClick={() => addQuickItem(item)}
                      disabled={alreadyAdded}
                    >
                      {alreadyAdded ? (
                        <Check size={16} />
                      ) : (
                        <Plus size={16} />
                      )}

                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CHECKLIST */}
          <section className="packing-list-section">
            <div className="packing-list-heading">
              <div>
                <span>YOUR TRAVEL ESSENTIALS</span>
                <h2>My Packing List</h2>
              </div>

              <Luggage size={30} />
            </div>

            {/* FILTERS */}
            <div className="packing-filters">
              {["All", ...categories].map((item) => (
                <button
                  key={item}
                  className={
                    filter === item ? "active" : ""
                  }
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* ITEMS */}
            {filteredItems.length === 0 ? (
              <div className="packing-empty">
                <Luggage size={45} />

                <h3>No items here yet</h3>

                <p>
                  Add items to start preparing
                  for your trip.
                </p>
              </div>
            ) : (
              <div className="packing-items">
                {filteredItems.map((item) => (
                  <div
                    className={`packing-item ${
                      item.packed ? "packed" : ""
                    }`}
                    key={item.id}
                  >
                    <button
                      className="packing-checkbox"
                      onClick={() =>
                        togglePacked(item.id)
                      }
                      aria-label={
                        item.packed
                          ? `Mark ${item.name} as unpacked`
                          : `Mark ${item.name} as packed`
                      }
                      aria-pressed={item.packed}
                    >
                      {item.packed && (
                        <Check size={17} />
                      )}
                    </button>

                    <div className="packing-item-info">
                      <h3>{item.name}</h3>

                      <span>{item.category}</span>
                    </div>

                    <div className="packing-item-actions">
                      <button
                        onClick={() => editItem(item)}
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          deleteItem(item.id)
                        }
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default PackingChecklist;