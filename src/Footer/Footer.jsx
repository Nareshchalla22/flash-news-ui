import React from 'react';
import { socialLinks, footerInfo, navItems } from '../Navbar/navdata';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. TOP SECTION: Subscription (Matches your reference image) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h2 className="text-white text-2xl font-bold max-w-sm text-center md:text-left">
            Stay informed and not overwhelmed, subscribe now!
          </h2>
          <div className="flex w-full md:w-auto bg-white rounded overflow-hidden shadow-lg">
            <input 
              type="email" 
              placeholder="Your email *" 
              className="px-4 py-3 w-full md:w-64 text-black outline-none text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold uppercase text-xs transition-all cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

        <hr className="border-gray-900 mb-12" />

        {/* 2. GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Business Hours & Socials */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Business Hours</h3>
            <p className="text-sm mb-2"><span className="text-gray-200">Mon - Fri:</span> 08:00 - 20:00</p>
            <p className="text-sm mb-6"><span className="text-gray-200">Sat - Sun:</span> 09:00 - 14:00</p>
            
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-gray-800 rounded-full hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                  title={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Categories</h3>
            <ul className="grid grid-cols-2 gap-y-3">
              {navItems.slice(1, 11).map(item => (
                <li key={item.label} className="hover:text-white cursor-pointer transition text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Information</h3>
            <ul className="space-y-4">
              {footerInfo.map(info => (
                <li key={info.label} className="hover:text-white cursor-pointer transition text-sm flex items-center gap-3">
                  <info.icon size={16} className="text-gray-600" />
                  {info.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Branding Section */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
              <h1 className="text-white text-4xl font-black italic tracking-tighter">FLASHREPORT</h1>
              <p className="text-[10px] tracking-[0.4em] mt-2 text-blue-500 font-bold uppercase">
                All Voices Matter
              </p>
          </div>
        </div>

        {/* 3. COPYRIGHT */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-600">
          <p>© {new Date().getFullYear()} FLASHREPORT Portal. All Rights Reserved.</p>
          <p className="uppercase tracking-widest">Designed & Developed by cn818280</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;