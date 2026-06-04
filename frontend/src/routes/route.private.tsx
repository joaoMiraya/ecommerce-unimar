import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "../store/hooks";

type Props = {
  children: JSX.Element;
};

export const PrivateRoute = ({ children }: Props) => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};