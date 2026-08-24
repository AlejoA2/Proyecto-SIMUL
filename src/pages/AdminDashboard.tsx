import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const KPI_DATA = [
  { label: 'Premios registrados', value: 47, icon: '🏆', color: '#C9A84C', change: '+3 este mes' },
  { label: 'Proyectos publicados', value: 134, icon: '💡', color: '#2563EB', change: '+12 este mes' },
  { label: 'Eventos realizados', value: 89, icon: '📅', color: '#059669', change: '+4 este mes' },
  { label: 'Publicaciones científicas', value: 62, icon: '🔬', color: '#DC2626', change: '+2 este mes' },
  { label: 'Hall de la Fama', value: 24, icon: '⭐', color: '#C9A84C', change: '+1 este mes' },
  { label: 'Usuarios activos', value: 1842, icon: '👥', color: '#7C3AED', change: '+234 este mes' },
];

const MONTHLY = [32, 28, 45, 38, 52, 61, 49, 58, 70, 65, 80, 74];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('2024');
  if (!user) { navigate('/login'); return null; }

  const maxVal = Math.max(...MONTHLY);

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-[#C8102E]/20" />
            <div>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>Panel de administración</p>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20">
              {['2024', '2023', '2022', 'Todos'].map((y) => <option key={y}>{y}</option>)}
            </select>
            <button className="btn-primary flex items-center gap-2">
              <span>📊</span> Exportar reporte
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {KPI_DATA.map((k) => (
            <div key={k.label} className="simul-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{k.icon}</span>
                <span className="text-xs font-medium text-gray-400 hidden xl:block" style={{ fontFamily: 'Inter' }}>{k.change}</span>
              </div>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: k.color }}>{k.value.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1 leading-snug" style={{ fontFamily: 'Inter' }}>{k.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity chart */}
          <div className="lg:col-span-2 simul-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }}>Contenido registrado por mes</h2>
              <span className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>{dateRange}</span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {MONTHLY.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Inter' }}>{v}</span>
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80 cursor-default"
                    style={{ height: `${(v / maxVal) * 100}%`, background: '#C8102E', minHeight: 4 }}
                  />
                  <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="simul-card p-6">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-5">Gestión</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Bandeja de validación', badge: '5', path: '/admin/validacion', color: '#D97706', icon: '📬' },
                { label: 'Gestionar contenido', badge: null, path: '/admin/contenido', color: null, icon: '📂' },
                { label: 'Gestionar usuarios', badge: null, path: '/admin/usuarios', color: null, icon: '👥' },
                { label: 'Publicación y difusión', badge: null, path: '/admin/publicacion', color: null, icon: '📢' },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left border border-gray-100"
                >
                  <span className="text-xl">{a.icon}</span>
                  <span className="flex-1 font-semibold text-sm text-gray-800" style={{ fontFamily: 'Montserrat' }}>{a.label}</span>
                  {a.badge && (
                    <span className="w-6 h-6 rounded-full bg-[#D97706] text-white text-xs font-bold flex items-center justify-center" style={{ fontFamily: 'Montserrat' }}>{a.badge}</span>
                  )}
                  <span className="text-gray-300">›</span>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#C8102E]/20">
              <p className="text-xs font-bold text-[#C8102E] mb-1" style={{ fontFamily: 'Montserrat' }}>⚠ Pendientes de validación</p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Inter' }}>5 aportes esperan aprobación en la bandeja de validación.</p>
              <button onClick={() => navigate('/admin/validacion')} className="text-xs text-[#C8102E] font-bold mt-2 hover:underline" style={{ fontFamily: 'Montserrat' }}>Ver bandeja →</button>
            </div>
          </div>
        </div>

        {/* Impact metrics */}
        <div className="mt-6 simul-card p-6">
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-5">Impacto institucional</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Egresados en empresas TOP 100', value: '68%', sub: 'Colombia 2024' },
              { label: 'Tasa de empleabilidad', value: '94.3%', sub: 'Dentro de 6 meses' },
              { label: 'Empresas aliadas activas', value: 127, sub: 'Convenios vigentes' },
              { label: 'Satisfacción egresados', value: '4.6/5', sub: 'Encuesta 2024' },
            ].map((m) => (
              <div key={m.label} className="p-4 bg-[#F9FAFB] rounded-xl text-center">
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: '#C8102E' }}>{m.value}</div>
                <p className="text-sm font-semibold text-gray-700 mt-1" style={{ fontFamily: 'Montserrat' }}>{m.label}</p>
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter' }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
