import { Box, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);

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
  // get attendance for the logged in user
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // console.log("User from localStorage:", user);
        const memberId = user.id;
        if (!memberId) {
          console.warn("No memberId found, skipping fetch");
          return;
        }

        const res = await axios.get(`${API_BASE}/api/admin/my/${memberId}`);
        // console.log("Attendance fetched:", res.data.attendance);
        setAttendance(res.data.attendance || []);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        enqueueSnackbar("Failed to fetch attendance", { variant: "error" });
      }
    };

    fetchAttendance();
  }, [user]);

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
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.container}>
      {/* MOBILE HEADER */}
      {isMobile && (
        <div style={styles.mobileTopBar}>
          <button onClick={toggleSidebar} style={styles.menuButton}>
            {isSidebarOpen ? "✕" : "☰"}
          </button>

          <div style={styles.mobileHeaderText}>
            <h2 style={styles.logoSmall}>Harmy Member</h2>
            <span style={styles.welcome}>
              Welcome, {user.username || "Member"}
            </span>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          position: isMobile ? "fixed" : "relative",
        }}
      >
        <div style={styles.logoWrapper}>
          <h2 style={styles.logo}>Harmy Member</h2>
        </div>

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

          <li onClick={handleLogout} style={styles.logout}>
            Logout
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          ...styles.main,
          paddingTop: isMobile ? "5.5rem" : "2rem",
        }}
      >
        <header style={styles.header}>
          <h1 style={styles.title}>
            {activeView === "Dashboard" ? "Dashboard Overview" : activeView}
          </h1>
        </header>

        {/* DASHBOARD */}
        {activeView === "Dashboard" && (
          <div style={styles.cards}>
            <div style={styles.card}>
              <p style={styles.cardTitle}>Total Members</p>
              <h2 style={styles.cardValue}>{members.length}</h2>
            </div>
            <div style={styles.card}>
              <p style={styles.cardTitle}>Attendance Rate</p>
              <h2 style={{ ...styles.cardValue, color: "#10b981" }}>85%</h2>
            </div>
            <div style={styles.card}>
              <p style={styles.cardTitle}>Total Contributions</p>
              <h2 style={{ ...styles.cardValue, color: "#3b82f6" }}>
                ₦450,000
              </h2>
            </div>
          </div>
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

        {activeView === "Attendance" && (
          <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Rehearsals Attendance
              </Typography>

              {attendance.length === 0 ? (
                <Typography>No attendance records yet.</Typography>
              ) : (
                attendance.map((a) => {
                  // Format date to DD/MM/YYYY
                  const formattedDate = new Date(a.date).toLocaleDateString(
                    "en-GB"
                  );

                  return (
                    <Box
                      key={a._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>{formattedDate}</Typography>
                      <Typography>
                        {a.present ? "Present ✅" : "Absent ❌"}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* MOBILE OVERLAY */}
      {isMobile && isSidebarOpen && (
        <div onClick={toggleSidebar} style={styles.overlay} />
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
    background: "#f8fafc",
  },

  mobileTopBar: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: 64,
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    gap: "1rem",
    zIndex: 1100,
  },

  mobileHeaderText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },

  logoSmall: {
    color: "#60a5fa",
    fontSize: "1rem",
    margin: 0,
  },

  welcome: {
    color: "#e2e8f0",
    fontSize: "0.75rem",
  },

  menuButton: {
    fontSize: "1.6rem",
    background: "none",
    border: "none",
    color: "#fff",
  },

  sidebar: {
    width: 240,
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "1.5rem 1rem",
    transition: "transform 0.3s",
    zIndex: 1200,
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

  active: {
    background: "#1e293b",
    color: "#60a5fa",
  },

  logout: {
    marginTop: "2rem",
    padding: "0.75rem 1rem",
    background: "#7f1d1d",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    color: "#fff",
  },

  main: { flex: 1, padding: "2rem" },

  header: { marginBottom: "1.5rem" },

  title: { fontSize: "1.4rem", fontWeight: 700 },

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

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 600,
  },

  th: {
    padding: "0.75rem",
    background: "#f1f5f9",
    fontSize: "0.75rem",
    textAlign: "left",
  },

  td: {
    padding: "0.75rem",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.85rem",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
};

export default MemberDashboard;
