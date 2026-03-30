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
    // 'overflow-x-hidden' is vital to prevent the "Laptop Zoom" effect
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden w-full">
      
      {/* 1. TOP SECTION (Ticker & Header) */}
      <div className="flex flex-col sticky top-0 z-[100] w-full">
        <Ticker scrollingText={breakingNews} />
        <Header />
      </div>

      <div className="flex flex-1 w-full relative">
        {/* 2. SIDEBAR (Navbar) 
            Ensure this component uses translate-x-full to hide on mobile! */}
        <Navbar />

        {/* 3. MAIN CONTENT AREA:
            We use 'w-full' and 'max-w-full' to force it to phone width.
            'pb-24' ensures the BottomNav doesn't cover the Footer. */}
        <div className={`flex flex-col flex-1 w-full max-w-full transition-all duration-300 
          ${isMobile ? 'ml-0 pb-24' : isExpanded ? 'ml-64' : 'ml-20'}`}>
          
          <main className="flex-1 w-full overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/live-tv" element={<div className="p-10 text-center font-black text-slate-300">LIVE TV</div>} />
              <Route path="/id-card" element={<div className="p-10 text-center font-black text-slate-300">ID CARD</div>} />
              <Route path="/trending" element={<div className="p-10 text-center font-black text-slate-300">TRENDING</div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>

      {/* 4. MOBILE BOTTOM NAV */}
      <BottomNav />
    </div>
  )
}

export default App