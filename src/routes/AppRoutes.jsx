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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* ✅ News Categories */}
      <Route path="/global" element={<GlobalPage />} />
      <Route path="/national" element={<NationalPage />} />
      <Route path="/state" element={<StatePage />} />
      <Route path="/business" element={<BusinessPage />} />
      <Route path="/crime" element={<CrimePage />} />
      <Route path="/entertainment" element={<EntertainmentPage />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="/politics" element={<PoliticsPage />} />
      <Route path="/travel" element={<TravelPage />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/livetv" element={<LiveTVPage />} />

      {/* ✅ Admin & Management */}
      <Route path="/update-data" element={<UpdateNews />} />
      <Route path="/ticker" element={<TickerManager />} />

      {/* ✅ Dynamic & Static Pages */}
      <Route path="/category/:name" element={<CategoryPage />} />
      <Route path="/id-card" element={
        <div className="p-20 text-center font-black italic text-2xl uppercase text-slate-800">
          Generate Press Pass
        </div>
      } />

      {/* ✅ 404 Catch-all */}
      <Route path="*" element={
        <div className="p-20 text-center font-black italic text-slate-300 text-4xl uppercase">
          404 - Pulse Lost (Check URL Path)
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;