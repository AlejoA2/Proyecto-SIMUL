import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const CONTENT_TYPES = [
  { id: 'historia', label: 'Acontecimiento histórico', icon: '📜', desc: 'Hitos, fechas importantes, fundación' },
  { id: 'premio', label: 'Premio', icon: '🏆', desc: 'Reconocimientos nacionales e internacionales' },
  { id: 'proyecto', label: 'Proyecto', icon: '💡', desc: 'Proyectos de investigación o grado' },
  { id: 'evento', label: 'Evento', icon: '📅', desc: 'Congresos, hackathons, simposios' },
  { id: 'investigacion', label: 'Avance de investigación', icon: '🔬', desc: 'Publicaciones, semilleros, resultados' },
  { id: 'hall', label: 'Persona para Hall de la Fama', icon: '⭐', desc: 'Docentes, egresados destacados' },
];

const FORMS: Record<string, { label: string; type?: string; placeholder?: string; required?: boolean }[]> = {
  premio: [
    { label: 'Nombre del premio *', placeholder: 'Ej: Premio Nacional ACIS 2022' },
    { label: 'Entidad otorgante *', placeholder: 'Ej: Asociación Colombiana de Ingenieros de Sistemas' },
    { label: 'Año *', type: 'number', placeholder: '2024' },
    { label: 'Categoría', placeholder: 'Ej: Innovación en Software' },
    { label: 'Equipo / Persona galardonada *', placeholder: 'Nombre completo o nombre del equipo' },
    { label: 'Descripción *', type: 'textarea', placeholder: 'Describe el logro, el proceso de selección y su impacto...' },
  ],
  hall: [
    { label: 'Nombre completo *', placeholder: 'Ej: Dr. Ricardo Montoya' },
    { label: 'Cargo / Rol en el programa *', placeholder: 'Ej: Docente investigador, Egresado emprendedor' },
    { label: 'Año de ingreso al Hall *', type: 'number', placeholder: '2024' },
    { label: 'Correo electrónico', type: 'email', placeholder: 'correo@unilibre.edu.co' },
    { label: 'Principales logros *', type: 'textarea', placeholder: 'Describe los logros, publicaciones, empresas fundadas, cargos notables...' },
    { label: 'Vínculo con la Universidad Libre *', placeholder: 'Egresado 2005, Docente desde 2010, etc.' },
  ],
  proyecto: [
    { label: 'Nombre del proyecto *', placeholder: 'Título descriptivo del proyecto' },
    { label: 'Año *', type: 'number', placeholder: '2024' },
    { label: 'Integrantes *', placeholder: 'Nombres separados por coma' },
    { label: 'Tecnologías utilizadas', placeholder: 'Python, React, Arduino...' },
    { label: 'Descripción *', type: 'textarea', placeholder: 'Problema, metodología, resultados...' },
  ],
  default: [
    { label: 'Título *', placeholder: 'Título del contenido' },
    { label: 'Año *', type: 'number', placeholder: '2024' },
    { label: 'Responsable *', placeholder: 'Persona o equipo responsable' },
    { label: 'Descripción *', type: 'textarea', placeholder: 'Descripción detallada del contenido...' },
  ],
};

export default function RegisterContentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }

  const [selectedType, setSelectedType] = useState('');
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentType = CONTENT_TYPES.find((t) => t.id === selectedType);
  const fields = FORMS[selectedType] || FORMS['default'];

  const handleNext = () => {
    if (!selectedType) return;
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1400);
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center max-w-md p-8 animate-fade-in">
          <div className="text-6xl mb-4">📋</div>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28 }}>Contenido enviado a validación</h2>
          <p className="text-gray-500 mt-3" style={{ fontFamily: 'Inter' }}>El contenido fue registrado y enviado a la bandeja del administrador para su aprobación.</p>
          <div className="flex gap-3 mt-8 justify-center">
            <button onClick={() => navigate('/adjuntar-evidencias')} className="btn-secondary">Adjuntar evidencias</button>
            <button onClick={() => navigate('/dashboard/docente')} className="btn-primary">Volver al dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="pt-16 min-h-screen bg-[#F9FAFB]">
        <div className="max-w-[760px] mx-auto px-6 py-12">
          <button onClick={() => setStep('select')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-6" style={{ fontFamily: 'Inter' }}>← Cambiar tipo</button>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">{currentType?.icon}</span>
            <div>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>Registrar: {currentType?.label}</h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter' }}>{currentType?.desc}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="simul-card p-8 flex flex-col gap-5">
            {fields.map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={formValues[field.label] || ''}
                    onChange={(e) => setFormValues((p) => ({ ...p, [field.label]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] resize-none"
                    style={{ fontFamily: 'Inter' }}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={formValues[field.label] || ''}
                    onChange={(e) => setFormValues((p) => ({ ...p, [field.label]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                    style={{ fontFamily: 'Inter' }}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => navigate('/adjuntar-evidencias')} className="btn-secondary flex-1">Adjuntar evidencias</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Guardando...
                  </span>
                ) : 'Enviar a validación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[900px] mx-auto px-6 py-12">
        <button onClick={() => navigate('/dashboard/docente')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-6" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Registrar contenido</h1>
        <p className="text-gray-500 mt-2 mb-8" style={{ fontFamily: 'Inter' }}>Selecciona el tipo de contenido que deseas registrar en el museo.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTENT_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`simul-card p-6 text-left transition-all ${selectedType === t.id ? 'ring-2 ring-[#C8102E] bg-[#FEF2F2]' : 'hover:bg-gray-50'}`}
            >
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>{t.label}</h3>
              <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter' }}>{t.desc}</p>
              {selectedType === t.id && (
                <div className="mt-3 flex items-center gap-1 text-[#C8102E] text-sm font-semibold" style={{ fontFamily: 'Montserrat' }}>
                  ✓ Seleccionado
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={handleNext} disabled={!selectedType} className="btn-primary px-10 py-3.5 text-base">
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}
