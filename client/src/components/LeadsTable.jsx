/* eslint-disable react/prop-types */

export function LeadsTable({ leads }) {
  if (!leads || leads.length === 0) {
    return <div className="empty-state">No leads yet. They will appear here in real time.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Source</th>
            <th>Assigned Caller</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>
                <div className="stacked">
                  <span className="value">{lead.name || "-"}</span>
                  <span className="label mono">{lead._id.slice(-6)}</span>
                </div>
              </td>
              <td>
                <div className="stacked">
                  <span className="value mono">{lead.phone}</span>
                  {lead.city && (
                    <span className="label">{lead.city}</span>
                  )}
                </div>
              </td>
              <td>
                <span className="pill-mini">{lead.state || "—"}</span>
              </td>
              <td>
                <span className="badge-soft.blue badge-soft">
                  {lead.leadSource}
                </span>
              </td>
              <td>
                {lead.assignedCaller ? (
                  <div className="stacked">
                    <span className="value">{lead.assignedCaller.name}</span>
                    <span className="label">{lead.assignedCaller.role}</span>
                  </div>
                ) : (
                  <span className="muted">Unassigned</span>
                )}
              </td>
              <td>
                <div className="stacked">
                  <span className="value">
                    {new Date(lead.timestamp).toLocaleString()}
                  </span>
                  <span className="label">
                    Created {new Date(lead.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </td>
              <td>
                <span
                  className={`badge-soft ${
                    lead.status === "assigned"
                      ? "green"
                      : lead.status === "in_progress"
                      ? "blue"
                      : lead.status === "closed"
                      ? "amber"
                      : lead.status === "invalid"
                      ? "red"
                      : ""
                  }`}
                >
                  {lead.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

