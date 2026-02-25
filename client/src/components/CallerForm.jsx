/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Kannada", "Marathi", "Tamil"];
const STATE_OPTIONS = [
  "Maharashtra",
  "Karnataka",
  "Kerala",
  "Tamil Nadu",
  "Delhi",
  "Gujarat",
];

export function CallerForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    role: "Sales",
    languages: [],
    dailyLeadLimit: 20,
    assignedStates: [],
    isActive: true,
  });

  useEffect(() => {
    if (initialValue) {
      setForm({
        name: initialValue.name || "",
        role: initialValue.role || "Sales",
        languages: initialValue.languages || [],
        dailyLeadLimit: initialValue.dailyLeadLimit ?? 20,
        assignedStates: initialValue.assignedStates || [],
        isActive: initialValue.isActive ?? true,
      });
    }
  }, [initialValue]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toggleArrayValue(field, value) {
    setForm((prev) => {
      const current = new Set(prev[field] || []);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return {
        ...prev,
        [field]: Array.from(current),
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      dailyLeadLimit: Number(form.dailyLeadLimit) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            placeholder="Caller name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            name="role"
            placeholder="Sales, TL, Manager"
            value={form.role}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Languages</label>
          <div className="form-helper">Multi-select</div>
          <div className="inline-actions" style={{ flexWrap: "wrap" }}>
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang}
                type="button"
                className="pill-mini"
                style={{
                  borderColor: form.languages.includes(lang)
                    ? "rgba(34,197,94,0.7)"
                    : undefined,
                  background: form.languages.includes(lang)
                    ? "rgba(22,163,74,0.25)"
                    : undefined,
                  color: form.languages.includes(lang)
                    ? "#bbf7d0"
                    : undefined,
                }}
                onClick={() => toggleArrayValue("languages", lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="dailyLeadLimit">Daily lead limit</label>
          <input
            id="dailyLeadLimit"
            name="dailyLeadLimit"
            type="number"
            min="0"
            value={form.dailyLeadLimit}
            onChange={handleChange}
          />
          <div className="form-helper">0 = unlimited</div>
        </div>

        <div className="form-field">
          <label>Assigned states</label>
          <div className="form-helper">Multi-select</div>
          <div className="inline-actions" style={{ flexWrap: "wrap" }}>
            {STATE_OPTIONS.map((state) => (
              <button
                key={state}
                type="button"
                className="pill-mini"
                style={{
                  borderColor: form.assignedStates.includes(state)
                    ? "rgba(59,130,246,0.7)"
                    : undefined,
                  background: form.assignedStates.includes(state)
                    ? "rgba(37,99,235,0.3)"
                    : undefined,
                  color: form.assignedStates.includes(state)
                    ? "#bfdbfe"
                    : undefined,
                }}
                onClick={() => toggleArrayValue("assignedStates", state)}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="isActive">Status</label>
          <select
            id="isActive"
            name="isActive"
            value={form.isActive ? "active" : "inactive"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                isActive: e.target.value === "active",
              }))
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button">
          Save caller
        </button>
      </div>
    </form>
  );
}

