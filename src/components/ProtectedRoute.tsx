import { Navigate } from "react-router-dom";
// --- MODIFIED --- Import our new UserContext hook instead of AuthContext
import { useUser } from "@/context/UserContext"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// --- MODIFIED --- Changed to a standard function component for clarity
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // --- MODIFIED --- We now check for the 'currentUser' from our simulation
  const { currentUser } = useUser();

  if (!currentUser) {
    // If no user is logged in (currentUser is null), redirect to the /login page
    return <Navigate to="/login" replace />;
  }

  // If a user is logged in, show the child components (e.g., the Dashboard)
  return <>{children}</>;
};






