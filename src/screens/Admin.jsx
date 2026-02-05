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
  const today = new Date().toISOString().split("T")[0];

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
          {["Dashboard", "Members", "Attendance", "Contributions"].map(
            (item) => (
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
            )
          )}

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
              <div style={styles.card}>
                <p>Total Members</p>
                <h2>{members.length}</h2>
              </div>
              <div style={styles.card}>
                <p>Attendance Rate</p>
                <h2>—</h2>
              </div>
              <div style={styles.card}>
                <p>Total Contributions</p>
                <h2>—</h2>
              </div>
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

        {activeView === "Attendance" && (
          <Card sx={{ maxWidth: 500, mx: "auto" }}>
            <CardContent>
              <Typography variant="h6">Attendance — {today}</Typography>
              {members.map((m) => (
                <Box key={m._id} sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox />
                  <Typography>{m.name}</Typography>
                </Box>
              ))}
              <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                Save Attendance
              </Button>
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
};

export default function AdminDashboard() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AdminDashboardContent />
    </SnackbarProvider>
  );
}
