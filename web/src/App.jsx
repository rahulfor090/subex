import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import SubscriptionList from "./pages/subscriptions/SubscriptionList";
import SubscriptionDetail from "./pages/subscriptions/SubscriptionDetail";
import SubscriptionForm from "./pages/subscriptions/SubscriptionForm";
import { ThemeProvider } from "./lib/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminRoute from "./components/admin/AdminRoute";

// Protected route wrapper component
const Protected = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={<Protected><SubscriptionList /></Protected>}
              />
              <Route
                path="/subscriptions/:id"
                element={<Protected><SubscriptionDetail /></Protected>}
              />
              <Route
                path="/subscriptions/add"
                element={<Protected><SubscriptionForm mode="add" /></Protected>}
              />
              <Route
                path="/subscriptions/edit/:id"
                element={<Protected><SubscriptionForm mode="edit" /></Protected>}
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<AdminRoute><AdminDashboard /></AdminRoute>}
              />
              <Route
                path="/admin/users"
                element={<AdminRoute><AdminUsers /></AdminRoute>}
              />
              <Route
                path="/admin/plans"
                element={<AdminRoute><AdminPlans /></AdminRoute>}
              />
              <Route
                path="/admin/transactions"
                element={<AdminRoute><AdminTransactions /></AdminRoute>}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
