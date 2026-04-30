import React from 'react';
import { socialLinks, footerInfo, navItems } from '../Navbar/navdata';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#d1d131] text-slate-400 py-16 px-6 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. TOP SECTION: Network Subscription */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-white text-3xl font-[1000] italic uppercase tracking-tighter leading-none mb-2">
              Stay Informed, <span className="text-red-600">Not Overwhelmed</span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Join the AP13 News Daily Briefing</p>
          </div>
          
          <div className="flex w-full md:w-auto bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 p-1">
            <input 
              type="email" 
              placeholder="Email Address *" 
              className="px-6 py-4 w-full md:w-72 bg-transparent text-white outline-none text-sm font-bold"
            />
            <button className="bg-red-600 hover:bg-white hover:text-red-600 text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest transition-all duration-300 rounded-lg shadow-lg">
              Subscribe
            </button>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-slate-800 to-transparent mb-12" />

        {/* 2. GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Station Identity & Socials */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-black mb-6 uppercase tracking-[0.2em] text-xs border-b-2 border-red-600 pb-2">Network Hub</h3>
            <p className="text-sm mb-2 font-medium"><span className="text-slate-200">Broadcast:</span> 24/7 Digital Feed</p>
            <p className="text-sm mb-8 font-medium"><span className="text-slate-200">Headquarters:</span> Hyderabad, TS</p>
            
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center border border-slate-800 rounded-xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-xl group"
                  title={social.label}
                >
                  <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Direct Category Access */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase tracking-[0.2em] text-xs border-b-2 border-slate-800 pb-2">Categories</h3>
            <ul className="grid grid-cols-2 gap-y-3">
              {navItems.filter(i => !['Home', 'System Update'].includes(i.label)).slice(0, 10).map(item => (
                <li key={item.label} className="group">
                  <Link to={item.path} className="text-slate-500 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-800 group-hover:bg-red-600 rounded-full transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information & Legal */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase tracking-[0.2em] text-xs border-b-2 border-slate-800 pb-2">Information</h3>
            <ul className="space-y-4">
              {footerInfo.map(info => (
                <li key={info.label} className="hover:text-white cursor-pointer transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-3 group">
                  <info.icon size={16} className="text-slate-700 group-hover:text-red-600 transition-colors" />
                  {info.label}
                </li>
              ))}
            </ul>
          </div>

          {/* 4K Branding Section */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
              <div className="flex flex-col">
                <span className="text-white text-5xl font-[1000] italic tracking-tighter leading-none transform -skew-x-12">
                  AP13 <span className="text-red-600">NEWS</span>
                </span>
                <span className="text-[9px] tracking-[0.5em] mt-3 text-slate-500 font-black uppercase leading-none">
                  FlashReport Network
                </span>
              </div>
              <p className="mt-6 text-[11px] font-medium leading-relaxed max-w-[200px] text-slate-600">
                Delivering high-fidelity journalism across the digital landscape 24/7.
              </p>
          </div>
        </div>

        {/* 3. COPYRIGHT */}
        <div className="pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} AP13 News Network. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-red-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span className="hover:text-red-600 cursor-pointer transition-colors">Terms of Service</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <p className="text-red-900/40">DevID: AP13_PRO_2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;