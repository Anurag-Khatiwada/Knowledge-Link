import { Fragment } from "react";
import { useLocation, Navigate } from "react-router-dom";

const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation();

  // Redirect to /auth if the user is not authenticated and not on the /auth route
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  // Redirect instructors to /instructor if they are authenticated and trying to access /auth
  if (authenticated && user?.role === "instructor" && location.pathname.includes("/auth")) {
    return <Navigate to="/instructor" />;
  }

  // Redirect to /home if the user is authenticated and trying to access /auth
  if (authenticated && location.pathname.includes("/auth")) {
    return <Navigate to="/home" />;
  }

  // Allow access to the instructor dashboard if the user is an instructor
  if (authenticated && user?.role === "instructor" && location.pathname.includes("/instructor")) {
    return <Fragment>{element}</Fragment>;
  }

  // Default behavior: allow access to the element
  return <Fragment>{element}</Fragment>;
};

export default RouteGuard;

