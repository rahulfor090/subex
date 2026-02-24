import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import CreatePassword from "./pages/CreatePassword";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import AboutPage from "./pages/AboutPage";
import SecurityPage from "./pages/SecurityPage";
import TeamPage from "./pages/TeamPage";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import RenewalAlerts from "./pages/RenewalAlerts";
import Transactions from "./pages/Transactions";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import SubscriptionList from "./pages/subscriptions/SubscriptionList";
import SubscriptionDetail from "./pages/subscriptions/SubscriptionDetail";
import SubscriptionForm from "./pages/subscriptions/SubscriptionForm";
import DashboardLayout from "./layouts/DashboardLayout";
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
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/create-password" element={<CreatePassword />} />
              
              {/* Footer Pages */}
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/team" element={<TeamPage />} />
              
              {/* Subscription Routes (Standalone & Protected) */}
              <Route path="/subscriptions" element={<Protected><SubscriptionList /></Protected>} />
              <Route path="/subscriptions/add" element={<Protected><SubscriptionForm mode="add" /></Protected>} />
              <Route path="/subscriptions/edit/:id" element={<Protected><SubscriptionForm mode="edit" /></Protected>} />
              <Route path="/subscriptions/:id" element={<Protected><SubscriptionDetail /></Protected>} />
              
              {/* Dashboard routes with layout */}
              <Route element={<Protected><DashboardLayout /></Protected>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/subscriptions" element={<SubscriptionList />} />
                <Route path="/dashboard/subscriptions/add" element={<SubscriptionForm mode="add" />} />
                <Route path="/dashboard/subscriptions/edit/:id" element={<SubscriptionForm mode="edit" />} />
                <Route path="/dashboard/subscriptions/:id" element={<SubscriptionDetail />} />
                <Route path="/dashboard/analytics" element={<Analytics />} />
                <Route path="/dashboard/alerts" element={<RenewalAlerts />} />
                <Route path="/dashboard/transactions" element={<Transactions />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/security" element={<SecurityPage />} />
                <Route path="/dashboard/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
