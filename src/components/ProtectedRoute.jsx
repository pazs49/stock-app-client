import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { checkToken } from "@/api/auth/auth";

function ProtectedRoute({ children }) {
  const { data: isLoggedIn, isLoading } = useQuery({
    queryKey: ["checkToken"],
    queryFn: checkToken,
    retry: false,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
