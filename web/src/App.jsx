import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthCallback from "./pages/OAuthCallback";
import CreatePassword from "./pages/CreatePassword";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SubscriptionList from "./pages/subscriptions/SubscriptionList";
import SubscriptionDetail from "./pages/subscriptions/SubscriptionDetail";
import SubscriptionForm from "./pages/subscriptions/SubscriptionForm";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import PrivacyPage from "./pages/PrivacyPage";
import RenewalAlerts from "./pages/RenewalAlerts";
import Transactions from "./pages/Transactions";
import SecurityPage from "./pages/SecurityPage";
import ProfilePage from "./pages/ProfilePage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import ContactPage from "./pages/ContactPage";
import CareersPage from "./pages/CareersPage";
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import { ThemeProvider } from "./lib/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NavigationProvider, useNavDirection } from "./contexts/NavigationContext";

// Auth pages that share the horizontal slide transition
const AUTH_ROUTES = new Set(["/login", "/registration", "/register", "/forgot-password", "/reset-password"]);

// Admin imports
import AdminProtected from "./components/admin/AdminProtected";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminSystemHealth from "./pages/admin/AdminSystemHealth";

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

/* ── Animated route shell ───────────────────────────────────────────────── */
const AnimatedRoutes = () => {
  const location = useLocation();
  const { direction } = useNavDirection();
  const isAuth = AUTH_ROUTES.has(location.pathname);

  // Auth pages: directional horizontal slide + subtle scale + blur
  const authVariants = {
    initial: (dir) => ({
      x: dir * 60,
      opacity: 0,
      scale: 0.97,
      filter: "blur(6px)",
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1], // custom spring-like cubic-bezier
      },
    },
    exit: (dir) => ({
      x: dir * -60,
      opacity: 0,
      scale: 0.97,
      filter: "blur(6px)",
      transition: {
        duration: 0.32,
        ease: [0.55, 0, 0.45, 1],
      },
    }),
  };

  // All other pages: simple elegant fade
  const fadeVariants = {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={isAuth ? authVariants : fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ willChange: "transform, opacity, filter" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardLayout />
              </Protected>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="subscriptions" element={<SubscriptionList />} />
            <Route path="subscriptions/add" element={<SubscriptionForm mode="add" />} />
            <Route path="subscriptions/edit/:id" element={<SubscriptionForm mode="edit" />} />
            <Route path="subscriptions/:id" element={<SubscriptionDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="alerts" element={<RenewalAlerts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
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
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route
                path="/create-password"
                element={<Protected><CreatePassword /></Protected>}
              />
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
              <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
                <Route index element={<Dashboard />} />
                <Route path="subscriptions" element={<SubscriptionList />} />
                <Route path="subscriptions/add" element={<SubscriptionForm mode="add" />} />
                <Route path="subscriptions/edit/:id" element={<SubscriptionForm mode="edit" />} />
                <Route path="subscriptions/:id" element={<SubscriptionDetail />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="alerts" element={<RenewalAlerts />} />

                <Route path="transactions" element={<Transactions />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminProtected><AdminLayout /></AdminProtected>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="system" element={<AdminSystemHealth />} />
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
