import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar/navbar' 
import Ticker from './Ticker/Ticker'
import Header from './Header/Header'
import BottomNav from './Bottom/BottomNav' 
import { useNavbar } from './Navbar/useNavbar' 
import Footer from './Footer/Footer'
import Home from './components/Pages/Home'
import CategoryPage from './components/Pages/categories/CategoryPage'

function App() {
  const { isExpanded, isMobile } = useNavbar();

  const breakingNews = "FLASHREPORT: Hyderabad Tech Corridor to see 50,000 new jobs by December 2026!";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* 1. TOP SECTION (Stays at the very top) */}
      <Ticker scrollingText={breakingNews} />
      <Header />

      <div className="flex flex-1 relative">
        {/* 2. FIXED NAVBAR (Stays on the left) */}
        <Navbar />

        {/* 3. MAIN CONTENT AREA: 
            Added 'pb-24' for mobile to clear your new premium BottomNav height. */}
        <div className={`flex flex-col flex-1 transition-all duration-300 
          ${isMobile ? 'ml-0 pb-24' : isExpanded ? 'ml-64' : 'ml-20'}`}>
          
          <main className="flex-1 p-4 md:p-8">
            <Routes>
              {/* Home Page with Bento Grids */}
              <Route path="/" element={<Home />} />
              
              {/* Dynamic Category Page for manual content */}
              <Route path="/category/:name" element={<CategoryPage />} />

              {/* Placeholder Routes - Ready for your next pages */}
              <Route path="/live-tv" element={<div className="p-20 text-center font-black italic text-4xl text-slate-200">LIVE STREAMING...</div>} />
              <Route path="/id-card" element={<div className="p-20 text-center font-black italic text-4xl text-slate-200">GENERATE PRESS PASS</div>} />
              <Route path="/trending" element={<div className="p-20 text-center font-black italic text-4xl text-slate-200">TRENDING NEWS</div>} />
              <Route path="/admin" element={<div className="p-20 text-center font-black italic text-4xl text-slate-200">ADMIN PANEL</div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION (Only shows on mobile) */}
      <BottomNav />
    </div>
  )
}

export default App