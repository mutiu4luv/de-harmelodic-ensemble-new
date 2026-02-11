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
    identifier: "",
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

    if (!form.identifier.trim()) e.identifier = "Username or Email is required";

    if (!form.password) e.password = "Password is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/registrations/login`, {
        identifier: form.identifier.trim(),
        password: form.password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setSnackbar({
        open: true,
        severity: "success",
        message: "Login successful 🎉",
      });

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/admin/member");
        }
      }, 800);
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;

      if (backendErrors) {
        const formattedErrors = {};
        backendErrors.forEach((error) => {
          formattedErrors[error.path] = error.msg;
        });
        setErrors(formattedErrors);
      }

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
            De-Harmelodic Chorale
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ mb: 3 }}>
            Login to your account
          </Typography>

          <TextField
            label="Username or Email"
            fullWidth
            margin="normal"
            value={form.identifier}
            onChange={handleChange("identifier")}
            error={!!errors.identifier}
            helperText={errors.identifier}
            placeholder="Enter your username or email"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
            placeholder="Enter your password"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
            Not registered? <Link to="/signup">Click here to sign up</Link>
          </Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
