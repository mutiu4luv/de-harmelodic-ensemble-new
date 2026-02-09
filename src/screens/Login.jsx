import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpeg";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/registrations/login`, form);

      const { user, token } = res.data;

      // ✅ STORE TOKEN & USER
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ SET AXIOS DEFAULT AUTH HEADER
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setSnackbar({
        open: true,
        severity: "success",
        message: "Login successful 🎉",
      });

      // 🔀 ROLE-BASED NAVIGATION
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/admin/member");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" fontWeight={800}>
            De-Hamelodic Chorale
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Login to your account
          </Typography>

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={handleChange("username")}
            error={!!errors.username}
            helperText={errors.username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange("password")}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Not registered?{" "}
            <Link to="/signup" underline="hover">
              Click here to sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
