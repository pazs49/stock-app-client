import Auth from "./pages/Auth";
import Dashboard from "./layouts/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserTransactions from "./pages/UserTransactions";
import AdminTransactions from "./pages/AdminTransactions";
import UserProfile from "./pages/UserProfile";
import UserInfo from "./pages/UserInfo";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/user-transactions",
    element: (
      <ProtectedRoute>
        <UserTransactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-transactions",
    element: (
      <ProtectedRoute>
        <AdminTransactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/user/:id",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user-info",
    element: (
      <ProtectedRoute>
        <UserInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
