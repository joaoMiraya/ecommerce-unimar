import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "../store/hooks";

type Props = {
  children: JSX.Element;
};

export const PrivateRoute = ({ children }: Props) => {
    const authState = useAppSelector((state) => state.auth);
    const isAuthenticated = authState.isAuthenticated;
    const isInitialized = authState.isInitialized;

  if (!isAuthenticated && isInitialized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};