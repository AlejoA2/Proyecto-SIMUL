import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CONTENT_ITEMS, RANKING_DATA } from '../data/content';

const LEVEL_NAMES = ['', 'Curioso', 'Explorador', 'Colaborador', 'Contribuidor', 'Innovador', 'Investigador', 'Referente', 'Experto', 'Maestro', 'Leyenda'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }

  const myContributions = CONTENT_ITEMS.filter((c) => c.author.includes('Valentina'));
  const maxPoints = 2000;
  const pct = Math.min((user.points / maxPoints) * 100, 100);
  const userRank = RANKING_DATA.find((r) => r.isCurrentUser);

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#C8102E]/20" />
            <div>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>Bienvenida de nuevo,</p>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>{user.name}</h1>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>{user.email} · Estudiante</p>
            </div>
          </div>
          <button onClick={() => navigate('/proponer-contenido')} className="btn-primary hidden sm:block">
            + Proponer proyecto
          </button>
        </div>

        {/* Gamification bar */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Inter' }}>Tu nivel actual</p>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 24, color: '#E2C06A' }}>
                Nivel {user.level} — {LEVEL_NAMES[user.level]}
              </h3>
            </div>
            <div className="text-right">
              <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: '#C9A84C' }}>{user.points}</span>
              <span className="text-gray-400 text-sm ml-1" style={{ fontFamily: 'Inter' }}>/ {maxPoints} pts para Nivel {user.level + 1}</span>
            </div>
          </div>
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="gold-bar h-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-gray-400 text-xs" style={{ fontFamily: 'Inter' }}>Tus insignias:</p>
            {user.badges.map((b) => (
              <span key={b} className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#C9A84C20', color: '#C9A84C', fontFamily: 'Montserrat' }}>
                🏅 {b}
              </span>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Aportes realizados', value: myContributions.length, icon: '📝', action: () => navigate('/mis-aportes') },
            { label: 'Favoritos guardados', value: 7, icon: '★', action: () => navigate('/favoritos') },
            { label: 'Posición en ranking', value: `#${userRank?.rank || '-'}`, icon: '🏆', action: () => navigate('/ranking') },
            { label: 'Puntos totales', value: user.points, icon: '⭐', action: null },
          ].map((s) => (
            <button
              key={s.label}
              onClick={s.action || undefined}
              className={`simul-card p-5 text-left ${s.action ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>{s.value}</div>
              <div className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter' }}>{s.label}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2 simul-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}>Actividad reciente</h2>
              <button onClick={() => navigate('/buscar')} className="text-sm text-[#C8102E] font-semibold hover:underline" style={{ fontFamily: 'Montserrat' }}>Ver todo</button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { text: 'Tu proyecto "Sistema Blockchain para Títulos" está en revisión', time: 'Hace 2 días', icon: '⏳', color: '#D97706' },
                { text: 'Ganaste la insignia "Primer Aporte" por tu contribución', time: 'Hace 5 días', icon: '🏅', color: '#C9A84C' },
                { text: 'Comentaste en "Plataforma de Gestión Académica con IA"', time: 'Hace 1 semana', icon: '💬', color: '#2563EB' },
                { text: 'Subiste al Nivel 4 — ¡Sigue así!', time: 'Hace 2 semanas', icon: '🎯', color: '#059669' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#F9FAFB] rounded-xl">
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800" style={{ fontFamily: 'Inter' }}>{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="simul-card p-6">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-5">Acciones rápidas</h2>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('/proponer-contenido')} className="btn-primary w-full py-3">Proponer proyecto</button>
              <button onClick={() => navigate('/buscar')} className="btn-secondary w-full py-3">Explorar contenido</button>
              <button onClick={() => navigate('/favoritos')} className="w-full py-3 rounded-xl bg-[#F9FAFB] text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Montserrat' }}>Mis favoritos</button>
              <button onClick={() => navigate('/ranking')} className="w-full py-3 rounded-xl bg-[#FFF8E7] font-semibold text-sm hover:bg-[#FEF3C7] transition-colors" style={{ fontFamily: 'Montserrat', color: '#C9A84C' }}>Ver ranking ⭐</button>
            </div>
            <div className="mt-5 p-4 rounded-xl border border-[#C9A84C]/30 bg-[#FFF8E7]">
              <p className="text-xs font-semibold" style={{ color: '#C9A84C', fontFamily: 'Montserrat' }}>💡 Consejo</p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Inter' }}>Proponer un proyecto aprobado te da +200 puntos y una insignia especial.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
