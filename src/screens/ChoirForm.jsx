import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import bgImage from "../assets/background.jpeg";
import logo from "../assets/logo.jpeg";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";

const initialState = {
  name: "",
  placeOfResidenceInOwerri: "",
  partBelongInChoir: "",
  contactAddress: "",
  phoneNumber: "",
  emailAddress: "",
};

export default function ChoirForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const fullTitle = "De-Harmelodic Ensemble Chorale";

  useEffect(() => {
    let index = 0;
    const typer = setInterval(() => {
      index += 1;
      setTypedTitle(fullTitle.slice(0, index));

      if (index >= fullTitle.length) {
        clearInterval(typer);
        setTypingDone(true);
      }
    }, 70);

    return () => clearInterval(typer);
  }, []);

  const handleChange = (field) => (event) => {
    const value =
      field === "phoneNumber"
        ? event.target.value.replace(/\D/g, "")
        : event.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.placeOfResidenceInOwerri.trim()) {
      nextErrors.placeOfResidenceInOwerri = "Place of residence is required";
    }
    if (!form.partBelongInChoir.trim()) {
      nextErrors.partBelongInChoir = "Choir part is required";
    }
    if (!form.contactAddress.trim())
      nextErrors.contactAddress = "Contact address is required";
    if (!form.phoneNumber.trim())
      nextErrors.phoneNumber = "Phone number is required";
    if (form.phoneNumber.trim().length < 10) {
      nextErrors.phoneNumber = "Phone number must be at least 10 digits";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.emailAddress)) {
      nextErrors.emailAddress = "Enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/forms`, form);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Form submitted successfully",
      });
      setForm(initialState);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: error?.response?.data?.error || "Failed to submit form",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 760,
          borderRadius: 4,
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
          background: "#000",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box
          sx={{
            px: { xs: 3, sm: 4 },
            py: 3,
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="De-Harmelodic Ensemble Chorale logo"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            />
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 2,
                opacity: 0.85,
                whiteSpace: { xs: "normal", sm: "nowrap" },
                fontSize: { xs: "0.72rem", sm: "0.75rem" },
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: 0.35,
                flexWrap: "wrap",
                animation: typingDone ? "blinkText 4s infinite" : "none",
                "@keyframes blinkText": {
                  "0%, 74.999%": { opacity: 1 },
                  "75%, 100%": { opacity: 0 },
                },
              }}
            >
              <Box component="span">{typedTitle}</Box>
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
            Join the Chorale By Filling The Form Below
          </Typography>
          <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.82)" }}>
            Are you a lover of music? Find your voice, share your passion, and
            create beautiful harmonies with us, join our singing group today
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 }, background: "#000" }}>
          <Grid container spacing={2.25}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                required
                value={form.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                sx={darkFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Place of Residence in Owerri"
                fullWidth
                required
                value={form.placeOfResidenceInOwerri}
                onChange={handleChange("placeOfResidenceInOwerri")}
                error={!!errors.placeOfResidenceInOwerri}
                helperText={errors.placeOfResidenceInOwerri}
                sx={darkFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Part belong in a choir"
                fullWidth
                required
                value={form.partBelongInChoir}
                onChange={handleChange("partBelongInChoir")}
                error={!!errors.partBelongInChoir}
                helperText={errors.partBelongInChoir}
                sx={darkFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contact address"
                fullWidth
                required
                value={form.contactAddress}
                onChange={handleChange("contactAddress")}
                error={!!errors.contactAddress}
                helperText={errors.contactAddress}
                sx={darkFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone number"
                fullWidth
                required
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                sx={darkFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                required
                value={form.emailAddress}
                onChange={handleChange("emailAddress")}
                error={!!errors.emailAddress}
                helperText={errors.emailAddress}
                sx={darkFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 800,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1f2937, #3b82f6)",
                }}
              >
                {loading ? "Submitting..." : "Submit Form"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const darkFieldSx = {
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.8)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.04)",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.24)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#60a5fa",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.7)",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
};
