import { Routes, Route } from 'react-router-dom';

// ── Core Pages ────────────────────────────────────────────────────────────────
import Home            from '../components/Pages/Home';
import AllNewsFeedPage from '../components/Pages/feed/AllNewsFeedPage';

// ── Category Pages ────────────────────────────────────────────────────────────
import GlobalPage        from '../components/Pages/category/GlobalPage';
import NationalPage      from '../components/Pages/category/NationalPage';
import StatePage         from '../components/Pages/category/StatePage';
import BusinessPage      from '../components/Pages/category/BusinessPage';
import CrimePage         from '../components/Pages/category/CrimePage';
import EntertainmentPage from '../components/Pages/category/EntertainmentPage';
import SportsPage        from '../components/Pages/category/SportsPage';
import HealthPage        from '../components/Pages/category/HealthPage';
import PoliticsPage      from '../components/Pages/category/PoliticsPage';
import TravelPage        from '../components/Pages/category/TravelPage';
import TrendingPage      from '../components/Pages/category/TrendingPage';
import LiveTVPage        from '../components/Pages/category/LiveTVPage';

// ── Admin Pages ───────────────────────────────────────────────────────────────
import AdminDashboard        from '../components/Admin/AdminDashboard';
import AdminApplicationsPage from '../components/Admin/Adminapplicationspage';
import AdsDashboard          from '../components/Admin/AdsDashboard';
import UpdateNews            from '../components/Pages/Form/UpdateNews';
import TickerManager         from '../components/Pages/Ticker/TickerManager';

// ── Reporter Pages ────────────────────────────────────────────────────────────
import PressIdPage      from '../components/Pages/pressid/PressIdPage';
import ReporterJoinPage from '../components/Pages/pressid/Reporterjoinpage';

// ── Auth ──────────────────────────────────────────────────────────────────────
import LoginPage        from '../auth/LoginPage';
import UnauthorizedPage from '../auth/UnauthorizedPage';
import { ProtectedRoute, PublicOnlyRoute } from '../auth/ProtectedRoute';

// ─── ROUTES ───────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Routes>

      {/* ── PUBLIC ── */}
      <Route path="/"              element={<Home />} />
      <Route path="/news-feed"     element={<AllNewsFeedPage />} />
      <Route path="/global"        element={<GlobalPage />} />
      <Route path="/national"      element={<NationalPage />} />
      <Route path="/state"         element={<StatePage />} />
      <Route path="/business"      element={<BusinessPage />} />
      <Route path="/crime"         element={<CrimePage />} />
      <Route path="/entertainment" element={<EntertainmentPage />} />
      <Route path="/sports"        element={<SportsPage />} />
      <Route path="/health"        element={<HealthPage />} />
      <Route path="/travel"        element={<TravelPage />} />
      <Route path="/trending"      element={<TrendingPage />} />
      <Route path="/live-tv"       element={<LiveTVPage />} />
      <Route path="/category/:name" element={<PoliticsPage />} />
      <Route path="/join"          element={<ReporterJoinPage />} />
      <Route path="/unauthorized"  element={<UnauthorizedPage />} />

      {/* ── PRESS ID — self-guarded inside component ── */}
      <Route path="/id-card" element={<PressIdPage />} />

      {/* ── LOGIN ── */}
      <Route path="/login" element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      } />

      {/* ── REPORTER + ADMIN ── */}
      <Route path="/admin" element={
        <ProtectedRoute requireReporter>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/update-data" element={
        <ProtectedRoute requireReporter>
          <UpdateNews />
        </ProtectedRoute>
      } />

      {/* ── ADMIN ONLY ── */}
      <Route path="/ticker-control" element={
        <ProtectedRoute requireAdmin>
          <TickerManager />
        </ProtectedRoute>
      } />

      <Route path="/ads-dashboard" element={
        <ProtectedRoute requireAdmin>
          <AdsDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/applications" element={
        <ProtectedRoute requireAdmin>
          <AdminApplicationsPage />
        </ProtectedRoute>
      } />

      {/* ── 404 ── */}
      <Route path="*" element={
        <div style={{
          minHeight: '60vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 14,
          background: '#0f0f0f',
        }}>
          <span style={{ fontSize: 60 }}>📡</span>
          <h2 style={{
            fontSize: 34, fontWeight: 900, color: '#374151',
            textTransform: 'uppercase', fontStyle: 'italic', margin: 0,
          }}>
            404 — Signal Lost
          </h2>
          <p style={{ color: '#4b5563', fontSize: 13, margin: 0 }}>
            The page you're looking for doesn't exist.
          </p>
          <a href="/" style={{ color: '#1DB954', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            ← Return to Home
          </a>
        </div>
      } />

    </Routes>
  );
};

export default AppRoutes;