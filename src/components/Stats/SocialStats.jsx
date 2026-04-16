import React from 'react';
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';

const SocialStats = () => {
  const stats = [
    { 
      label: 'Followers', 
      count: '1.2M', 
      icon: FaFacebookF, 
      color: 'bg-[#1877F2]',
      url: 'https://www.facebook.com/apnewslocal.telugu' 
    },
    { 
      label: 'Subscribers', 
      count: '8.56K', 
      icon: FaYoutube, 
      color: 'bg-[#FF0000]',
      url: 'https://www.youtube.com/@ap13news' 
    },
    { 
      label: 'Followers', 
      count: '420K', 
      icon: FaInstagram, 
      color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
      url: 'https://www.instagram.com/ap13news_telugu?igsh=MW84Zm1qcjJyb2h4Ng==' 
    },
  ];

  const handleRedirect = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {stats.map((social, i) => (
        <div 
          key={i} 
          onClick={() => handleRedirect(social.url)}
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg`}>
              <social.icon size={18} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-800 leading-none">{social.count}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{social.label}</p>
            </div>
          </div>
          <div className="text-slate-200 group-hover:text-blue-600 transition-colors font-bold text-xl">
            →
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialStats;