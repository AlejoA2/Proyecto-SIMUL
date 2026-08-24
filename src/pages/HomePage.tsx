import { useNavigate } from 'react-router';

const QUICK_ACCESS = [
  {
    title: 'Historia del Programa',
    desc: '35 años de excelencia académica y hitos institucionales',
    icon: '📜',
    cat: 'historia',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format',
  },
  {
    title: 'Logros y Premios',
    desc: 'Reconocimientos nacionales e internacionales',
    icon: '🏆',
    cat: 'premios',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&h=400&fit=crop&auto=format',
  },
  {
    title: 'Proyectos Destacados',
    desc: 'Innovaciones tecnológicas de nuestros estudiantes',
    icon: '💡',
    cat: 'proyectos',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&auto=format',
  },
  {
    title: 'Investigación',
    desc: 'Semilleros, publicaciones y avances científicos',
    icon: '🔬',
    cat: 'investigacion',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop&auto=format',
  },
  {
    title: 'Eventos',
    desc: 'Hackathons, conferencias y actividades académicas',
    icon: '📅',
    cat: 'eventos',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop&auto=format',
  },
  {
    title: 'Hall de la Fama',
    desc: 'Personas que han marcado la historia del programa',
    icon: '⭐',
    cat: 'hall',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop&auto=format',
  },
];

const STATS = [
  { value: '35+', label: 'Años de historia' },
  { value: '4.800+', label: 'Egresados' },
  { value: '120+', label: 'Premios y reconocimientos' },
  { value: '340+', label: 'Proyectos registrados' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#C8102E]" style={{ minHeight: 520 }}>
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1440&h=600&fit=crop&auto=format)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.95) 50%, rgba(160,13,36,0.8))' }} />
        <div className="relative max-w-[1440px] mx-auto px-8 py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-sm font-medium mb-6" style={{ fontFamily: 'Montserrat' }}>
              <span style={{ color: '#C9A84C' }}>✦</span> Museo Digital Interactivo
            </div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 'clamp(40px,5vw,68px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              35 años construyendo<br />
              <span style={{ color: '#E2C06A' }}>el futuro digital</span>
            </h1>
            <p className="mt-6 text-red-100 text-lg max-w-xl leading-relaxed" style={{ fontFamily: 'Inter' }}>
              Explora la historia, logros, proyectos y personas que han definido al Programa de Ingeniería de Sistemas de la Universidad Libre.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <button onClick={() => navigate('/explorar')} className="px-7 py-3.5 bg-white text-[#C8102E] rounded-xl font-bold text-base hover:bg-red-50 transition-colors" style={{ fontFamily: 'Montserrat' }}>
                Explorar el Museo
              </button>
              <button onClick={() => navigate('/buscar')} className="px-7 py-3.5 border-2 border-white/50 text-white rounded-xl font-semibold text-base hover:bg-white/10 transition-colors" style={{ fontFamily: 'Montserrat' }}>
                Buscar contenido
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white text-center backdrop-blur-sm">
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: '#E2C06A' }}>{s.value}</div>
                <div className="text-sm text-red-100 mt-1 font-medium" style={{ fontFamily: 'Inter' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#C8102E] font-bold text-sm tracking-widest mb-2 uppercase" style={{ fontFamily: 'Montserrat' }}>Acceso rápido</p>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Explora el museo</h2>
          </div>
          <button onClick={() => navigate('/explorar')} className="btn-secondary hidden md:block">
            Ver todo
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUICK_ACCESS.map((item) => (
            <button
              key={item.cat}
              onClick={() => navigate(`/buscar?cat=${item.cat}`)}
              className="simul-card overflow-hidden text-left group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-3xl">{item.icon}</div>
              </div>
              <div className="p-5">
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 17, color: '#1A1A1A' }}>{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed" style={{ fontFamily: 'Inter' }}>{item.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-[#C8102E] text-sm font-semibold" style={{ fontFamily: 'Montserrat' }}>
                  Explorar <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Hall of Fame preview */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center mb-12">
            <p className="font-bold text-sm tracking-widest mb-2 uppercase" style={{ fontFamily: 'Montserrat', color: '#C9A84C' }}>Legado</p>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: 'white' }}>Hall de la Fama</h2>
            <p className="text-gray-400 mt-3 text-base" style={{ fontFamily: 'Inter' }}>Personas que han marcado la historia del programa</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {[
              { name: 'Mg. Patricia Salcedo', role: 'Fundadora del Programa', img: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=200&h=200&fit=crop&auto=format' },
              { name: 'Dr. Ricardo Montoya', role: 'Investigador Distinguido', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&auto=format' },
              { name: 'Ing. Camila Vargas', role: 'Egresada Emprendedora', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&auto=format' },
            ].map((p) => (
              <button
                key={p.name}
                onClick={() => navigate('/explorar?cat=hall')}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#C9A84C]/40 group-hover:ring-[#C9A84C] transition-all">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold" style={{ fontFamily: 'Montserrat' }}>{p.name}</p>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'Inter' }}>{p.role}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate('/explorar?cat=hall')} className="btn-gold">Ver Hall de la Fama completo</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 32, color: '#1A1A1A' }}>¿Haces parte del programa?</h2>
          <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto" style={{ fontFamily: 'Inter' }}>
            Inicia sesión para comentar, guardar contenido en favoritos, proponer proyectos y participar en el ranking de gamificación.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary mt-8 text-base px-8 py-4">
            Iniciar sesión
          </button>
        </div>
      </section>
    </div>
  );
}
