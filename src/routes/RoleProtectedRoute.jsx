import { Navigate } from "react-router-dom";
import { getUser } from "../utils/Auth";
import React from "react";

const RoleRoute = ({ role, children }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;
