import { Routes, Route } from 'react-router-dom';

import Home              from '../components/Pages/Home';
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
import AllNewsFeedPage   from '../components/Pages/feed/AllNewsFeedPage';

import UpdateNews            from '../components/Pages/Form/UpdateNews';
import TickerManager         from '../components/Pages/Ticker/TickerManager';
import AdminDashboard        from '../components/Admin/AdminDashboard';
import AdminApplicationsPage from '../components/Admin/Adminapplicationspage';

import LoginPage        from '../auth/LoginPage';
import UnauthorizedPage from '../auth/UnauthorizedPage';
import { ProtectedRoute, PublicOnlyRoute } from '../auth/ProtectedRoute';
import ReporterJoinPage from '../components/Pages/pressid/Reporterjoinpage';
import PressIdPage from '../components/Pages/pressid/PressIdPage';

const AppRoutes = () => {
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/"               element={<Home />} />
      <Route path="/news-feed"      element={<AllNewsFeedPage />} />
      <Route path="/global"         element={<GlobalPage />} />
      <Route path="/national"       element={<NationalPage />} />
      <Route path="/state"          element={<StatePage />} />
      <Route path="/business"       element={<BusinessPage />} />
      <Route path="/crime"          element={<CrimePage />} />
      <Route path="/entertainment"  element={<EntertainmentPage />} />
      <Route path="/sports"         element={<SportsPage />} />
      <Route path="/health"         element={<HealthPage />} />
      <Route path="/category/:name" element={<PoliticsPage />} />
      <Route path="/travel"         element={<TravelPage />} />
      <Route path="/trending"       element={<TrendingPage />} />
      <Route path="/live-tv"        element={<LiveTVPage />} />
      <Route path="/unauthorized"   element={<UnauthorizedPage />} />
      <Route path="/join"           element={<ReporterJoinPage />} />
      <Route path="/id-card"         element={<PressIdPage />} />

      {/* ── Login ── */}
      <Route path="/login" element={
        <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
      } />

      {/* ── REPORTER + ADMIN: news publishing ── */}
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
      <Route path="/admin/applications" element={
        <ProtectedRoute requireAdmin>
          <AdminApplicationsPage />
        </ProtectedRoute>
      } />

      {/* ── 404 ── */}
      <Route path="*" element={
        <div style={{
          minHeight: "60vh", display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: 12,
          background: "#0f0f0f",
        }}>
          <span style={{ fontSize: 64 }}>📡</span>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#374151", textTransform: "uppercase", margin: 0 }}>
            404 — Signal Lost
          </h2>
          <a href="/" style={{ color: "#1DB954", fontWeight: 700, fontSize: 13 }}>← Return to Home</a>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;