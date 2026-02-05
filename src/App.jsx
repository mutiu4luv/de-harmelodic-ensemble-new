import React, { useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import LandingPage from "./component/landingPage/LandingPage";
import RegistrationForm from "./screens/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import MemberDashboard from "./screens/MemberDashboard";
import AdminScreen from "./screens/Admin";
import Login from "./screens/Login";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const App = () => {
  const [mode, setMode] = useState("light");

  // Load saved theme on first render
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode === "dark" || savedMode === "light") {
      setMode(savedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
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
          ...(mode === "light"
            ? { background: { default: "#f4f4f4" } }
            : { background: { default: "#121212" } }),
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
            <Route path="/signup" element={<RegistrationForm />} />
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="/admin/member" element={<MemberDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
