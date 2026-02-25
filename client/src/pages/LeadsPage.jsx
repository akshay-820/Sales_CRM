/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getLeads } from "../api";
import { useSocket } from "../hooks/useSocket";
import { LeadsTable } from "../components/LeadsTable";

export function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLeads() {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  useSocket(() => {
    // On any new lead, simply refetch to keep things in sync
    fetchLeads();
  });

  return (
    <div>
      {loading ? (
        <div className="empty-state">Loading leads…</div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}

