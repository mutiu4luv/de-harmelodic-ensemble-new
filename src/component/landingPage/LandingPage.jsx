import React, { useContext } from "react";
import Header from "../Header";
import BusinessCard from "./BusinessCard";
import { Box, Container, Divider, Link, Typography } from "@mui/material";
import { ColorModeContext } from "../../App"; // Adjust path if needed

const LandingPage = () => {
  const colorMode = useContext(ColorModeContext);

  return (
    <div>
      <Header toggleColorMode={colorMode.toggleColorMode} />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Welcome to the De Harmelodic Ensemble Business Album
          </h1>
        </div>
      </main>
      <BusinessCard />
      <footer>
        <Box sx={{ bgcolor: "red", color: "white", py: 3 }}>
          <Container maxWidth="md">
            <Typography
              variant="body2"
              align="center"
              sx={{ fontWeight: 500, letterSpacing: 0.5 }}
            >
              &copy; {new Date().getFullYear()}{" "}
              <strong>De Harmelodic Ensemble</strong>. All rights reserved.
            </Typography>

            <Divider sx={{ my: 2, bgcolor: "white", opacity: 0.3 }} />

            <Typography
              variant="caption"
              align="center"
              display="block"
              sx={{ mt: 1 }}
            >
              Designed by <strong>Madu Chibueze Emmanuel (Mutiu)</strong>
              <br />
              📞{" "}
              <Link href="tel:07031911306" color="inherit" underline="hover">
                07031911306
              </Link>{" "}
              | ✉️{" "}
              <Link
                href="mailto:chidiemmamadu@gmail.com"
                color="inherit"
                underline="hover"
              >
                chidiemmamadu@gmail.com
              </Link>
            </Typography>
          </Container>
        </Box>
      </footer>
    </div>
  );
};

export default LandingPage;
