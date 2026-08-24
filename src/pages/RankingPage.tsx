import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { RANKING_DATA } from '../data/content';

const LEVEL_NAMES = ['', 'Curioso', 'Explorador', 'Colaborador', 'Contribuidor', 'Innovador', 'Investigador', 'Referente', 'Experto', 'Maestro', 'Leyenda'];
const sorted = [...RANKING_DATA].sort((a, b) => b.points - a.points).map((r, i) => ({ ...r, rank: i + 1 }));

export default function RankingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }

  const meEntry = sorted.find((r) => r.isCurrentUser);

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[900px] mx-auto px-6 py-10">
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard/estudiante')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-3" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Ranking de Gamificación</h1>
          <p className="text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>Clasificación de miembros de la comunidad por puntos acumulados</p>
        </div>

        {/* My position */}
        {meEntry && (
          <div className="mb-6 p-5 rounded-2xl border-2 border-[#C9A84C] bg-[#FFF8E7]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] mb-2" style={{ fontFamily: 'Montserrat' }}>Tu posición</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C] flex items-center justify-center text-white font-black text-lg" style={{ fontFamily: 'Montserrat' }}>#{meEntry.rank}</div>
              <img src={meEntry.avatar} alt={meEntry.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-bold text-gray-900" style={{ fontFamily: 'Montserrat' }}>{meEntry.name}</p>
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>Nivel {user.level} — {LEVEL_NAMES[user.level]}</p>
              </div>
              <div className="text-right">
                <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: '#C9A84C' }}>{meEntry.points}</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>puntos</p>
              </div>
            </div>
          </div>
        )}

        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-8 h-32">
          {[sorted[1], sorted[0], sorted[2]].filter(Boolean).map((r, i) => {
            const heights = [100, 128, 80];
            const medals = ['🥈', '🥇', '🥉'];
            const colors = ['#9CA3AF', '#C9A84C', '#CD7F32'];
            return (
              <div key={r.rank} className="flex flex-col items-center gap-1" style={{ height: heights[i] }}>
                <span className="text-2xl">{medals[i]}</span>
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover ring-2" style={{ '--tw-ring-color': colors[i] } as React.CSSProperties} />
                <div className="flex-1 w-20 rounded-t-lg flex items-end justify-center pb-2" style={{ background: `${colors[i]}20`, borderTop: `2px solid ${colors[i]}` }}>
                  <span className="text-xs font-bold" style={{ color: colors[i], fontFamily: 'Montserrat' }}>#{r.rank}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="simul-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-12" style={{ fontFamily: 'Montserrat' }}>#</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Miembro</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Nivel</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Insignias</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.rank}
                  className={`border-b border-gray-50 transition-colors ${r.isCurrentUser ? 'bg-[#FFF8E7] ring-1 ring-[#C9A84C] relative' : 'hover:bg-[#F9FAFB]'}`}
                >
                  <td className="px-6 py-4">
                    <span className={`font-black ${r.rank <= 3 ? 'text-[#C9A84C]' : 'text-gray-400'}`} style={{ fontFamily: 'Montserrat', fontSize: r.rank <= 3 ? 18 : 14 }}>
                      {r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900" style={{ fontFamily: 'Montserrat' }}>{r.name}</p>
                        {r.isCurrentUser && <span className="text-xs text-[#C9A84C] font-bold" style={{ fontFamily: 'Montserrat' }}>Tú</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-lg text-gray-600" style={{ fontFamily: 'Montserrat' }}>
                      Nv {r.level} · {LEVEL_NAMES[r.level] || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex gap-1">{r.badges.map((b, i) => <span key={i} className="text-base">{b}</span>)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 800, color: r.isCurrentUser ? '#C9A84C' : '#1A1A1A' }}>{r.points.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-1" style={{ fontFamily: 'Inter' }}>pts</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
