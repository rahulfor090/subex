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
import Revenue from "./pages/Revenue";
import LifeTimeDeals from "./pages/LifeTimeDeals";
import Analytics from "./pages/Analytics";
import RenewalAlerts from "./pages/RenewalAlerts";
import Transactions from "./pages/Transactions";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import SubscriptionList from "./pages/subscriptions/SubscriptionList";
import SubscriptionDetail from "./pages/subscriptions/SubscriptionDetail";
import SubscriptionForm from "./pages/subscriptions/SubscriptionForm";
import AddIncomeSource from "./pages/revenue/AddIncomeSource";
import DashboardLayout from "./layouts/DashboardLayout";
import { ThemeProvider } from "./lib/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";

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

const Placeholder = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{title} Coming Soon</h1>
    <p className="text-zinc-500 dark:text-zinc-400">We're working hard to bring you the best experience.</p>
  </div>
);


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="App">
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NavigationProvider>
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
                  <Route path="/dashboard" element={<Navigate to="/dashboard/subscriptions" replace />} />
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

                  {/* New Restructured Routes */}
                  <Route path="/dashboard/lifetime-deals" element={<LifeTimeDeals />} />
                  <Route path="/dashboard/complementary" element={<Placeholder title="Complementary Deals" />} />
                  <Route path="/dashboard/revenue" element={<Revenue />} />
                  <Route path="/dashboard/revenue/add" element={<AddIncomeSource />} />
                  <Route path="/dashboard/reports" element={<Placeholder title="Reports" />} />
                  <Route path="/dashboard/cash-flow" element={<Placeholder title="Cash Flow" />} />
                  <Route path="/dashboard/calendar" element={<Placeholder title="Calendar" />} />
                  <Route path="/dashboard/cardworld" element={<Placeholder title="Cardworld" />} />
                </Route>
              </Routes>
            </NavigationProvider>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
