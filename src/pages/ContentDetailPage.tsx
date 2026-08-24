import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CONTENT_ITEMS } from '../data/content';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { ToastContainer } from '../components/Toast';

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const item = CONTENT_ITEMS.find((c) => c.id === id);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reactions, setReactions] = useState({ '👏': 12, '🔥': 8, '💡': 5, '⭐': 3 });
  const [reacted, setReacted] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Daniel Suárez', text: 'Excelente proyecto, muy bien documentado.', time: 'Hace 2 días' },
    { id: 2, author: 'Lorena Castro', text: 'Inspirador para nuestro semillero. ¿Comparten el código?', time: 'Hace 5 días' },
  ]);
  const [currentImage, setCurrentImage] = useState(0);

  if (!item) return <div className="pt-24 text-center text-gray-500">Contenido no encontrado.</div>;

  const images = [item.image, item.image + '&sat=-80', item.image + '&bri=-20'];

  const handleReact = (emoji: string) => {
    if (!user) { navigate('/login'); return; }
    setReactions((prev) => ({
      ...prev,
      [emoji]: reacted === emoji ? prev[emoji as keyof typeof prev] - 1 : prev[emoji as keyof typeof prev] + 1,
    }));
    setReacted(reacted === emoji ? null : emoji);
  };

  const handleBookmark = () => {
    if (!user) { navigate('/login'); return; }
    setBookmarked(!bookmarked);
    addToast(bookmarked ? 'Eliminado de favoritos' : 'Guardado en favoritos', 'success');
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments((prev) => [
      { id: Date.now(), author: user!.name, text: comment, time: 'Ahora' },
      ...prev,
    ]);
    setComment('');
    addToast('Comentario publicado', 'success');
  };

  const canInteract = !!user;

  return (
    <div className="pt-16 min-h-screen bg-white">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Breadcrumb */}
      <div className="bg-[#F9FAFB] border-b border-gray-100 px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
          <button onClick={() => navigate('/')} className="hover:text-[#C8102E]">Inicio</button>
          <span>›</span>
          <button onClick={() => navigate('/buscar')} className="hover:text-[#C8102E]">Explorar</button>
          <span>›</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{item.title}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1">
            {/* Image gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-6" style={{ height: 420 }}>
              <img src={images[currentImage]} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${currentImage === i ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
              <div className="absolute top-4 left-4">
                <span className={`tag ${item.categoryTag}`}>{item.category}</span>
              </div>
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-3 mb-6">
              {Object.entries(reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all ${reacted === emoji ? 'border-[#C9A84C] bg-[#FFF8E7]' : 'border-gray-200 hover:border-gray-300'}`}
                  title={canInteract ? '' : 'Inicia sesión para reaccionar'}
                >
                  <span>{emoji}</span>
                  <span style={{ fontFamily: 'Montserrat', color: reacted === emoji ? '#C9A84C' : '#6B7280' }}>{count}</span>
                </button>
              ))}
              <button
                onClick={handleBookmark}
                className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${bookmarked ? 'border-[#C9A84C] bg-[#FFF8E7] text-[#C9A84C]' : 'border-gray-200 text-gray-600 hover:border-[#C9A84C]'}`}
                style={{ fontFamily: 'Montserrat' }}
              >
                {bookmarked ? '★' : '☆'} {bookmarked ? 'Guardado' : 'Guardar'}
              </button>
            </div>

            {/* Title & meta */}
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 32, color: '#1A1A1A', lineHeight: 1.2 }}>{item.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
              <span>📅 {item.year}</span>
              <span>👤 {item.author}</span>
              <span>📂 {item.category}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {item.tags.map((t) => (
                <span key={t} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium" style={{ fontFamily: 'Inter' }}>{t}</span>
              ))}
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed text-base" style={{ fontFamily: 'Inter' }}>{item.description}</p>

            {/* Participants */}
            {item.participants && item.participants.length > 0 && (
              <div className="mt-8 p-5 bg-[#F9FAFB] rounded-xl">
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }} className="mb-3">Participantes</h3>
                <div className="flex flex-wrap gap-2">
                  {item.participants.map((p) => (
                    <span key={p} className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700" style={{ fontFamily: 'Inter' }}>{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
              <div className="mt-4 p-5 bg-[#F9FAFB] rounded-xl">
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }} className="mb-3">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((t) => (
                    <span key={t} className="text-sm px-3 py-1.5 bg-[#1A1A1A] text-white rounded-lg font-mono">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mt-10">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20 }} className="mb-6">Comentarios ({comments.length})</h3>

              {canInteract ? (
                <div className="mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] resize-none"
                    style={{ fontFamily: 'Inter' }}
                  />
                  <button onClick={handleComment} disabled={!comment.trim()} className="btn-primary mt-2">
                    Publicar comentario
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
                  <button onClick={() => navigate('/login')} className="text-[#C8102E] font-semibold hover:underline">Inicia sesión</button> para comentar y reaccionar.
                </div>
              )}

              <div className="flex flex-col gap-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3 animate-fade-in">
                    <div className="w-9 h-9 rounded-full bg-[#C8102E]/10 flex items-center justify-center text-sm font-bold text-[#C8102E]" style={{ fontFamily: 'Montserrat' }}>
                      {c.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Montserrat' }}>{c.author}</span>
                        <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>{c.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1" style={{ fontFamily: 'Inter' }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-72 shrink-0">
            {/* Documents */}
            {item.documents && item.documents.length > 0 && (
              <div className="simul-card p-5 mb-5">
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }} className="mb-4">Documentos adjuntos</h3>
                <div className="flex flex-col gap-2">
                  {item.documents.map((doc) => (
                    <button key={doc.name} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#FEF2F2] transition-colors text-left">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Montserrat' }}>{doc.name}</p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>{doc.size}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="simul-card p-5 mb-5">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }} className="mb-4">Compartir</h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors" style={{ fontFamily: 'Montserrat' }}>WhatsApp</button>
                <button className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors" style={{ fontFamily: 'Montserrat' }}>Facebook</button>
                <button className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Montserrat' }}>X</button>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Enlace copiado al portapapeles', 'info'); }}
                className="w-full mt-2 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                style={{ fontFamily: 'Montserrat' }}
              >
                Copiar enlace
              </button>
            </div>

            {/* Related */}
            <div className="simul-card p-5">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }} className="mb-4">Contenido relacionado</h3>
              {CONTENT_ITEMS.filter((c) => c.id !== id && c.status === 'publicado').slice(0, 3).map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/contenido/${c.id}`)}
                  className="flex items-center gap-3 mb-3 text-left group w-full"
                >
                  <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors" style={{ fontFamily: 'Montserrat' }}>{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.year}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
