import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CONTENT_ITEMS, ContentItem } from '../data/content';
import Modal from '../components/Modal';
import { useToast, ToastContainer } from '../components/Toast';

export default function ManageContentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  if (!user) { navigate('/login'); return null; }

  const [items, setItems] = useState<ContentItem[]>(CONTENT_ITEMS);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);

  const filtered = items.filter((i) => {
    const matchFilter = filter === 'Todos' || i.status === filter.toLowerCase();
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    addToast('Contenido eliminado', 'info');
    setDeleteTarget(null);
  };

  const handleUnpublish = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'pendiente' } : i));
    addToast('Contenido despublicado', 'info');
  };

  const statusColor: Record<string, string> = { pendiente: 'tag-pendiente', publicado: 'tag-publicado', rechazado: 'tag-rechazado' };

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/dashboard/admin')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-3" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Gestionar Contenido</h1>
          </div>
          <button onClick={() => navigate('/admin/validacion')} className="btn-primary">Ver bandeja de validación</button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 bg-white" style={{ fontFamily: 'Inter' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Todos', 'Publicado', 'Pendiente', 'Rechazado'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === f ? 'bg-[#C8102E] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`} style={{ fontFamily: 'Montserrat' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="simul-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>Contenido</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Autor</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Año</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <p className="font-semibold text-gray-900 text-sm leading-snug max-w-xs truncate" style={{ fontFamily: 'Montserrat' }}>{item.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className={`tag ${item.categoryTag}`}>{item.category}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter' }}>{item.author.split(',')[0]}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-gray-400 text-sm" style={{ fontFamily: 'Inter' }}>{item.year}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`tag ${statusColor[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => navigate(`/contenido/${item.id}`)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold transition-colors" style={{ fontFamily: 'Montserrat' }}>Ver</button>
                      {item.status === 'publicado' && (
                        <button onClick={() => handleUnpublish(item.id)} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-semibold transition-colors" style={{ fontFamily: 'Montserrat' }}>Despublicar</button>
                      )}
                      <button onClick={() => setDeleteTarget(item)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors" style={{ fontFamily: 'Montserrat' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400" style={{ fontFamily: 'Inter' }}>
              <div className="text-4xl mb-3">📭</div>
              <p>No se encontró contenido con los filtros seleccionados.</p>
            </div>
          )}
        </div>

        {/* Delete confirm modal */}
        <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirmar eliminación">
          <div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-5">
              <p className="text-sm text-red-700" style={{ fontFamily: 'Inter' }}>
                ¿Estás segura de que deseas eliminar permanentemente <strong>"{deleteTarget?.title}"</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancelar</button>
              <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors" style={{ fontFamily: 'Montserrat' }}>Sí, eliminar</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
