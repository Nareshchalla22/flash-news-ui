import { Routes, Route } from 'react-router-dom';

// --- Core Pages ---
import Home from '../components/Pages/Home';
import CategoryPage from '../components/shared/CategoryLayout';

// --- Category Pages ---
import GlobalPage from '../components/Pages/category/GlobalPage';
import NationalPage from '../components/Pages/category/NationalPage';
import StatePage from '../components/Pages/category/StatePage';
import BusinessPage from '../components/Pages/category/BusinessPage';
import CrimePage from '../components/Pages/category/CrimePage';
import EntertainmentPage from '../components/Pages/category/EntertainmentPage';
import SportsPage from '../components/Pages/category/SportsPage';
import HealthPage from '../components/Pages/category/HealthPage';
import PoliticsPage from '../components/Pages/category/PoliticsPage';
import TravelPage from '../components/Pages/category/TravelPage';
import TrendingPage from '../components/Pages/category/TrendingPage';
import LiveTVPage from '../components/Pages/category/LiveTVPage';

// --- Admin / Manager Pages ---
import UpdateNews from '../components/Pages/Form/UpdateNews';
import TickerManager from '../components/Pages/Ticker/TickerManager';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminApplicationsPage from '../../components/Admin/AdminApplicationsPage';

// ✅ AUTH
import LoginPage from '../auth/LoginPage';
import UnauthorizedPage from '../auth/UnauthorizedPage';
import { ProtectedRoute, PublicOnlyRoute } from '../auth/ProtectedRoute';
import ReporterJoinPage from '../components/Pages/pressid/Reporterjoinpage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/global" element={<GlobalPage />} />
      <Route path="/national" element={<NationalPage />} />
      <Route path="/state" element={<StatePage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/crime" element={<CrimePage />} />
      <Route path="/entertainment" element={<EntertainmentPage />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="/category/:name" element={<PoliticsPage />} />
      <Route path="/travel" element={<TravelPage />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/live-tv" element={<LiveTVPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/join" element={<ReporterJoinPage />} />


      {/* ── Login: redirect away if already signed in ── */}
      <Route path="/login" element={
        <PublicOnlyRoute>
          <LoginPage />
        </PublicOnlyRoute>
      } />

      {/* ── Protected: any logged-in user ── */}
       <Route path="/id-card" element={
        <ProtectedRoute>
          <div className="p-20 text-center font-black italic text-2xl uppercase text-slate-800">
            <PressIdPagee />
          </div>
        </ProtectedRoute>
      } /> 

      {/* ── Admin only routes ── */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/update-data" element={
        <ProtectedRoute requireAdmin>
          <UpdateNews />
        </ProtectedRoute>
      } />

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
        <div className="p-20 text-center font-black italic text-slate-300 text-4xl uppercase">
          404 — Pulse Lost
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;