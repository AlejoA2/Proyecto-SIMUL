import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const CHECKLIST = [
  { label: 'Contenido visible para la comunidad', done: true },
  { label: 'Actualización de línea del tiempo', done: true },
  { label: 'Notificaciones enviadas a suscriptores', done: true },
  { label: 'Indicadores de impacto actualizados', done: true },
  { label: 'Contenido indexado para búsqueda', done: true },
  { label: 'Puntos de gamificación asignados al autor', done: true },
];

export default function PublicationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB] flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6 py-12 animate-fade-in">
        <div className="simul-card p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: '#1A1A1A' }}>¡Contenido publicado!</h1>
          <p className="text-gray-500 mt-3 mb-8" style={{ fontFamily: 'Inter' }}>
            El contenido fue aprobado y está ahora visible en el museo para toda la comunidad del programa.
          </p>

          {/* Checklist */}
          <div className="text-left bg-[#F9FAFB] rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>Acciones ejecutadas automáticamente</h3>
            <div className="flex flex-col gap-3">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Inter' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/admin/validacion')} className="btn-primary w-full py-3.5">
              Volver a la bandeja de validación
            </button>
            <button onClick={() => navigate('/buscar')} className="btn-secondary w-full py-3.5">
              Ver contenido publicado
            </button>
            <button onClick={() => navigate('/dashboard/admin')} className="w-full py-3 text-sm text-gray-500 hover:text-[#C8102E] transition-colors" style={{ fontFamily: 'Inter' }}>
              Ir al dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
