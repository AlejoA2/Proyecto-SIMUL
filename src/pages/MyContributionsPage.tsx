import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const MY_ITEMS = [
  { id: '7', title: 'Sistema Blockchain para Títulos Académicos', type: 'Proyecto', date: '2024-11-15', status: 'pendiente' as const, observations: '' },
  { id: '8', title: 'Chatbot de Orientación para Estudiantes de Primer Semestre', type: 'Proyecto', date: '2024-09-03', status: 'rechazado' as const, observations: 'El proyecto no incluye evidencias suficientes de pruebas con usuarios reales. Revisar métricas de evaluación del modelo y adjuntar al menos 2 sesiones de testing documentadas.' },
  { id: 'old1', title: 'App para gestión de notas académicas', type: 'Proyecto', date: '2023-05-20', status: 'publicado' as const, observations: '' },
];

export default function MyContributionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<typeof MY_ITEMS[0] | null>(null);
  if (!user) { navigate('/login'); return null; }

  const statusColor: Record<string, string> = { pendiente: 'tag-pendiente', publicado: 'tag-publicado', rechazado: 'tag-rechazado' };
  const statusLabel: Record<string, string> = { pendiente: 'Pendiente', publicado: 'Publicado', rechazado: 'Rechazado' };

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard/estudiante')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-3" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Mis Aportes</h1>
            <p className="text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>Historial de tus propuestas y contribuciones al museo</p>
          </div>
          <button onClick={() => navigate('/proponer-contenido')} className="btn-primary">+ Nueva propuesta</button>
        </div>

        {/* Summary chips */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { label: 'Total', count: MY_ITEMS.length, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pendiente', count: MY_ITEMS.filter((i) => i.status === 'pendiente').length, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Publicado', count: MY_ITEMS.filter((i) => i.status === 'publicado').length, color: 'bg-green-50 text-green-700' },
            { label: 'Rechazado', count: MY_ITEMS.filter((i) => i.status === 'rechazado').length, color: 'bg-red-50 text-red-700' },
          ].map((s) => (
            <span key={s.label} className={`px-4 py-2 rounded-xl text-sm font-semibold ${s.color}`} style={{ fontFamily: 'Montserrat' }}>
              {s.label}: {s.count}
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="simul-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>Proyecto</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {MY_ITEMS.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm leading-snug" style={{ fontFamily: 'Montserrat' }}>{item.title}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-gray-500" style={{ fontFamily: 'Inter' }}>{item.type}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-gray-400 text-xs" style={{ fontFamily: 'Inter' }}>{item.date}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`tag ${statusColor[item.status]}`}>{statusLabel[item.status]}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-sm font-semibold text-[#C8102E] hover:underline"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      {item.status === 'rechazado' ? 'Ver motivo' : 'Ver detalle'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail modal */}
        <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.status === 'rechazado' ? 'Proyecto rechazado — Motivo' : 'Detalle del aporte'}>
          {selectedItem && (
            <div>
              <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>{selectedItem.title}</h4>
              <div className="flex items-center gap-3 mb-4">
                <span className={`tag ${statusColor[selectedItem.status]}`}>{statusLabel[selectedItem.status]}</span>
                <span className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>{selectedItem.date}</span>
              </div>
              {selectedItem.status === 'rechazado' ? (
                <>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-5">
                    <p className="text-sm font-semibold text-red-700 mb-1" style={{ fontFamily: 'Montserrat' }}>Observaciones del revisor:</p>
                    <p className="text-sm text-red-700" style={{ fontFamily: 'Inter' }}>{selectedItem.observations}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedItem(null); navigate('/proponer-contenido'); }}
                    className="btn-primary w-full"
                  >
                    Editar y reenviar
                  </button>
                </>
              ) : selectedItem.status === 'pendiente' ? (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-800" style={{ fontFamily: 'Inter' }}>
                  Tu propuesta está siendo revisada por los administradores. Recibirás una notificación cuando sea procesada.
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-green-800" style={{ fontFamily: 'Inter' }}>
                  Tu contribución está publicada y visible para toda la comunidad. ¡Gracias por tu aporte!
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
