import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Person,
  Church,
  Phone,
  Home,
  Email,
  MusicNote,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpeg";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";

const steps = ["Personal Info", "Contact & Security"];

const initialState = {
  name: "",
  username: "",
  parish: "",
  partYouSing: "",
  phoneNumber: "",
  whereYouLive: "",
  email: "",
  password: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "phoneNumber") value = value.replace(/\D/g, "");
    setForm({ ...form, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStepOne = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (form.username.length < 3)
      e.username = "Username must be at least 3 characters";
    if (!form.parish.trim()) e.parish = "Parish is required";
    if (!form.partYouSing.trim()) e.partYouSing = "This field is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStepTwo = () => {
    const e = {};
    if (form.phoneNumber.length < 10)
      e.phoneNumber = "Enter a valid phone number";
    if (!form.whereYouLive.trim())
      e.whereYouLive = "Where you live is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStepTwo()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/registrations`, form);

      const user = res.data.user;

      // Optional: persist user
      localStorage.setItem("user", JSON.stringify(user));

      setSnackbar({
        open: true,
        severity: "success",
        message: "Registration successful 🎉",
      });

      setForm(initialState);
      setStep(0);

      // Safe navigation
      navigate(user.role === "admin" ? "/admin" : "/admin/member");
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Registration failed",
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
      <Card sx={{ maxWidth: 600, width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" fontWeight={800}>
            De-Haemelodic Chorale
          </Typography>

          <Stepper activeStep={step} alternativeLabel sx={{ my: 3 }}>
            {steps.map((s) => (
              <Step key={s}>
                <StepLabel>{s}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {step === 0 && (
            <Grid container spacing={2}>
              {["name", "username", "parish", "partYouSing"].map((field, i) => (
                <Grid item xs={12} key={i}>
                  <TextField
                    required
                    label={field.replace(/([A-Z])/g, " $1")}
                    fullWidth
                    value={form[field]}
                    onChange={handleChange(field)}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                </Grid>
              ))}
              <Grid item xs={12} textAlign="right">
                <Button
                  variant="contained"
                  onClick={() => validateStepOne() && setStep(1)}
                >
                  Continue
                </Button>
              </Grid>
            </Grid>
          )}

          {step === 1 && (
            <Grid container spacing={2}>
              {["phoneNumber", "email", "whereYouLive"].map((field, i) => (
                <Grid item xs={12} key={i}>
                  <TextField
                    label={field.replace(/([A-Z])/g, " $1")}
                    fullWidth
                    value={form[field]}
                    onChange={handleChange(field)}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    required
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  required
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={form.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between">
                <Button onClick={() => setStep(0)}>Back</Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting…" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          )}

          <Typography align="center" sx={{ mt: 3 }}>
            Already registered? <Link to="/login">Login</Link>
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
