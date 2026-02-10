import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://harme-backend.onrender.com";
const token = localStorage.getItem("token");
export default function ProfileUpdate() {
  const raw = JSON.parse(localStorage.getItem("user"));

  // normalize user object
  const storedUser = raw?.user || raw;

  // normalize ID
  const userId = storedUser?.id || storedUser?._id;

  if (!userId) {
    console.error(" User ID missing", storedUser);
  }

  const [form, setForm] = useState({
    name: storedUser?.name || "",
    username: storedUser?.username || "",
    parish: storedUser?.parish || "",
    partYouSing: storedUser?.partYouSing || "",
    phoneNumber: storedUser?.phoneNumber || "",
    whereYouLive: storedUser?.whereYouLive || "",
    email: storedUser?.email || "",
    profileImage: storedUser?.profileImage || "",
  });

  const [preview, setPreview] = useState(form.profileImage);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // 🔁 Handle inputs
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // 🖼️ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      setForm((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 🚀 Update Profile
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const res = await axios.put(
        `${API_BASE}/api/registrations/update-profile/${userId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSnackbar({
        open: true,
        severity: "success",
        message: "Profile updated successfully ",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 600, width: "100%", mt: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Update Profile
          </Typography>

          {/* Avatar */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              src={preview || "/avatar.png"}
              sx={{ width: 100, height: 100 }}
            />
          </Box>

          <Button variant="outlined" component="label" fullWidth sx={{ mb: 3 }}>
            Change Profile Picture
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={form.name}
                onChange={handleChange("name")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                value={form.username}
                onChange={handleChange("username")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={form.email}
                onChange={handleChange("email")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Parish"
                fullWidth
                value={form.parish}
                onChange={handleChange("parish")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Part You Sing"
                fullWidth
                value={form.partYouSing}
                onChange={handleChange("partYouSing")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Where You Live"
                fullWidth
                value={form.whereYouLive}
                onChange={handleChange("whereYouLive")}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating…" : "Update Profile"}
              </Button>
            </Grid>
          </Grid>
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
