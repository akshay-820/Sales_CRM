/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  createCaller,
  deleteCaller,
  getCallers,
  updateCaller,
} from "../api";
import { CallerForm } from "../components/CallerForm";

export function CallersPage() {
  const [callers, setCallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function fetchCallers() {
    try {
      setLoading(true);
      const data = await getCallers();
      setCallers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCallers();
  }, []);

  function handleAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleEdit(caller) {
    setEditing(caller);
    setModalOpen(true);
  }

  async function handleDelete(caller) {
    if (!confirm(`Delete caller "${caller.name}"?`)) return;
    await deleteCaller(caller._id);
    fetchCallers();
  }

  async function handleSubmit(formData) {
    if (editing) {
      await updateCaller(editing._id, formData);
    } else {
      await createCaller(formData);
    }
    setModalOpen(false);
    setEditing(null);
    fetchCallers();
  }

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Caller Roster</h2>
        </div>
        <button className="primary-button" onClick={handleAdd}>
          + New caller
          <span className="badge">{callers.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading callers…</div>
      ) : callers.length === 0 ? (
        <div className="empty-state">
          No callers yet. Create your first one to start routing leads.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Caller</th>
                <th>Languages</th>
                <th>States</th>
                <th>Daily Limit</th>
                <th>Today</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {callers.map((caller) => (
                <tr key={caller._id}>
                  <td>
                    <div className="stacked">
                      <span className="value">{caller.name}</span>
                      <span className="label">{caller.role}</span>
                    </div>
                  </td>
                  <td>
                    {caller.languages?.length ? (
                      caller.languages.map((lang) => (
                        <span key={lang} className="pill-mini">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {caller.assignedStates?.length ? (
                      caller.assignedStates.map((st) => (
                        <span key={st} className="pill-mini">
                          {st}
                        </span>
                      ))
                    ) : (
                      <span className="muted">All states</span>
                    )}
                  </td>
                  <td>
                    <div className="stacked">
                      <span className="value">
                        {caller.dailyLeadLimit === 0
                          ? "Unlimited"
                          : caller.dailyLeadLimit}
                      </span>
                      <span className="label">per day</span>
                    </div>
                  </td>
                  <td>
                    <div className="stacked">
                      <span className="value mono">
                        {caller.leadsToday ?? 0}
                      </span>
                      <span className="label">today</span>
                    </div>
                  </td>
                  <td>
                    <div className="inline-actions" style={{ alignItems: "center" }}>
                      <span
                        className={`status-dot ${
                          caller.isActive ? "green" : "gray"
                        }`}
                      />
                      <span className="muted">
                        {caller.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="link-button"
                        type="button"
                        onClick={() => handleEdit(caller)}
                      >
                        Edit
                      </button>
                      <button
                        className="link-button danger"
                        type="button"
                        onClick={() => handleDelete(caller)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editing ? "Edit caller" : "New caller"}</h3>
            </div>
            <CallerForm
              initialValue={editing}
              onSubmit={handleSubmit}
              onCancel={() => {
                setModalOpen(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

