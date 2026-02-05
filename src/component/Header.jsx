import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  Box,
  GlobalStyles,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../App"; // adjust path as needed

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <>
      {/* Global style for smooth scrolling */}
      <GlobalStyles
        styles={{
          html: { scrollBehavior: "smooth" },
        }}
      />

      {/* Fixed Header */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "#333" : "red",
          color: "white",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            De Harmelodic Ensemble - Business Album
          </Typography>
          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Spacer to prevent content from being hidden behind header */}
      <Box sx={{ mt: 8 }} />
    </>
  );
};

export default Header;
