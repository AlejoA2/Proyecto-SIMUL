import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Proyecto de Grado', 'Semillero de Investigación', 'Proyecto Extracurricular', 'Tesis de Maestría'];
const TECHNOLOGIES = ['React', 'Node.js', 'Python', 'Flutter', 'Java', 'TensorFlow', 'Arduino', 'Firebase', 'PostgreSQL', 'MongoDB'];

interface FormData {
  name: string;
  year: string;
  category: string;
  members: string;
  description: string;
  technologies: string[];
  results: string;
}

interface FormErrors {
  name?: string;
  year?: string;
  category?: string;
  members?: string;
  description?: string;
  results?: string;
}

export default function ProposeContentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }

  const [form, setForm] = useState<FormData>({ name: '', year: '', category: '', members: '', description: '', technologies: [], results: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<{ name: string; size: string; progress: number }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'El nombre del proyecto es obligatorio';
    if (!form.year) e.year = 'Indica el año del proyecto';
    if (!form.category) e.category = 'Selecciona una categoría';
    if (!form.members.trim()) e.members = 'Agrega al menos un integrante';
    if (form.description.trim().length < 50) e.description = 'La descripción debe tener al menos 50 caracteres';
    if (!form.results.trim()) e.results = 'Describe los resultados obtenidos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/mis-aportes'), 2000);
    }, 1500);
  };

  const toggleTech = (t: string) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(t) ? prev.technologies.filter((x) => x !== t) : [...prev.technologies, t],
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    dropped.forEach((file) => {
      const newFile = { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, progress: 0 };
      setFiles((prev) => [...prev, newFile]);
      // Simulate upload
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 30;
        if (p >= 100) { clearInterval(interval); p = 100; }
        setFiles((prev) => prev.map((f) => f.name === newFile.name ? { ...f, progress: Math.round(p) } : f));
      }, 300);
    });
  };

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 animate-fade-in">
          <div className="text-6xl mb-5">✅</div>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>¡Propuesta enviada!</h2>
          <p className="text-gray-500 mt-3" style={{ fontFamily: 'Inter' }}>
            Tu proyecto <strong>"{form.name}"</strong> fue enviado a revisión. Puedes seguir su estado en "Mis Aportes".
          </p>
          <p className="text-sm text-gray-400 mt-2" style={{ fontFamily: 'Inter' }}>Redirigiendo a Mis Aportes...</p>
        </div>
      </div>
    );
  }

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1" style={{ fontFamily: 'Inter' }}><span>⚠</span> {error}</p>}
    </div>
  );

  const inputClass = (err?: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 ${err ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-gray-200 focus:ring-[#C8102E]/20 focus:border-[#C8102E]'}`;

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard/estudiante')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C8102E] transition-colors mb-4" style={{ fontFamily: 'Inter' }}>
            ← Volver al dashboard
          </button>
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Proponer proyecto</h1>
          <p className="text-gray-500 mt-2" style={{ fontFamily: 'Inter' }}>Comparte tu trabajo con la comunidad del programa. Los proyectos son revisados antes de ser publicados.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="simul-card p-8">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-5">Información básica</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Field label="Nombre del proyecto *" error={errors.name}>
                  <input value={form.name} onChange={set('name')} className={inputClass(errors.name)} placeholder="Ej: Sistema de Detección de Plagio con NLP" style={{ fontFamily: 'Inter' }} />
                </Field>
              </div>
              <Field label="Año *" error={errors.year}>
                <select value={form.year} onChange={set('year')} className={inputClass(errors.year)} style={{ fontFamily: 'Inter' }}>
                  <option value="">Selecciona el año</option>
                  {[2024, 2023, 2022, 2021, 2020].map((y) => <option key={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="Categoría / Línea *" error={errors.category}>
                <select value={form.category} onChange={set('category')} className={inputClass(errors.category)} style={{ fontFamily: 'Inter' }}>
                  <option value="">Selecciona la categoría</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Integrantes *" error={errors.members}>
                  <input value={form.members} onChange={set('members')} className={inputClass(errors.members)} placeholder="Nombres completos separados por coma" style={{ fontFamily: 'Inter' }} />
                </Field>
              </div>
            </div>
          </div>

          <div className="simul-card p-8">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-5">Detalle del proyecto</h2>
            <div className="flex flex-col gap-5">
              <Field label="Descripción *" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={5}
                  className={`${inputClass(errors.description)} resize-none`}
                  placeholder="Describe el problema que resuelve, la metodología, el alcance y el impacto del proyecto (mín. 50 caracteres)"
                  style={{ fontFamily: 'Inter' }}
                />
                <p className={`text-xs mt-1 ${form.description.length < 50 ? 'text-gray-400' : 'text-green-600'}`} style={{ fontFamily: 'Inter' }}>
                  {form.description.length}/50 caracteres mínimos
                </p>
              </Field>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>Tecnologías utilizadas</label>
                <div className="flex flex-wrap gap-2">
                  {TECHNOLOGIES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.technologies.includes(t) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                      style={{ fontFamily: 'Inter' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Resultados obtenidos *" error={errors.results}>
                <textarea
                  value={form.results}
                  onChange={set('results')}
                  rows={3}
                  className={`${inputClass(errors.results)} resize-none`}
                  placeholder="Métricas, impacto, publicaciones, premios derivados, etc."
                  style={{ fontFamily: 'Inter' }}
                />
              </Field>
            </div>
          </div>

          {/* File upload */}
          <div className="simul-card p-8">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18 }} className="mb-2">Evidencias</h2>
            <p className="text-gray-500 text-sm mb-5" style={{ fontFamily: 'Inter' }}>Adjunta fotos, documentos, código o presentaciones (PDF, ZIP, PNG, MP4 — máx. 50 MB por archivo)</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? 'border-[#C8102E] bg-[#FEF2F2]' : 'border-gray-300 bg-[#F9FAFB] hover:border-gray-400'}`}
            >
              <div className="text-4xl mb-3">{dragging ? '📂' : '☁️'}</div>
              <p className="font-semibold text-gray-700" style={{ fontFamily: 'Montserrat' }}>Arrastra archivos aquí</p>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>o haz clic para seleccionar</p>
              <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => {
                if (!e.target.files) return;
                Array.from(e.target.files).forEach((file) => {
                  const nf = { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, progress: 0 };
                  setFiles((prev) => [...prev, nf]);
                  let p = 0;
                  const iv = setInterval(() => { p += Math.random() * 40; if (p >= 100) { p = 100; clearInterval(iv); } setFiles((prev) => prev.map((f) => f.name === nf.name ? { ...f, progress: Math.round(p) } : f)); }, 200);
                });
              }} />
              <label htmlFor="file-upload" className="mt-4 inline-block btn-secondary cursor-pointer">Seleccionar archivos</label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl">
                    <span className="text-xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: 'Montserrat' }}>{f.name}</p>
                        <span className="text-xs text-gray-400 ml-2 shrink-0">{f.size}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A84C] rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{f.progress < 100 ? `${f.progress}%` : 'Cargado ✓'}</p>
                    </div>
                    <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => navigate('/dashboard/estudiante')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Enviando...
                </span>
              ) : 'Enviar propuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
