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
  Avatar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PhotoCamera,
  ChevronRight,
  ChevronLeft,
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
  profileImage: "",
};

const getRegistrationErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length) {
    return responseData.errors
      .map((validationError) => validationError?.msg)
      .filter(Boolean)
      .join(". ");
  }

  return (
    responseData?.error ||
    responseData?.message ||
    "Unable to register right now. Please try again."
  );
};

export default function RegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);
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

  // 📝 Handle Text Inputs
  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "phoneNumber") value = value.replace(/\D/g, "");
    setForm({ ...form, [field]: value });
    // Clear error for this specific field
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // 🖼️ Handle Image Upload & Strict Validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 4MB to prevent MongoDB/Server payload errors
    if (file.size > 4 * 1024 * 1024) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Image must be under 4MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((prev) => ({ ...prev, profileImage: reader.result }));
      setErrors((prev) => ({ ...prev, profileImage: "" })); // Clear image error
    };
    reader.readAsDataURL(file);
  };

  // 🛡️ Step 1 Validation (Strict Image Check)
  const validateStepOne = () => {
    const e = {};
    if (!form.profileImage) e.profileImage = "A profile picture is required";
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (form.username.length < 3) e.username = "Username must be 3+ chars";
    if (!form.parish.trim()) e.parish = "Parish is required";
    if (!form.partYouSing.trim()) e.partYouSing = "Vocal part is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // 🛡️ Step 2 Validation
  const validateStepTwo = () => {
    const e = {};
    if (form.phoneNumber.length < 10) e.phoneNumber = "Invalid phone number";
    if (!form.whereYouLive.trim()) e.whereYouLive = "Address is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
    if (form.password.length < 6) e.password = "Password must be 6+ characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // 🚀 Final Submission
  const handleSubmit = async () => {
    if (!validateStepTwo()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/registrations`, form);
      const user = res.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      setSnackbar({
        open: true,
        severity: "success",
        message: "Registration successful 🎉",
      });

      // Reset Form
      setForm(initialState);
      setPreview(null);

      // Redirect based on role
      setTimeout(() => {
        navigate(user.role === "admin" ? "/admin" : "/admin/member");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: getRegistrationErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 550,
          width: "100%",
          p: 1,
          borderRadius: 3,
          boxShadow: 24,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            fontWeight={900}
            color="primary"
            gutterBottom
          >
            CHORALE JOINING
          </Typography>

          <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {step === 0 ? (
            <Grid container spacing={2}>
              {/* Profile Image Section */}
              <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={preview}
                    sx={{
                      width: 110,
                      height: 110,
                      mx: "auto",
                      border: errors.profileImage
                        ? "4px solid #d32f2f"
                        : "3px solid #1976d2",
                      boxShadow: 3,
                    }}
                  />
                  <IconButton
                    color="primary"
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "white",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <PhotoCamera />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                </Box>
                {errors.profileImage && (
                  <Typography
                    variant="caption"
                    display="block"
                    color="error"
                    sx={{ mt: 1, fontWeight: "bold" }}
                  >
                    {errors.profileImage}
                  </Typography>
                )}
              </Grid>

              {/* Step 1 Fields */}
              {[
                { label: "Full Name", key: "name" },
                { label: "Username", key: "username" },
                { label: "Parish", key: "parish" },
                { label: "Part You Sing (S/A/T/B)", key: "partYouSing" },
              ].map((f) => (
                <Grid item xs={12} key={f.key}>
                  <TextField
                    fullWidth
                    label={f.label}
                    variant="outlined"
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                    error={!!errors[f.key]}
                    helperText={errors[f.key]}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ChevronRight />}
                  onClick={() => validateStepOne() && setStep(1)}
                  sx={{ py: 1.5, fontWeight: "bold" }}
                >
                  Next Step
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {/* Step 2 Fields */}
              {[
                { label: "Phone Number", key: "phoneNumber" },
                { label: "Email Address", key: "email" },
                { label: "Residential Address", key: "whereYouLive" },
              ].map((f) => (
                <Grid item xs={12} key={f.key}>
                  <TextField
                    fullWidth
                    label={f.label}
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                    error={!!errors[f.key]}
                    helperText={errors[f.key]}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Create Password"
                  type={showPassword ? "text" : "password"}
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

              <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ChevronLeft />}
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ fontWeight: "bold" }}
                >
                  {loading ? "Registering..." : "Submit Registration"}
                </Button>
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              Already a member?{" "}
              <Link
                to="/login"
                style={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  textDecoration: "none",
                }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
