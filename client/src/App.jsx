import "./App.css";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { LeadsPage } from "./pages/LeadsPage";
import { CallersPage } from "./pages/CallersPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="brand-text">
              <span className="brand-title">Sales CRM</span>
            </div>
          </div>

          <div className="nav-group">
            <span className="nav-label">Workspace</span>
            <nav className="nav-list">
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="icon-pill">◎</span>
                <span>Leads stream</span>
              </NavLink>
              <NavLink
                to="/callers"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="icon-pill">✱</span>
                <span>Caller routing</span>
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="main-panel">
          <header className="main-header">
            <div className="main-title-group">
              <h1>Sales CRM</h1>
            </div>
          </header>

          <section className="content-card">
            <Routes>
              <Route path="/" element={<Navigate to="/leads" replace />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/callers" element={<CallersPage />} />
              <Route path="*" element={<Navigate to="/leads" replace />} />
            </Routes>
          </section>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
