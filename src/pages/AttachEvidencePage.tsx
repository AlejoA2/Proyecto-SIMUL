import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useToast, ToastContainer } from '../components/Toast';

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  done: boolean;
  preview?: string;
}

const ICON_MAP: Record<string, string> = {
  pdf: '📄', zip: '📦', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', mp4: '🎬', doc: '📝', docx: '📝', ppt: '📊', pptx: '📊',
};

export default function AttachEvidencePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  if (!user) { navigate('/login'); return null; }

  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Informe_Final_SISTEC.pdf', size: '3.2 MB', type: 'pdf', progress: 100, done: true },
    { id: '2', name: 'Presentacion_Premio.pptx', size: '8.7 MB', type: 'pptx', progress: 68, done: false },
  ]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const addFiles = (newFiles: File[]) => {
    newFiles.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const nf: FileItem = {
        id: Math.random().toString(36).slice(2),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: ext,
        progress: 0,
        done: false,
      };
      setFiles((prev) => [...prev, nf]);
      let p = 0;
      const iv = setInterval(() => {
        p += Math.random() * 25 + 5;
        if (p >= 100) { p = 100; clearInterval(iv); setFiles((prev) => prev.map((f) => f.id === nf.id ? { ...f, progress: 100, done: true } : f)); }
        else setFiles((prev) => prev.map((f) => f.id === nf.id ? { ...f, progress: Math.round(p) } : f));
      }, 250);
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1500);
  };

  if (done) {
    return (
      <div className="pt-16 min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center max-w-md p-8 animate-fade-in">
          <div className="text-6xl mb-4">✅</div>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28 }}>Evidencias adjuntadas</h2>
          <p className="text-gray-500 mt-3" style={{ fontFamily: 'Inter' }}>Los {files.filter((f) => f.done).length} archivos fueron asociados al contenido y enviados a validación.</p>
          <button onClick={() => navigate('/dashboard/docente')} className="btn-primary mt-8 px-8">Volver al dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-[760px] mx-auto px-6 py-12">
        <button onClick={() => navigate('/registrar-contenido')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-6" style={{ fontFamily: 'Inter' }}>← Registrar contenido</button>
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Adjuntar evidencias</h1>
        <p className="text-gray-500 mt-2 mb-8" style={{ fontFamily: 'Inter' }}>Carga los archivos que respaldan el contenido registrado. Formatos aceptados: PDF, DOCX, PNG, JPG, MP4, ZIP.</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-6 ${dragging ? 'border-[#C8102E] bg-[#FEF2F2]' : 'border-gray-300 bg-white hover:border-[#C8102E]/50'}`}
        >
          <div className="text-5xl mb-4">{dragging ? '📂' : '☁️'}</div>
          <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 18, color: '#1A1A1A' }}>Arrastra tus archivos aquí</h3>
          <p className="text-gray-400 text-sm mt-2 mb-5" style={{ fontFamily: 'Inter' }}>o haz clic para seleccionar desde tu equipo</p>
          <input type="file" id="ev-upload" multiple className="hidden" onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); }} />
          <label htmlFor="ev-upload" className="btn-secondary cursor-pointer">Seleccionar archivos</label>
          <p className="text-xs text-gray-400 mt-4" style={{ fontFamily: 'Inter' }}>Máx. 50 MB por archivo · hasta 20 archivos</p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="simul-card overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }}>Archivos ({files.length})</h3>
              <span className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>{files.filter((f) => f.done).length} listos</span>
            </div>
            <div className="divide-y divide-gray-50">
              {files.map((f) => (
                <div key={f.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">{ICON_MAP[f.type] || '📎'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: 'Montserrat' }}>{f.name}</p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0" style={{ fontFamily: 'Inter' }}>{f.size}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${f.progress}%`, background: f.done ? '#059669' : '#C9A84C' }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ fontFamily: 'Inter', color: f.done ? '#059669' : '#D97706' }}>
                      {f.done ? '✓ Cargado correctamente' : `Cargando... ${f.progress}%`}
                    </p>
                  </div>
                  <button
                    onClick={() => { setFiles((prev) => prev.filter((x) => x.id !== f.id)); addToast('Archivo eliminado', 'info'); }}
                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <button onClick={() => navigate('/dashboard/docente')} className="btn-secondary">Omitir por ahora</button>
          <button onClick={handleSubmit} disabled={submitting || files.length === 0} className="btn-primary px-8">
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Guardando...
              </span>
            ) : 'Guardar y enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
