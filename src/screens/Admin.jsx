import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";

/* =========================
   MEMBERS TABLE
========================= */
const MembersTable = ({ members, fetchMembers, updateRole }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/registrations/${deleteId}`);
      enqueueSnackbar("Member deleted successfully", { variant: "success" });
      fetchMembers();
    } catch {
      enqueueSnackbar("Failed to delete member", { variant: "error" });
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ mt: 2, boxShadow: 3, overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#0f172a" }}>
            <TableRow>
              {[
                "Name",
                "Phone",
                "Part",
                "Email",
                "Address",
                "Role",
                "Action",
              ].map((head) => (
                <TableCell key={head} sx={{ color: "#fff", fontWeight: 700 }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m._id} hover>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.phoneNumber}</TableCell>
                <TableCell>{m.partYouSing}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.whereYouLive}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={m.role || "member"}
                    onChange={(e) => updateRole(m._id, e.target.value)}
                  >
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteId(m._id);
                      setOpenDialog(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this member?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/* =========================
   DASHBOARD CONTENT
========================= */
const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [attendance, setAttendance] = useState({});
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(dayjs());
  const [myAttendance, setMyAttendance] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);

  const [contribution, setContribution] = useState({
    memberId: "",
    amount: "",
    purpose: "",
  });
  // update role function
  const updateRole = async (userId, role) => {
    try {
      await axios.patch(`${API_BASE}/api/registrations/${userId}/role`, {
        role,
      });

      enqueueSnackbar("Role updated successfully", {
        variant: "success",
      });

      fetchMembers(); // refresh table
    } catch (err) {
      enqueueSnackbar("Failed to update role", {
        variant: "error",
      });
    }
  };

  /* RESPONSIVE */
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

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/registrations`);
      setMembers(res.data);
    } catch {
      enqueueSnackbar("Failed to fetch members", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    enqueueSnackbar("Logged out successfully", { variant: "success" });
    navigate("/login", { replace: true });
  };
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const memberId = user?.id;
        if (!memberId) return;

        const res = await axios.get(`${API_BASE}/api/admin/my/${memberId}`);

        setMyAttendance(res.data.attendance || []);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        enqueueSnackbar("Failed to fetch attendance", { variant: "error" });
      }
    };

    fetchAttendance();
  }, [user]);
  useEffect(() => {
    if (!myAttendance.length) {
      setMonthlySummary([]);
      return;
    }

    const summaryMap = {};

    myAttendance.forEach((record) => {
      const date = new Date(record.date);

      const monthKey = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }); // e.g. "February 2026"

      if (!summaryMap[monthKey]) {
        summaryMap[monthKey] = {
          month: monthKey,
          total: 0,
          present: 0,
        };
      }

      summaryMap[monthKey].total += 1;
      if (record.present) {
        summaryMap[monthKey].present += 1;
      }
    });

    const summaryArray = Object.values(summaryMap).map((m) => ({
      ...m,
      rate: Math.round((m.present / m.total) * 100),
    }));

    setMonthlySummary(summaryArray);
  }, [myAttendance]);

  const overallAttendanceRate = (() => {
    if (!myAttendance.length) return "—";

    const presentDays = myAttendance.filter((a) => a.present).length;
    return `${Math.round((presentDays / myAttendance.length) * 100)}%`;
  })();

  return (
    <div style={styles.container}>
      {/* MOBILE NAVBAR */}
      {isMobile && (
        <div style={styles.mobileTopBar}>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={styles.menuButton}
          >
            ☰
          </button>
          <span style={styles.welcome}>
            Welcome, {user.username || "Admin"}
          </span>
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
        <h2 style={styles.logo}>Harmy Admin</h2>

        <ul style={styles.menu}>
          {[
            "Dashboard",
            "Members",
            "Take Attendance", // ADMIN ONLY
            "My Attendance", // MEMBER VIEW
            "Contributions",
          ].map((item) => (
            <li
              key={item}
              onClick={() => {
                setActiveView(item);
                if (isMobile) setSidebarOpen(false);
              }}
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

      {/* MAIN */}
      <main style={{ ...styles.main, paddingTop: isMobile ? 80 : 32 }}>
        {activeView === "Dashboard" && (
          <>
            <h1 style={styles.title}>Dashboard Overview</h1>

            <div style={styles.cards}>
              <div style={{ ...styles.card, ...styles.cardPrimary }}>
                <p style={styles.cardTitle}>Total Members</p>
                <h2 style={styles.cardValue}>{members.length}</h2>
              </div>

              <div style={{ ...styles.card, ...styles.cardSuccess }}>
                <p style={styles.cardTitle}>Attendance Rate</p>
                <h2 style={styles.cardValue}>{overallAttendanceRate}</h2>
              </div>

              <div style={{ ...styles.card, ...styles.cardAccent }}>
                <p style={styles.cardTitle}>Total Attendance Records</p>
                <h2 style={styles.cardValue}>{myAttendance.length}</h2>
              </div>
            </div>

            {/* MONTHLY SUMMARY */}
            <div style={styles.monthlySummaryWrapper}>
              <h2 style={styles.monthlySummaryTitle}>
                Monthly Attendance Summary
              </h2>
              {monthlySummary.length === 0 ? (
                <p style={styles.noData}>No attendance data yet</p>
              ) : (
                monthlySummary.map((m) => (
                  <div key={m.month} style={styles.monthSummaryCard}>
                    <strong style={styles.monthSummaryMonth}>{m.month}</strong>
                    <span style={styles.monthSummaryStats}>
                      <span style={styles.present}>Present: {m.present}</span>
                      <span style={styles.total}>Total: {m.total}</span>
                      <span style={styles.rate}>Rate: {m.rate}%</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeView === "Members" && (
          <section style={styles.section}>
            <h2>Registered Members</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <MembersTable
                members={members}
                fetchMembers={fetchMembers}
                updateRole={updateRole}
              />
            )}
          </section>
        )}
        {activeView === "Take Attendance" && (
          <Card sx={{ maxWidth: 600, mx: "auto" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Take Attendance
              </Typography>

              {/* DATE PICKER */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Attendance Date"
                  value={attendanceDate}
                  onChange={(newValue) => setAttendanceDate(newValue)}
                  disableFuture
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 },
                    },
                  }}
                />
              </LocalizationProvider>

              {/* MEMBERS LIST */}
              {members.map((m) => (
                <Box
                  key={m._id}
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Checkbox
                    checked={!!attendance[m._id]}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [m._id]: e.target.checked,
                      }))
                    }
                  />
                  <Typography>{m.name}</Typography>
                </Box>
              ))}

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loadingAttendance}
                onClick={async () => {
                  try {
                    setLoadingAttendance(true);

                    const records = members.map((m) => ({
                      memberId: m._id,
                      present: !!attendance[m._id],
                    }));

                    await axios.post(`${API_BASE}/api/admin/attendance`, {
                      date: attendanceDate.format("YYYY-MM-DD"),
                      records,
                    });

                    enqueueSnackbar("Attendance saved successfully", {
                      variant: "success",
                    });

                    setAttendance({});
                  } catch (err) {
                    console.error(err);
                    enqueueSnackbar("Failed to save attendance", {
                      variant: "error",
                    });
                  } finally {
                    setLoadingAttendance(false);
                  }
                }}
              >
                {loadingAttendance ? "Saving..." : "Save Attendance"}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeView === "My Attendance" && (
          <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                My Rehearsal Attendance
              </Typography>

              {myAttendance.length === 0 ? (
                <Typography>No attendance records yet.</Typography>
              ) : (
                myAttendance.map((a) => {
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

        {activeView === "Contributions" && (
          <Card sx={{ maxWidth: 500, mx: "auto" }}>
            <CardContent>
              <Typography variant="h6">Record Contribution</Typography>
              <TextField select fullWidth sx={{ mt: 2 }}>
                {members.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Amount" fullWidth sx={{ mt: 2 }} />
              <TextField label="Purpose" fullWidth sx={{ mt: 2 }} />
              <Button fullWidth variant="contained" sx={{ mt: 3 }}>
                Save Contribution
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

/* =========================
   STYLES
========================= */
const styles = {
  section: {
    background: "#fff",
    padding: "1rem",
    borderRadius: 8,
  },
  container: { display: "flex", minHeight: "100vh", background: "#f8fafc" },
  mobileTopBar: {
    position: "fixed",
    top: 0,
    height: 64,
    width: "100%",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    zIndex: 1000,
    justifyContent: "space-between",
  },
  welcome: { color: "#fff", fontWeight: 600 },
  menuButton: {
    fontSize: "1.5rem",
    background: "none",
    color: "#fff",
    border: "none",
  },
  sidebar: {
    width: 260,
    background: "#0f172a",
    color: "#fff",
    padding: "1.5rem",
    transition: "transform .3s",
    zIndex: 1200,
  },
  logo: { color: "#60a5fa", marginBottom: "2rem" },
  menu: { listStyle: "none", padding: 0 },
  menuItem: {
    padding: ".75rem",
    cursor: "pointer",
    borderRadius: 6,
    marginBottom: 4,
  },
  active: { background: "#1e293b" },
  logout: {
    marginTop: "2rem",
    padding: ".75rem",
    background: "#7f1d1d",
    borderRadius: 6,
    cursor: "pointer",
  },
  main: { flex: 1, padding: "2rem" },
  title: { marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 700 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    padding: "1rem",
    borderRadius: 8,
    textAlign: "center",
  },
  section: {
    background: "#fff",
    padding: "1rem",
    borderRadius: 8,
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
  total: { color: "#8b5cf6", fontWeight: 500 },
  rate: { color: "#3b82f6", fontWeight: 500 },
  noData: { color: "#c7c9d9", fontStyle: "italic" },
};

export default function AdminDashboard() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AdminDashboardContent />
    </SnackbarProvider>
  );
}
