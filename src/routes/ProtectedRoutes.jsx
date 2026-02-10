import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/Auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
