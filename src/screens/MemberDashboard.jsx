import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";

  /* =========================
     RESPONSIVE HANDLING
  ========================== */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     FETCH MEMBERS
  ========================== */
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/registrations`);
        setMembers(response.data);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleNavClick = (view) => {
    setActiveView(view);
    if (isMobile) setSidebarOpen(false);
  };

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={styles.mobileTopBar}>
          <button onClick={toggleSidebar} style={styles.menuButton}>
            {isSidebarOpen ? "✕" : "☰"}
          </button>
          <h2 style={{ ...styles.logo, fontSize: "1.2rem" }}>Harmy Member</h2>
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          position: isMobile ? "fixed" : "relative",
          zIndex: 1000,
        }}
      >
        <div style={styles.logoWrapper}>
          <h2 style={styles.logo}>Harmy Member</h2>
        </div>

        <nav>
          <ul style={styles.menu}>
            {[
              "Dashboard",
              "Members",
              "Attendance",
              "Contributions",
              "Settings",
            ].map((item) => (
              <li
                key={item}
                onClick={() => handleNavClick(item)}
                style={{
                  ...styles.menuItem,
                  ...(activeView === item ? styles.active : {}),
                }}
              >
                {item}
              </li>
            ))}

            {/* LOGOUT */}
            <li
              onClick={handleLogout}
              style={{
                ...styles.menuItem,
                marginTop: "2rem",
                backgroundColor: "#7f1d1d",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          ...styles.main,
          paddingTop: isMobile ? "5rem" : "2rem",
        }}
      >
        <header style={styles.header}>
          <h1 style={styles.title}>
            {activeView === "Dashboard" ? "Dashboard Overview" : activeView}
          </h1>
        </header>

        {/* DASHBOARD */}
        {activeView === "Dashboard" && (
          <>
            <div style={styles.cards}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Members</h3>
                <p style={styles.cardValue}>{members.length}</p>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Attendance Rate</h3>
                <p style={{ ...styles.cardValue, color: "#10b981" }}>85%</p>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Contributions</h3>
                <p style={{ ...styles.cardValue, color: "#3b82f6" }}>
                  ₦450,000
                </p>
              </div>
            </div>
          </>
        )}

        {/* MEMBERS */}
        {activeView === "Members" && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Registered Members</h2>

            {loading ? (
              <p>Loading members...</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Phone</th>
                      <th style={styles.th}>Part</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Parish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m._id}>
                        <td style={styles.td}>{m.name}</td>
                        <td style={styles.td}>{m.phoneNumber}</td>
                        <td style={styles.td}>{m.partYouSing}</td>
                        <td style={styles.td}>{m.email}</td>
                        <td style={styles.td}>{m.parish}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

/* =========================
   STYLES
========================= */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  mobileTopBar: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    zIndex: 1001,
  },
  menuButton: {
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    color: "#fff",
  },
  sidebar: {
    width: 240,
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    padding: "1.5rem 1rem",
    transition: "transform 0.3s",
  },
  logoWrapper: { marginBottom: "2rem" },
  logo: { color: "#60a5fa", fontWeight: 700 },
  menu: { listStyle: "none", padding: 0 },
  menuItem: {
    padding: "0.75rem 1rem",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 4,
  },
  active: { backgroundColor: "#1e293b", color: "#60a5fa" },
  main: { flex: 1, padding: "2rem" },
  header: { marginBottom: "2rem" },
  title: { fontSize: "1.5rem", fontWeight: 700 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    padding: "1.25rem",
    borderRadius: 12,
  },
  cardTitle: { fontSize: "0.75rem", color: "#64748b" },
  cardValue: { fontSize: "1.5rem", fontWeight: 700 },
  section: {
    background: "#fff",
    padding: "1.25rem",
    borderRadius: 12,
  },
  sectionTitle: { fontSize: "1.1rem", marginBottom: "1rem" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "0.75rem",
    background: "#f1f5f9",
    fontSize: "0.75rem",
  },
  td: {
    padding: "0.75rem",
    borderBottom: "1px solid #e2e8f0",
  },
};

export default MemberDashboard;
