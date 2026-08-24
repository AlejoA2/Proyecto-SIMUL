import { useNavigate, useSearchParams } from 'react-router';

const CATEGORIES = [
  { id: 'historia', label: 'Historia', icon: '📜', desc: 'Hitos, fundación y evolución del programa desde 1989', count: 18, color: '#7C3AED' },
  { id: 'premios', label: 'Premios', icon: '🏆', desc: 'Reconocimientos nacionales e internacionales obtenidos', count: 47, color: '#D97706' },
  { id: 'proyectos', label: 'Proyectos', icon: '💡', desc: 'Proyectos estudiantiles destacados de grado y semillero', count: 134, color: '#2563EB' },
  { id: 'investigacion', label: 'Investigación', icon: '🔬', desc: 'Publicaciones, semilleros y avances científicos', count: 62, color: '#DC2626' },
  { id: 'eventos', label: 'Eventos', icon: '📅', desc: 'Hackathons, conferencias, simposios y actividades', count: 89, color: '#059669' },
  { id: 'hall', label: 'Hall de la Fama', icon: '⭐', desc: 'Docentes, egresados y personas que dejaron huella', count: 24, color: '#C9A84C' },
  { id: 'galeria', label: 'Galería Histórica', icon: '🖼️', desc: 'Fotografías y documentos históricos del programa', count: 203, color: '#DB2777' },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const selectedCat = params.get('cat');

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F9FAFB] border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <p className="text-[#C8102E] font-bold text-sm tracking-widest mb-2 uppercase" style={{ fontFamily: 'Montserrat' }}>Museo Digital</p>
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: '#1A1A1A' }}>Explorar contenido</h1>
          <p className="text-gray-500 mt-3 text-lg max-w-xl" style={{ fontFamily: 'Inter' }}>
            Selecciona una categoría para explorar el archivo histórico del Programa de Ingeniería de Sistemas.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/buscar?cat=${cat.id}`)}
              className={`simul-card p-6 text-left transition-all ${selectedCat === cat.id ? 'ring-2 ring-[#C8102E]' : ''}`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${cat.color}15` }}
              >
                {cat.icon}
              </div>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>{cat.label}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed" style={{ fontFamily: 'Inter' }}>{cat.desc}</p>
              <div className="flex items-center justify-between mt-5">
                <span className="text-sm font-semibold" style={{ color: cat.color, fontFamily: 'Montserrat' }}>
                  {cat.count} registros
                </span>
                <span className="text-gray-300">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Or search */}
        <div className="mt-16 bg-[#FEF2F2] rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, color: '#1A1A1A' }}>¿Buscas algo específico?</h3>
            <p className="text-gray-500 mt-2" style={{ fontFamily: 'Inter' }}>Usa el buscador avanzado con filtros por año, autor, tipo y más.</p>
          </div>
          <button onClick={() => navigate('/buscar')} className="btn-primary text-base px-8 py-3 shrink-0">
            Ir al buscador
          </button>
        </div>
      </div>
    </div>
  );
}
