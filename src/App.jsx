import './App.css';
import Navbar from './Navbar/navbar';
import Ticker from './components/Pages/Ticker/Ticker';
import Header from './Header/Header';
import BottomNav from './Bottom/BottomNav';
import Footer from './Footer/Footer';
import { useNavbar } from './Navbar/useNavbar';
import AppRoutes from './routes/AppRoutes'; // Import the new routes file

function App() {
  const { isExpanded, isMobile } = useNavbar();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* 1. Fixed Top Section */}
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
            {/* ✅ ALL ROUTES LOADED HERE */}
            <AppRoutes /> 
          </main>
          <Footer />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;