import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CONTENT_ITEMS } from '../data/content';
import { useProposals } from '../context/ProposalsContext';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teachers, getProposalsByTeacher } = useProposals();
  if (!user) { navigate('/login'); return null; }

  const currentTeacher = teachers.find(t => t.email === user.email);
  const assignedProposals = currentTeacher ? getProposalsByTeacher(currentTeacher.id) : [];

  const myContent = CONTENT_ITEMS.filter((c) => c.author.includes('Patiño') || c.author.includes('Ruiz'));
  const stats = {
    publicado: myContent.filter((c) => c.status === 'publicado').length,
    pendiente: myContent.filter((c) => c.status === 'pendiente').length,
    rechazado: myContent.filter((c) => c.status === 'rechazado').length,
  };
  const total = myContent.length || 1;

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#C8102E]/20" />
            <div>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>Panel docente</p>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>{user.name}</h1>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>{user.email} · Docente</p>
            </div>
          </div>
          <button onClick={() => navigate('/registrar-contenido')} className="btn-primary">+ Registrar contenido</button>
        </div>

        {/* Level bar */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, color: '#E2C06A', fontSize: 18 }}>Nivel {user.level} — Experto</h3>
            <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: '#C9A84C' }}>{user.points} pts</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="gold-bar h-full" style={{ width: '75%' }} />
          </div>
          <div className="flex gap-2 mt-3">
            {user.badges.map((b) => (
              <span key={b} className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#C9A84C20', color: '#C9A84C', fontFamily: 'Montserrat' }}>🏅 {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content registered + mini chart */}
          <div className="lg:col-span-2 simul-card p-6">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-6">Contenido registrado</h2>

            {/* Bar chart */}
            <div className="flex items-end gap-6 mb-6 h-32">
              {[
                { label: 'Publicado', count: stats.publicado, color: '#059669' },
                { label: 'Pendiente', count: stats.pendiente, color: '#D97706' },
                { label: 'Rechazado', count: stats.rechazado, color: '#DC2626' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs font-bold" style={{ color: s.color, fontFamily: 'Montserrat' }}>{s.count}</span>
                  <div className="w-full rounded-t-lg transition-all" style={{ background: s.color + '20', border: `2px solid ${s.color}`, height: `${Math.max((s.count / total) * 100, 8)}%`, borderBottom: 'none' }} />
                  <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Content list */}
            {myContent.length === 0 ? (
              <div className="text-center py-8 text-gray-400" style={{ fontFamily: 'Inter' }}>Aún no has registrado contenido.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {myContent.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 p-3 bg-[#F9FAFB] rounded-xl">
                    <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate" style={{ fontFamily: 'Montserrat' }}>{c.title}</p>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>{c.year} · {c.category}</p>
                    </div>
                    <span className={`tag tag-${c.status}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="simul-card p-6">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-5">Acciones rápidas</h2>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate('/registrar-contenido')} className="btn-primary w-full py-3">Registrar contenido</button>
              <button onClick={() => navigate('/adjuntar-evidencias')} className="btn-secondary w-full py-3">Adjuntar evidencias</button>
              <button onClick={() => navigate('/buscar')} className="w-full py-3 rounded-xl bg-[#F9FAFB] text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Montserrat' }}>Explorar museo</button>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-sm text-gray-700 mb-3" style={{ fontFamily: 'Montserrat' }}>Tipos de contenido permitidos</h3>
              <div className="flex flex-col gap-1.5">
                {['Acontecimiento histórico', 'Premio', 'Proyecto', 'Evento', 'Avance de investigación', 'Persona para Hall de la Fama'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: 'Inter' }}>
                    <span className="text-[#C8102E]">✓</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Proyectos asignados como docente asesor */}
        <div className="mt-8 simul-card p-6">
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-6">Proyectos asignados como docente asesor</h2>
          {assignedProposals.length === 0 ? (
            <div className="text-center py-8 text-gray-400" style={{ fontFamily: 'Inter' }}>
              No tienes proyectos asignados como docente asesor aún.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {assignedProposals.map((proposal) => (
                <div key={proposal.id} className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate" style={{ fontFamily: 'Montserrat' }}>{proposal.name}</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>
                      {proposal.year} · {proposal.category} · Estudiante: {proposal.studentName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>
                      Integrantes: {proposal.members}
                    </p>
                  </div>
                  <span className={`tag tag-${proposal.status}`}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
