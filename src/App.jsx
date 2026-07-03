import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./component/landingPage/LandingPage";
import RegistrationForm from "./screens/Register";
import MemberDashboard from "./screens/MemberDashboard";
import AdminScreen from "./screens/Admin";
import Login from "./screens/Login";
import ChoirForm from "./screens/ChoirForm";

import ProtectedRoute from "./routes/ProtectedRoutes";
import RoleRoute from "./routes/RoleProtectedRoute";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const App = () => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) setMode(savedMode);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", next);
          return next;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#f4f4f4" : "#121212",
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/form" element={<ChoirForm />} />
            <Route path="/signup" element={<RegistrationForm />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* MEMBER */}
            <Route
              path="/admin/member"
              element={
                <ProtectedRoute>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute role="admin">
                    <AdminScreen />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
