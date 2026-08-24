import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { useToast, ToastContainer } from '../components/Toast';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Estudiante' | 'Egresado' | 'Docente' | 'Administrador';
  active: boolean;
  joined: string;
  avatar: string;
}

const INITIAL_USERS: UserRecord[] = [
  { id: '1', name: 'Valentina Moreno', email: 'v.moreno@unilibre.edu.co', role: 'Estudiante', active: true, joined: '2023-02-14', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop' },
  { id: '2', name: 'Juan Pérez', email: 'j.perez@unilibre.edu.co', role: 'Estudiante', active: true, joined: '2022-08-01', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60&h=60&fit=crop' },
  { id: '3', name: 'Dr. Carlos Patiño', email: 'c.patino@unilibre.edu.co', role: 'Docente', active: true, joined: '2019-01-15', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop' },
  { id: '4', name: 'Dra. Ana Ramírez', email: 'a.ramirez@unilibre.edu.co', role: 'Docente', active: true, joined: '2020-03-10', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&h=60&fit=crop' },
  { id: '5', name: 'Ing. Laura Jiménez', email: 'l.jimenez@unilibre.edu.co', role: 'Administrador', active: true, joined: '2018-06-01', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop' },
  { id: '6', name: 'Andrés Felipe Ríos', email: 'a.rios@correo.unilibre.edu.co', role: 'Egresado', active: true, joined: '2021-11-20', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop' },
  { id: '7', name: 'Andrea López', email: 'a.lopez@unilibre.edu.co', role: 'Estudiante', active: false, joined: '2023-07-05', avatar: 'https://images.unsplash.com/photo-1542596594-649edbc13630?w=60&h=60&fit=crop' },
];

const ROLES = ['Estudiante', 'Egresado', 'Docente', 'Administrador'];
const ROLE_COLORS: Record<string, string> = {
  Estudiante: 'tag-blue', Egresado: 'tag-purple', Docente: 'tag-orange', Administrador: 'tag-red',
};

export default function ManageUsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  if (!user) { navigate('/login'); return null; }

  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [toggleTarget, setToggleTarget] = useState<UserRecord | null>(null);

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'Todos' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleEditRole = () => {
    if (!editTarget || !editRole) return;
    setUsers((prev) => prev.map((u) => u.id === editTarget.id ? { ...u, role: editRole as UserRecord['role'] } : u));
    addToast(`Rol de ${editTarget.name} actualizado a ${editRole}`, 'success');
    setEditTarget(null);
  };

  const handleToggle = () => {
    if (!toggleTarget) return;
    setUsers((prev) => prev.map((u) => u.id === toggleTarget.id ? { ...u, active: !u.active } : u));
    addToast(`Cuenta de ${toggleTarget.name} ${toggleTarget.active ? 'desactivada' : 'activada'}`, toggleTarget.active ? 'info' : 'success');
    setToggleTarget(null);
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F9FAFB]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard/admin')} className="text-sm text-gray-500 hover:text-[#C8102E] flex items-center gap-1 mb-3" style={{ fontFamily: 'Inter' }}>← Dashboard</button>
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 36, color: '#1A1A1A' }}>Gestionar Usuarios</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o correo..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 bg-white" style={{ fontFamily: 'Inter' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Todos', ...ROLES].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${roleFilter === r ? 'bg-[#C8102E] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`} style={{ fontFamily: 'Montserrat' }}>{r}</button>
            ))}
          </div>
        </div>

        <div className="simul-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Montserrat' }}>Usuario</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Correo</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900" style={{ fontFamily: 'Montserrat' }}>{u.name}</p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter' }}>Desde {u.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter' }}>{u.email}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`tag ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${u.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-xs" style={{ fontFamily: 'Inter', color: u.active ? '#059669' : '#9CA3AF' }}>{u.active ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => { setEditTarget(u); setEditRole(u.role); }} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold transition-colors" style={{ fontFamily: 'Montserrat' }}>Editar rol</button>
                      <button onClick={() => setToggleTarget(u)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${u.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`} style={{ fontFamily: 'Montserrat' }}>
                        {u.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit role modal */}
        <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar rol de usuario">
          {editTarget && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <img src={editTarget.avatar} alt={editTarget.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold" style={{ fontFamily: 'Montserrat' }}>{editTarget.name}</p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>{editTarget.email}</p>
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Montserrat' }}>Nuevo rol</label>
              <div className="flex flex-col gap-2 mb-6">
                {ROLES.map((r) => (
                  <button key={r} onClick={() => setEditRole(r)} className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${editRole === r ? 'border-[#C8102E] bg-[#FEF2F2]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="font-semibold text-sm" style={{ fontFamily: 'Montserrat' }}>{r}</span>
                    {editRole === r && <span className="text-[#C8102E]">✓</span>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditTarget(null)} className="btn-secondary flex-1">Cancelar</button>
                <button onClick={handleEditRole} className="btn-primary flex-1">Guardar cambios</button>
              </div>
            </div>
          )}
        </Modal>

        {/* Toggle confirm modal */}
        <Modal open={!!toggleTarget} onClose={() => setToggleTarget(null)} title={toggleTarget?.active ? 'Desactivar cuenta' : 'Activar cuenta'}>
          {toggleTarget && (
            <div>
              <p className="text-sm text-gray-600 mb-5" style={{ fontFamily: 'Inter' }}>
                ¿Confirmas que deseas {toggleTarget.active ? 'desactivar' : 'activar'} la cuenta de <strong>{toggleTarget.name}</strong>?
                {toggleTarget.active && ' El usuario no podrá iniciar sesión hasta que sea reactivado.'}
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setToggleTarget(null)} className="btn-secondary">Cancelar</button>
                <button onClick={handleToggle} className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-colors ${toggleTarget.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`} style={{ fontFamily: 'Montserrat' }}>
                  {toggleTarget.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
