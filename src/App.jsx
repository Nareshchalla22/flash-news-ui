import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar/navbar'
import Ticker from './components/Pages/Ticker/Ticker'
import Header from './Header/Header'
import BottomNav from './Bottom/BottomNav'
import { useNavbar } from './Navbar/useNavbar'
import Footer from './Footer/Footer'

// --- 1. CORE PAGES ---
import Home from './components/Pages/Home'
import CategoryPage from './components/shared/CategoryLayout'

// --- 2. CATEGORY PAGES ---
import GlobalPage from './components/Pages/category/GlobalPage';
import NationalPage from './components/Pages/category/NationalPage';
import StatePage from './components/Pages/category/StatePage';
import BusinessPage from './components/Pages/category/BusinessPage';
import CrimePage from './components/Pages/category/CrimePage';
import EntertainmentPage from './components/Pages/category/EntertainmentPage';
import SportsPage from './components/Pages/category/SportsPage';
import HealthPage from './components/Pages/category/HealthPage';
import PoliticsPage from './components/Pages/category/PoliticsPage';
import TravelPage from './components/Pages/category/TravelPage';
import TrendingPage from './components/Pages/category/TrendingPage';
import LiveTVPage from './components/Pages/category/LiveTVPage';
import UpdateNews from './components/Pages/Form/UpdateNews'
import TickerManager from './components/Pages/Ticker/TickerManager'

function App() {
  const { isExpanded, isMobile } = useNavbar();
  //const breakingNews = "FLASHREPORT: Hyderabad Tech Corridor to see 50,000 new jobs by December 2026!";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* 1. TOP SECTION - Now Fixed */}
      <div className="z-[110] fixed top-0 right-0 w-full bg-slate-50 shadow-md">
        <Ticker />
        </div>
        <div className="z-[110] sticky top-0 w-full bg-slate-50">
          <Header />
          
        </div>

        <div className="flex flex-1 relative">
          {!isMobile && <Navbar />}

          <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out
            ${!isMobile ? (isExpanded ? 'ml-64' : 'ml-20') : 'ml-0'} pb-20 md:pb-24`}
          >
            <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/global" element={<GlobalPage />} />
                <Route path="/national" element={<NationalPage />} />
                <Route path="/state" element={<StatePage />} />
                <Route path="/business" element={<BusinessPage />} />
                <Route path="/crime" element={<CrimePage />} />
                <Route path="/entertainment" element={<EntertainmentPage />} />
                <Route path="/sports" element={<SportsPage />} />
                <Route path="/health" element={<HealthPage />} />

                {/* Check if your Navbar uses /politics or /political */}
                <Route path="/category/:name" element={<PoliticsPage />} />
                <Route path="/political" element={<PoliticsPage />} />

                <Route path="/travel" element={<TravelPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/livetv" element={<LiveTVPage />} />
                <Route path="/update-data" element={<UpdateNews />} />
                <Route path="/ticker-control" element={<TickerManager />} />

                <Route path="/id-card" element={<div className="p-20 text-center font-black italic text-2xl uppercase">Generate Press Pass</div>} />

                {/* Dynamic Fallback */}
                <Route path="/category/:name" element={<CategoryPage />} />

                {/* Debugging 404 Route */}
                <Route path="*" element={
                  <div className="p-20 text-center font-black italic text-slate-300 text-4xl uppercase">
                    404 - Pulse Lost (Check URL Path)
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
        <BottomNav />
      </div>
      )
}

      export default App;