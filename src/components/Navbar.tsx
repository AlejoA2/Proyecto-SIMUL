import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import logoUnilibre from '../assets/logo-unilibre.png';

const NAV_LINKS = [
  { label: 'Explorar', path: '/explorar' },
  { label: 'Eventos', path: '/buscar?cat=eventos' },
  { label: 'Hall de la Fama', path: '/buscar?cat=hall' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    const [pathname, query] = path.split('?');
    if (location.pathname !== pathname) return false;
    const linkCat = new URLSearchParams(query || '').get('cat');
    const currentCat = new URLSearchParams(location.search).get('cat');
    return linkCat ? currentCat === linkCat : !currentCat;
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/dashboard/estudiante';
    if (user.role === 'teacher') return '/dashboard/docente';
    if (user.role === 'admin') return '/dashboard/admin';
    return '/';
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 bg-[#1A1A1A] text-white"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
    >
      <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
          aria-label="SIMUL - Inicio"
        >
          <img
            src={logoUnilibre}
            alt="Logo Universidad Libre"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
            SIMUL
          </span>
          <span className="text-simul-gold-light text-xs font-medium hidden sm:block" style={{ fontFamily: 'Inter' }}>
            Museo Digital
          </span>
        </button>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              style={{ fontFamily: 'Montserrat' }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => navigate(getDashboardPath())}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/50 text-sm font-semibold text-white hover:bg-white hover:text-[#C8102E] transition-colors"
              style={{ fontFamily: 'Montserrat' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
              Mi Dashboard
            </button>
          )}

          <button
            onClick={() => navigate('/buscar')}
            className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Buscar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-white/40" />
                <span className="text-sm font-semibold hidden sm:block" style={{ fontFamily: 'Montserrat' }}>{user.name.split(' ')[0]}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                  style={{ zIndex: 50 }}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Montserrat' }}>{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span style={{ color: '#C9A84C' }} className="text-xs font-bold">⭐ {user.points} pts · Nivel {user.level}</span>
                    </div>
                  </div>
                  <button onClick={() => { navigate(getDashboardPath()); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontFamily: 'Inter' }}>
                    Mi Dashboard
                  </button>
                  {user.role === 'student' && (
                    <>
                      <button onClick={() => { navigate('/mis-aportes'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Mis Aportes</button>
                      <button onClick={() => { navigate('/favoritos'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Favoritos</button>
                      <button onClick={() => { navigate('/ranking'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Ranking</button>
                    </>
                  )}
                  {user.role === 'teacher' && (
                    <button onClick={() => { navigate('/registrar-contenido'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Registrar Contenido</button>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <button onClick={() => { navigate('/admin/validacion'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Bandeja Validación</button>
                      <button onClick={() => { navigate('/admin/usuarios'); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Gestionar Usuarios</button>
                    </>
                  )}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary text-sm px-4 py-2">
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
