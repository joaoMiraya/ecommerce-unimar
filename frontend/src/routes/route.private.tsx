import type { JSX } from "react";
import { Navigate } from "react-router";

type Props = {
  children: JSX.Element;
};

export const PrivateRoute = ({ children }: Props) => {
    const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};