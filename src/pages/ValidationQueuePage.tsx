import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { useToast, ToastContainer } from '../components/Toast';

interface PendingItem {
  id: string;
  title: string;
  type: string;
  author: string;
  date: string;
  image: string;
  description: string;
  tags: string[];
  documents: { name: string; size: string }[];
}

const INITIAL_QUEUE: PendingItem[] = [
  { id: 'p1', title: 'Sistema Blockchain para Verificación de Títulos Académicos', type: 'Proyecto', author: 'Juan Pérez', date: '2024-11-15', image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=400&fit=crop', description: 'Sistema descentralizado para emisión y verificación de diplomas universitarios mediante smart contracts en Ethereum. El proyecto incluye un frontend React y contratos Solidity desplegados en testnet.', tags: ['Blockchain', 'Solidity', 'React'], documents: [{ name: 'Informe.pdf', size: '2.1 MB' }, { name: 'Codigo.zip', size: '18 MB' }] },
  { id: 'p2', title: 'Semillero NLP Lab — Análisis de Sentimientos en Redes Sociales', type: 'Investigación', author: 'Dra. Ana Ramírez', date: '2024-11-12', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', description: 'Avance de investigación del semillero NLP Lab sobre clasificación de sentimientos en Twitter usando transformers fine-tuned en español. F1-score de 91.2% en dataset colombiano.', tags: ['NLP', 'Transformers', 'Python'], documents: [{ name: 'Preprint.pdf', size: '1.5 MB' }] },
  { id: 'p3', title: 'Hackathon FinTech 2024 — Primer Lugar', type: 'Premio', author: 'Equipo CodeBankers', date: '2024-11-08', image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&h=400&fit=crop', description: 'El equipo CodeBankers obtuvo el primer lugar en el Hackathon FinTech Colombia 2024 con una solución de microcréditos basada en scoring alternativo.', tags: ['FinTech', 'Hackathon', 'ML'], documents: [{ name: 'Diploma.pdf', size: '0.4 MB' }, { name: 'Presentacion.pdf', size: '5.2 MB' }] },
  { id: 'p4', title: 'Congreso SISTEC 2024 — Convocatoria y Resultados', type: 'Evento', author: 'Comité SISTEC', date: '2024-11-05', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', description: 'El XVIII Congreso Nacional SISTEC reunió a 320 ponentes de 28 universidades. Se presentaron 64 ponencias en las líneas de IA, ciberseguridad, IoT y computación en la nube.', tags: ['Congreso', 'Evento', 'SISTEC'], documents: [{ name: 'Memorias.pdf', size: '9.8 MB' }] },
  { id: 'p5', title: 'Dr. Alejandro Ospina — Candidato Hall de la Fama', type: 'Hall de la Fama', author: 'Coordinación Académica', date: '2024-11-01', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop', description: 'Candidatura del Dr. Alejandro Ospina, egresado 1998 y CEO de DataBridge, firma de análisis de datos con operaciones en 5 países latinoamericanos.', tags: ['Hall de la Fama', 'Egresado'], documents: [{ name: 'Hoja_de_vida.pdf', size: '1.2 MB' }] },
];

export default function ValidationQueuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  if (!user) { navigate('/login'); return null; }

  const [queue, setQueue] = useState<PendingItem[]>(INITIAL_QUEUE);
  const [selected, setSelected] = useState<PendingItem | null>(INITIAL_QUEUE[0]);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectText, setRejectText] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [approving, setApproving] = useState(false);

  const handleApprove = () => {
    if (!selected) return;
    setApproving(true);
    setTimeout(() => {
      setQueue((prev) => prev.filter((i) => i.id !== selected.id));
      addToast('Contenido publicado exitosamente', 'success');
      setApproving(false);
      navigate('/admin/publicacion');
    }, 1000);
  };

  const handleReject = () => {
    if (!rejectText.trim()) { setRejectError('Las observaciones son obligatorias para rechazar'); return; }
    if (!selected) return;
    setQueue((prev) => prev.filter((i) => i.id !== selected.id));
    addToast('Contenido rechazado. Se notificó al autor.', 'info');
    setRejectModal(false);
    setRejectText('');
    setSelected(queue.find((i) => i.id !== selected.id) || null);
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="mb-6">
          <button onClick={() => navigate('/dashboard/admin')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-3" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
          <div className="flex items-center justify-between">
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Bandeja de Validación</h1>
            <span className="px-4 py-2 rounded-xl bg-[#FEF3C7] text-[#92400E] font-bold text-sm" style={{ fontFamily: 'Montserrat' }}>{queue.length} pendientes</span>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in">
            <div className="text-6xl mb-5">✅</div>
            <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22 }}>Bandeja vacía</h3>
            <p className="text-gray-500 mt-2" style={{ fontFamily: 'Inter' }}>No hay contenido pendiente de validación.</p>
            <button onClick={() => navigate('/dashboard/admin')} className="btn-primary mt-6">Volver al dashboard</button>
          </div>
        ) : (
          <div className="flex gap-6" style={{ height: 'calc(100vh - 220px)' }}>
            {/* Queue list */}
            <div className="w-80 shrink-0 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {queue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === item.id ? 'border-[#C8102E] bg-[#FEF2F2]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold" style={{ fontFamily: 'Montserrat' }}>{item.type}</span>
                    </div>
                    <p className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2" style={{ fontFamily: 'Montserrat' }}>{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter' }}>{item.author} · {item.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="flex-1 simul-card overflow-y-auto animate-slide-right">
                <div className="h-56 overflow-hidden bg-gray-100 rounded-t-xl">
                  <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag tag-pendiente">Pendiente</span>
                    <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>{selected.type} · {selected.date}</span>
                  </div>
                  <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 22, color: '#1A1A1A' }}>{selected.title}</h2>
                  <p className="text-sm text-gray-500 mt-1 mb-4" style={{ fontFamily: 'Inter' }}>Enviado por: <strong>{selected.author}</strong></p>
                  <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter' }}>{selected.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {selected.tags.map((t) => <span key={t} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full" style={{ fontFamily: 'Inter' }}>{t}</span>)}
                  </div>

                  {/* Documents */}
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-700 mb-3" style={{ fontFamily: 'Montserrat' }}>Evidencias adjuntas</h3>
                    {selected.documents.map((d) => (
                      <div key={d.name} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl mb-2">
                        <span className="text-xl">📄</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ fontFamily: 'Montserrat' }}>{d.name}</p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>{d.size}</p>
                        </div>
                        <button className="text-xs text-[#C8102E] font-semibold hover:underline" style={{ fontFamily: 'Montserrat' }}>Descargar</button>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => setRejectModal(true)}
                      className="flex-1 py-3.5 rounded-xl border-2 border-red-500 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      ✕ Rechazar
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={approving}
                      className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-colors"
                      style={{ background: '#C9A84C', color: 'white', fontFamily: 'Montserrat' }}
                    >
                      {approving ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Publicando...
                        </span>
                      ) : '✓ Aprobar y publicar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject modal */}
      <Modal open={rejectModal} onClose={() => { setRejectModal(false); setRejectText(''); setRejectError(''); }} title="Rechazar contenido">
        <div>
          <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter' }}>
            Proporciona las observaciones al autor para que pueda corregir y reenviar el contenido. Este campo es <strong>obligatorio</strong>.
          </p>
          <textarea
            value={rejectText}
            onChange={(e) => { setRejectText(e.target.value); setRejectError(''); }}
            rows={4}
            placeholder="Describe qué debe mejorar el autor para que el contenido sea aprobado..."
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none ${rejectError ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#C8102E]/20 focus:border-[#C8102E]'}`}
            style={{ fontFamily: 'Inter' }}
          />
          {rejectError && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>⚠ {rejectError}</p>}
          <div className="flex gap-3 mt-5 justify-end">
            <button onClick={() => { setRejectModal(false); setRejectText(''); }} className="btn-secondary">Cancelar</button>
            <button onClick={handleReject} className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors" style={{ fontFamily: 'Montserrat' }}>Rechazar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
