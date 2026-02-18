import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SubscriptionList from "./pages/subscriptions/SubscriptionList";
import SubscriptionDetail from "./pages/subscriptions/SubscriptionDetail";
import SubscriptionForm from "./pages/subscriptions/SubscriptionForm";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import PrivacyPage from "./pages/PrivacyPage";
import RenewalAlerts from "./pages/RenewalAlerts";
import Marketplace from "./pages/Marketplace";
import Transactions from "./pages/Transactions";
import SecurityPage from "./pages/SecurityPage";
import ProfilePage from "./pages/ProfilePage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import { ThemeProvider } from "./lib/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
                <Route index element={<Dashboard />} />
                <Route path="subscriptions" element={<SubscriptionList />} />
                <Route path="subscriptions/add" element={<SubscriptionForm mode="add" />} />
                <Route path="subscriptions/edit/:id" element={<SubscriptionForm mode="edit" />} />
                <Route path="subscriptions/:id" element={<SubscriptionDetail />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="alerts" element={<RenewalAlerts />} />
                <Route path="marketplace" element={<Marketplace />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
