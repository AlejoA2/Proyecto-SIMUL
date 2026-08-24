import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CONTENT_ITEMS } from '../data/content';

const CATEGORIES = ['Todos', 'Historia', 'Premio', 'Proyecto', 'Investigación', 'Evento', 'Hall de la Fama'];
const YEARS = ['Todos', '2024', '2023', '2022', '2021', '2020', '2019', 'Antes de 2019'];
const CAT_MAP: Record<string, string> = {
  historia: 'Historia', premios: 'Premio', proyectos: 'Proyecto',
  investigacion: 'Investigación', eventos: 'Evento', hall: 'Hall de la Fama',
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialCat = params.get('cat') ? CAT_MAP[params.get('cat')!] || 'Todos' : 'Todos';

  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(initialCat);
  const [year, setYear] = useState('Todos');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(CONTENT_ITEMS.filter((i) => i.status === 'publicado'));

  // Sincroniza el filtro cuando se navega entre categorías desde la navbar (p.ej. /buscar?cat=eventos -> ?cat=hall)
  useEffect(() => {
    setCategory(params.get('cat') ? CAT_MAP[params.get('cat')!] || 'Todos' : 'Todos');
  }, [params]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = CONTENT_ITEMS.filter((i) => i.status === 'publicado');
      if (query) filtered = filtered.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()) || i.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())));
      if (category !== 'Todos') filtered = filtered.filter((i) => i.category === category);
      if (year !== 'Todos') {
        if (year === 'Antes de 2019') filtered = filtered.filter((i) => i.year < 2019);
        else filtered = filtered.filter((i) => i.year === parseInt(year));
      }
      setResults(filtered);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, category, year]);

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Search header */}
      <div className="bg-[#C8102E] py-10">
        <div className="max-w-[1440px] mx-auto px-8">
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 32, color: 'white' }} className="mb-5">Buscar en el Museo</h1>
          <div className="relative max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar proyectos, premios, eventos, personas..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              style={{ fontFamily: 'Inter' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-8 flex gap-8">
        {/* Filters sidebar */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="sticky top-20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4" style={{ fontFamily: 'Montserrat' }}>Filtros</h3>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>Categoría</p>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${category === c ? 'bg-[#C8102E] text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={{ fontFamily: 'Inter' }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>Año</p>
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${year === y ? 'bg-[#C8102E] text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={{ fontFamily: 'Inter' }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter' }}>
              {loading ? 'Buscando...' : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`}
            </p>
            {/* Mobile filters */}
            <div className="flex gap-2 lg:hidden">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="simul-card overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-100" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-5">🔍</div>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, color: '#1A1A1A' }}>Sin resultados</h3>
              <p className="text-gray-500 mt-2 max-w-sm" style={{ fontFamily: 'Inter' }}>
                No encontramos contenido que coincida con tu búsqueda. Prueba con otros términos o ajusta los filtros.
              </p>
              <button onClick={() => { setQuery(''); setCategory('Todos'); setYear('Todos'); }} className="btn-secondary mt-6">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/contenido/${item.id}`)}
                  className="simul-card overflow-hidden text-left group animate-fade-in"
                >
                  <div className="h-44 overflow-hidden bg-gray-100 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className={`tag ${item.categoryTag}`}>{item.category}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2" style={{ fontFamily: 'Montserrat' }}>{item.title}</h3>
                    <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Inter' }}>{item.year} · {item.author.split(',')[0]}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full" style={{ fontFamily: 'Inter' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
