import React from 'react';
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';

const SocialStats = () => {
  const stats = [
    { label: 'Followers', count: '1.2M', icon: FaFacebookF, color: 'bg-[#1877F2]' },
    { label: 'Subscribers', count: '850K', icon: FaYoutube, color: 'bg-[#FF0000]' },
    { label: 'Followers', count: '420K', icon: FaInstagram, color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {stats.map((social, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg`}>
              <social.icon size={18} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800 leading-none">{social.count}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{social.label}</p>
            </div>
          </div>
          <div className="text-slate-200 group-hover:text-blue-600 transition-colors">→</div>
        </div>
      ))}
    </div>
  );
};

export default SocialStats;