import React from 'react';
import { socialLinks, footerInfo, navItems } from '../Navbar/navdata';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const categories = navItems
    .filter(i => !['Home', 'System Update', 'Login', 'Live TV', 'Trending', 'ID Card', 'Admin', 'News Feed'].includes(i.label))
    .slice(0, 8);

  // Map nav label to translation key
  const navKey = {
    Global: "global", National: "national", State: "state",
    Business: "business", Crime: "crime", Entertainment: "entertainment",
    Sports: "sports", Health: "health", Politics: "politics", Travel: "travel",
  };

  return (
    <footer className="bg-[#0a0a0a] text-slate-500 border-t-2 border-[#1DB954]">

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-[900] italic uppercase tracking-tighter text-[#1DB954] transform -skew-x-12">
                AP13
              </span>
              <span className="text-lg font-[800] italic uppercase text-white -skew-x-12 ml-1">
                NEWS
              </span>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-3">
              FlashReport Network
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {t("footer.digital247")}
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-7 h-7 flex items-center justify-center border border-slate-800 rounded-lg hover:bg-[#1DB954] hover:border-[#1DB954] hover:text-black text-slate-600 transition-all duration-300 text-xs"
                >
                  <social.icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-1.5">
              {categories.map(item => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-xs text-slate-600 hover:text-[#1DB954] transition-colors font-medium"
                  >
                    {t(`nav.${navKey[item.label] || item.label.toLowerCase()}`) || item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company info */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              {t("footer.company")}
            </h4>
            <ul className="space-y-1.5">
              {footerInfo.map(info => (
                <li key={info.label}>
                  <span className="text-xs text-slate-600 hover:text-[#1DB954] transition-colors cursor-pointer font-medium flex items-center gap-1.5">
                    <info.icon size={10} className="text-slate-700" />
                    {info.label}
                  </span>
                </li>
              ))}
              <li>
                <Link to="/join" className="text-xs text-[#1DB954] hover:text-white transition-colors font-bold flex items-center gap-1.5">
                  ⚡ {t("footer.joinReporter")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              {t("footer.newsletter")}
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              {t("footer.digital247")}
            </p>
            <div className="flex gap-1">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 px-3 py-2 text-xs bg-[#181818] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#1DB954] transition-colors"
              />
              <button className="bg-[#1DB954] hover:bg-[#1ed760] text-black px-3 py-2 rounded-lg text-xs font-black transition-colors">
                →
              </button>
            </div>
            <p className="text-[10px] text-slate-700 mt-2">{t("footer.noSpam")}</p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-slate-900 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-slate-700 font-semibold uppercase tracking-widest">
          <p>© {year} AP13 News Network · {t("footer.allRights")}</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#1DB954] cursor-pointer transition-colors">{t("footer.privacy")}</span>
            <span className="w-0.5 h-3 bg-slate-800 rounded" />
            <span className="hover:text-[#1DB954] cursor-pointer transition-colors">{t("footer.terms")}</span>
            <span className="w-0.5 h-3 bg-slate-800 rounded" />
            <span className="text-slate-800">DevID: AP13_PRO_2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;