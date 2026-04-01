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

  // Remove the "if(isMobile) return null;" from here!

  const breakingNews = "FLASHREPORT: Hyderabad Tech Corridor to see 50,000 new jobs by December 2026!";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* 1. TOP SECTION */}
      <div className="z-[80] sticky top-0 bg-slate-50">
        <Ticker scrollingText={breakingNews} />
        <Header />
      </div>

      <div className="flex flex-1 relative">
        {/* 2. SIDEBAR: Updated to hide strictly on mobile */}
        {!isMobile && <Navbar />}

        {/* 3. MAIN CONTENT AREA */}
        <div 
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out
            /* Desktop: Adjust margin based on sidebar state */
            ${!isMobile ? (isExpanded ? 'ml-64' : 'ml-20') : 'ml-0'}
            /* Mobile/Laptop: Room for BottomNav */
            pb-20 md:pb-24
          `}
        >
          {/* Main Routing Area */}
          <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/live-tv" element={<div className="p-20 text-center font-black italic text-2xl">LIVE STREAMING...</div>} />
              <Route path="/id-card" element={<div className="p-20 text-center font-black italic text-2xl">GENERATE PRESS PASS</div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>

      {/* 4. NAVIGATION BAR: Always at the bottom */}
      <BottomNav />
    </div>
  )
}

export default App;