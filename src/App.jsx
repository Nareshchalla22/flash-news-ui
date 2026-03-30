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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* TOP SECTION: These stay at the very top */}
      <Ticker scrollingText={breakingNews} />
      <Header />

      <div className="flex flex-1">
        {/* FIXED NAVBAR: Stays on the left */}
        <Navbar />

        {/* MAIN CONTENT: Moves based on Sidebar width */}
        <div className={`flex flex-col flex-1 transition-all duration-300 
          ${isMobile ? 'ml-0 pb-20' : isExpanded ? 'ml-64' : 'ml-20'}`}>
          
          <main className="flex-1 p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* 2. DYNAMIC CATEGORY VIEW: Now uses the actual component */}
              <Route path="/category/:name" element={<CategoryPage />} />

              <Route path="/live-tv" element={<div className="p-20 text-center font-black italic text-2xl">LIVE STREAMING...</div>} />
              <Route path="/id-card" element={<div className="p-20 text-center font-black italic text-2xl">GENERATE PRESS PASS</div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default App