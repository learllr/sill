import { Navigate, Outlet } from "react-router-dom";
import GlobalBody from "../common/GlobalBody";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? (
    <GlobalBody>
      <Outlet />
    </GlobalBody>
  ) : (
    <Navigate to="/login" replace />
  );
}
