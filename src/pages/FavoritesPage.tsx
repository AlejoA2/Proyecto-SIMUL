import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { CONTENT_ITEMS } from '../data/content';
import { useToast, ToastContainer } from '../components/Toast';

export default function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  if (!user) { navigate('/login'); return null; }

  const [favorites, setFavorites] = useState(CONTENT_ITEMS.filter((c) => c.status === 'publicado').slice(0, 4));
  const [shareOpen, setShareOpen] = useState<string | null>(null);

  const remove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    addToast('Eliminado de favoritos', 'info');
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard/estudiante')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-3" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Mis Favoritos</h1>
          <p className="text-gray-500 mt-1" style={{ fontFamily: 'Inter' }}>Contenido que guardaste para consultar más tarde</p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="text-6xl mb-5">⭐</div>
            <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22 }}>Aún no tienes favoritos guardados</h3>
            <p className="text-gray-500 mt-2 max-w-sm" style={{ fontFamily: 'Inter' }}>Explora el museo y presiona el ícono de guardar en cualquier contenido para añadirlo aquí.</p>
            <button onClick={() => navigate('/buscar')} className="btn-primary mt-6">Explorar contenido</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((item) => (
              <div key={item.id} className="simul-card overflow-hidden group relative">
                <button
                  onClick={() => navigate(`/contenido/${item.id}`)}
                  className="block w-full text-left"
                >
                  <div className="h-44 overflow-hidden bg-gray-100 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                      <span className={`tag ${item.categoryTag}`}>{item.category}</span>
                    </div>
                  </div>
                  <div className="p-4 pb-2">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2" style={{ fontFamily: 'Montserrat' }}>{item.title}</h3>
                    <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Inter' }}>{item.year}</p>
                  </div>
                </button>

                {/* Actions */}
                <div className="px-4 pb-4 flex items-center gap-2">
                  {/* Share */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShareOpen(shareOpen === item.id ? null : item.id)}
                      className="w-full py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      Compartir
                    </button>
                    {shareOpen === item.id && (
                      <div className="absolute bottom-full left-0 mb-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-10 animate-fade-in">
                        <div className="flex flex-col gap-1.5">
                          <button onClick={() => { setShareOpen(null); addToast('Enlace copiado', 'success'); }} className="text-xs py-1.5 px-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium w-full text-left">Copiar enlace</button>
                          <button className="text-xs py-1.5 px-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium w-full text-left">WhatsApp</button>
                          <button className="text-xs py-1.5 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium w-full text-left">Facebook</button>
                          <button className="text-xs py-1.5 px-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium w-full text-left">X (Twitter)</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="py-1.5 px-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
