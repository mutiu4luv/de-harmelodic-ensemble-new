import { Box, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const memberId = user?.id;

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [totalContribution, setTotalContribution] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const [attendancePage, setAttendancePage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [data, setData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [contributionsPage, setContributionsPage] = useState(1);
  const CONTRIBUTIONS_PER_PAGE = 7;

  const filteredContributions =
    !loading && data && Array.isArray(data.contributions)
      ? data.contributions.filter((c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const contributionsTotalPages = Math.ceil(
    filteredContributions.length / CONTRIBUTIONS_PER_PAGE
  );

  const paginatedContributions = filteredContributions.slice(
    (contributionsPage - 1) * CONTRIBUTIONS_PER_PAGE,
    contributionsPage * CONTRIBUTIONS_PER_PAGE
  );

  useEffect(() => {
    setContributionsPage(1);
  }, [searchTerm]);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";

  useEffect(() => {
    if (!memberId) {
      console.warn("No user found in localStorage!");
      return;
    }

    if (activeView === "My Contributions" && memberId) {
      setLoading(true);

      axios
        .get(`${API_BASE}/api/admin/contributions/my-payments/${memberId}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(
            "Error fetching contributions:",
            err.response?.data || err.message
          );
          setLoading(false);
        });
    }
  }, [activeView, memberId]);

  const attendanceRate = (() => {
    if (!attendance.length) return "—";

    const presentCount = attendance.filter((a) => a.present).length;

    return `${Math.round((presentCount / attendance.length) * 100)}%`;
  })();

  const attendanceWithMonth = attendance.map((a) => {
    const d = new Date(a.date);
    return {
      ...a,
      monthKey: d.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  });

  const filteredAttendance =
    selectedMonth === "all"
      ? attendanceWithMonth
      : attendanceWithMonth.filter((a) => a.monthKey === selectedMonth);

  const totalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE);

  const paginatedAttendance = filteredAttendance.slice(
    (attendancePage - 1) * ITEMS_PER_PAGE,
    attendancePage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setAttendancePage(1);
  }, [selectedMonth]);

  const monthlyAttendanceSummary = (() => {
    if (!attendance.length) return {};

    return attendance.reduce((acc, record) => {
      const monthKey = new Date(record.date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          total: 0,
          present: 0,
          absent: 0,
        };
      }

      acc[monthKey].total += 1;

      if (record.present) {
        acc[monthKey].present += 1;
      } else {
        acc[monthKey].absent += 1;
      }

      return acc;
    }, {});
  })();
  const currentMonthAttendance = (() => {
    const currentMonthKey = new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    const monthData = monthlyAttendanceSummary[currentMonthKey];
    if (!monthData) return "—";

    return `${monthData.present}/${monthData.total}`;
  })();

  // useEffect(() => {
  //   const fetchContributions = async () => {
  //     try {
  //       const memberId = user?.id;
  //       if (!memberId) return;

  //       const res = await axios.get(
  //         `${API_BASE}/api/admin/contributions/member/${memberId}`
  //       );

  //       const total = res.data.contributions.reduce(
  //         (sum, c) => sum + c.amount,
  //         0
  //       );

  //       setTotalContribution(total);
  //     } catch (err) {
  //       console.error("Failed to fetch contributions:", err);
  //       enqueueSnackbar("Failed to fetch contributions", {
  //         variant: "error",
  //       });
  //     }
  //   };

  //   fetchContributions();
  // }, [user]);

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
          {["Dashboard", "Members", "Attendance", "My Contributions"].map(
            (item) => (
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
            )
          )}

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
          <>
            <div style={styles.cards}>
              <div style={{ ...styles.card, ...styles.cardPrimary }}>
                <p style={styles.cardTitle}>Total Members</p>
                <h2 style={styles.cardValue}>{members.length}</h2>
              </div>

              <div style={{ ...styles.card, ...styles.cardSuccess }}>
                <p style={styles.cardTitle}>Attendance Rate</p>
                <h2 style={styles.cardValue}>{attendanceRate}</h2>
              </div>

              <div style={{ ...styles.card, ...styles.cardAccent }}>
                <p style={styles.cardTitle}>This Month Attendance</p>
                <h2 style={styles.cardValue}>{currentMonthAttendance}</h2>
              </div>

              <div style={{ ...styles.card, ...styles.cardInfo }}>
                <p style={styles.cardTitle}>Total Contributions</p>
                <h2 style={styles.cardValue}>
                  ₦{totalContribution.toLocaleString()}
                </h2>
              </div>
            </div>

            {/* MONTHLY SUMMARY */}
            <div style={styles.monthlySummaryWrapper}>
              <h3 style={styles.monthlySummaryTitle}>
                Monthly Attendance Summary
              </h3>
              {Object.entries(monthlyAttendanceSummary).map(([month, data]) => (
                <div key={month} style={styles.monthSummaryCard}>
                  <strong style={styles.monthSummaryMonth}>{month}</strong>
                  <span style={styles.monthSummaryStats}>
                    <span style={styles.present}>Present: {data.present}</span>
                    <span style={styles.absent}>Absent: {data.absent}</span>
                    <span style={styles.total}>Total: {data.total}</span>
                  </span>
                </div>
              ))}
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

        {activeView === "Attendance" && (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h1 style={styles.title}>My Rehearsals Attendance</h1>

            {/* FILTER */}
            <div style={{ marginBottom: 16 }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: "0.6rem",
                  borderRadius: 8,
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#fff",
                }}
              >
                <option value="all">All Months</option>
                {Object.keys(monthlyAttendanceSummary).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {filteredAttendance.length === 0 ? (
              <div style={styles.section}>
                <p style={styles.noData}>No attendance records yet</p>
              </div>
            ) : (
              <div style={styles.monthlySummaryWrapper}>
                {/* MINI PROGRESS BAR */}
                {selectedMonth !== "all" &&
                  (() => {
                    const m = monthlyAttendanceSummary[selectedMonth];
                    if (!m) return null;

                    const rate = Math.round((m.present / m.total) * 100);

                    return (
                      <div style={{ marginBottom: 20 }}>
                        <div
                          style={{
                            height: 10,
                            background: "#1e293b",
                            borderRadius: 6,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${rate}%`,
                              background: "#10b981",
                              transition: "width .3s",
                            }}
                          />
                        </div>
                        <small style={{ color: "#c7c9d9" }}>
                          Attendance rate: {rate}%
                        </small>
                      </div>
                    );
                  })()}

                {/* RECORDS */}
                {paginatedAttendance.map((a) => {
                  const formattedDate = new Date(a.date).toLocaleDateString(
                    "en-GB"
                  );

                  return (
                    <div
                      key={a._id}
                      style={{
                        ...styles.monthSummaryCard,
                        background: a.present
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(239,68,68,0.08)",
                      }}
                    >
                      <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                        {formattedDate}
                      </span>

                      <span
                        style={{
                          fontWeight: 600,
                          color: a.present ? "#10b981" : "#ef4444",
                        }}
                      >
                        {a.present ? "✔ Present" : "✖ Absent"}
                      </span>
                    </div>
                  );
                })}

                {/* PAGINATION */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  <button
                    disabled={attendancePage === 1}
                    onClick={() => setAttendancePage((p) => p - 1)}
                    style={paginationBtn(attendancePage === 1)}
                  >
                    Prev
                  </button>

                  <span style={{ color: "#c7c9d9" }}>
                    Page {attendancePage} of {totalPages}
                  </span>

                  <button
                    disabled={attendancePage === totalPages}
                    onClick={() => setAttendancePage((p) => p + 1)}
                    style={paginationBtn(attendancePage === totalPages)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeView === "My Contributions" && (
          <div style={styles.contributionsSection}>
            {/* <h2 style={styles.sectionTitle}>My Contributions</h2> */}

            {/* Search */}
            <div style={{ marginBottom: 18 }}>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Loading state */}
            {loading && (
              <p style={styles.loadingText}>Loading your contributions...</p>
            )}

            {/* Display total owed */}
            {!loading && data && (
              <div style={styles.totalOwed}>
                <strong>Total Owed: </strong>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>
                  ₦{data.totalOwed.toLocaleString()}
                </span>
              </div>
            )}

            {/* Contributions table */}
            {!loading && filteredContributions.length > 0 ? (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Target Amount</th>
                      <th style={styles.th}>Paid Amount</th>
                      <th style={styles.th}>Remaining</th>
                      <th style={styles.th}>Paid On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContributions.map((c) => (
                      <tr key={c.contributionId} style={styles.tr}>
                        <td style={styles.td}>{c.title}</td>
                        <td style={{ ...styles.td, color: "#3b82f6" }}>
                          ₦{c.targetAmount.toLocaleString()}
                        </td>
                        <td style={{ ...styles.td, color: "#10b981" }}>
                          ₦{c.paidAmount.toLocaleString()}
                        </td>
                        <td style={{ ...styles.td, color: "#ef4444" }}>
                          ₦{c.notPaid.toLocaleString()}
                        </td>
                        <td style={styles.td}>
                          {c.paidOn
                            ? new Date(c.paidOn).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div style={styles.paginationWrapper}>
                  <button
                    disabled={contributionsPage === 1}
                    onClick={() => setContributionsPage((p) => p - 1)}
                    style={paginationBtn(contributionsPage === 1)}
                  >
                    Prev
                  </button>
                  <span style={{ color: "#c7c9d9" }}>
                    Page {contributionsPage} of {contributionsTotalPages}
                  </span>
                  <button
                    disabled={contributionsPage === contributionsTotalPages}
                    onClick={() => setContributionsPage((p) => p + 1)}
                    style={paginationBtn(
                      contributionsPage === contributionsTotalPages
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              !loading && (
                <p style={styles.noData}>You have no contributions yet.</p>
              )
            )}
          </div>
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
  contributionsSection: {
    padding: 24,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(35,41,70,0.08)",
    marginBottom: 32,
    maxWidth: 900,
    margin: "0 auto",
  },
  searchInput: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: 8,
    border: "1px solid #334155",
    fontSize: "1rem",
    background: "#f1f5f9",
    color: "#232946",
    outline: "none",
  },
  loadingText: {
    color: "#64748b",
    fontStyle: "italic",
    marginBottom: 16,
  },
  totalOwed: {
    marginBottom: 20,
    fontSize: "1.1rem",
    background: "#f9fafb",
    padding: "10px 16px",
    borderRadius: 8,
    fontWeight: 600,
    display: "inline-block",
  },
  tableWrapper: {
    overflowX: "auto",
    marginBottom: 24,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 600,
    background: "#f8fafc",
    borderRadius: 12,
    boxShadow: "0 1px 4px rgba(35,41,70,0.04)",
  },
  th: {
    padding: "0.75rem",
    background: "#232946",
    color: "#f4d160",
    fontSize: "0.85rem",
    textAlign: "left",
    borderBottom: "2px solid #3b82f6",
    fontWeight: 700,
  },
  td: {
    padding: "0.75rem",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.98rem",
    background: "#fff",
  },
  tr: {
    transition: "background 0.15s",
    ":hover": {
      background: "#f1f5f9",
    },
  },
  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  noData: {
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 24,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    background: "linear-gradient(135deg, #232946 60%, #121629 100%)",
    color: "#fff",
    padding: "1.75rem 1.25rem",
    borderRadius: 18,
    boxShadow: "0 4px 24px rgba(35,41,70,0.10)",
    transition: "transform 0.15s, box-shadow 0.15s",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  cardPrimary: {
    background: "linear-gradient(135deg, #232946 60%, #3e497a 100%)",
    borderLeft: "6px solid #f4d160",
  },
  cardSuccess: {
    background: "linear-gradient(135deg, #232946 60%, #10b981 100%)",
    borderLeft: "6px solid #10b981",
  },
  cardAccent: {
    background: "linear-gradient(135deg, #232946 60%, #8b5cf6 100%)",
    borderLeft: "6px solid #8b5cf6",
  },
  cardInfo: {
    background: "linear-gradient(135deg, #232946 60%, #3b82f6 100%)",
    borderLeft: "6px solid #3b82f6",
  },
  cardTitle: {
    fontSize: "0.85rem",
    color: "#c7c9d9",
    marginBottom: 8,
    fontWeight: 500,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: "2.1rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: 1,
    margin: 0,
  },
  monthlySummaryWrapper: {
    marginTop: 36,
    background: "#232946",
    borderRadius: 16,
    padding: "1.5rem 1rem",
    boxShadow: "0 2px 12px rgba(35,41,70,0.08)",
  },
  monthlySummaryTitle: {
    marginBottom: 18,
    color: "#f4d160",
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: 0.5,
  },
  monthSummaryCard: {
    background: "rgba(255,255,255,0.04)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(35,41,70,0.04)",
  },
  monthSummaryMonth: {
    color: "#f4d160",
    fontWeight: 600,
    fontSize: "1rem",
  },
  monthSummaryStats: {
    display: "flex",
    gap: 18,
    fontSize: "0.98rem",
  },
  present: { color: "#10b981", fontWeight: 500 },
  absent: { color: "#ef4444", fontWeight: 500 },
  total: { color: "#8b5cf6", fontWeight: 500 },
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

  // cards: {
  //   display: "grid",
  //   gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  //   gap: "1rem",
  // },

  // card: {
  //   background: "#fff",
  //   padding: "1.25rem",
  //   borderRadius: 12,
  // },

  // cardTitle: { fontSize: "0.75rem", color: "#64748b" },
  // cardValue: { fontSize: "1.5rem", fontWeight: 700 },

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

const paginationBtn = (disabled) => ({
  padding: "0.5rem 1rem",
  borderRadius: 6,
  border: "none",
  cursor: disabled ? "not-allowed" : "pointer",
  background: disabled ? "#334155" : "#3b82f6",
  color: "#fff",
  fontWeight: 600,
});

export default MemberDashboard;
