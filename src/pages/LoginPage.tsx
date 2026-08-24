import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, Role } from '../context/AuthContext';
import logoUnilibre from '../assets/logo-unilibre.png';

const ROLES = [
  { value: 'student', label: 'Estudiante / Egresado', icon: '🎓', desc: 'Explora, propone y comparte contenido' },
  { value: 'teacher', label: 'Docente', icon: '👨‍🏫', desc: 'Registra y gestiona contenido institucional' },
  { value: 'admin', label: 'Administrador', icon: '⚙️', desc: 'Valida contenido y gestiona la plataforma' },
];

const ROLE_EMAILS: Record<string, string> = {
  student: 'v.moreno@unilibre.edu.co',
  teacher: 'c.patino@unilibre.edu.co',
  admin: 'l.jimenez@unilibre.edu.co',
};

const ROLE_NAMES: Record<string, string> = {
  student: 'Valentina Moreno',
  teacher: 'Dr. Carlos Patiño',
  admin: 'Ing. Laura Jiménez',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState(ROLE_EMAILS['student']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(ROLE_EMAILS[role]);
    setError('');
    setEmailError('');
    setPasswordError('');
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) { setEmailError('El correo es obligatorio'); valid = false; }
    else if (!email.includes('@')) { setEmailError('Ingresa un correo válido'); valid = false; }
    if (!password) { setPasswordError('La contraseña es obligatoria'); valid = false; }
    else if (password !== '1234' && password !== 'simul2024') {
      setError('Correo o contraseña incorrectos. (Usa "1234" para demostración)');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      if (selectedRole === 'student') navigate('/dashboard/estudiante');
      else if (selectedRole === 'teacher') navigate('/dashboard/docente');
      else navigate('/dashboard/admin');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[#C8102E] p-12 text-white">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <img
            src={logoUnilibre}
            alt="Logo Universidad Libre"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 22 }}>Simul</span>
        </button>

        <div>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, lineHeight: 1.1 }}>
            Bienvenido al<br />
            <span style={{ color: '#E2C06A' }}>Museo Digital</span>
          </h2>
          <p className="mt-4 text-red-100 leading-relaxed" style={{ fontFamily: 'Inter' }}>
            Inicia sesión para acceder a funciones exclusivas: comenta, guarda favoritos, propone proyectos y participa en la gamificación.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {['Comenta y reacciona al contenido', 'Guarda tus favoritos', 'Propone y registra proyectos', 'Compite en el ranking de gamificación'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-red-100" style={{ fontFamily: 'Inter', fontSize: 14 }}>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-red-200 text-sm" style={{ fontFamily: 'Inter' }}>Universidad Libre · Programa de Ingeniería de Sistemas</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2">
              <img
                src={logoUnilibre}
                alt="Logo Universidad Libre"
                className="h-10 w-auto object-contain"
              />
              <span style={{ color: '#C8102E', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 22 }}>Simul</span>
            </button>
          </div>

          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>Iniciar sesión</h1>
          <p className="text-gray-500 mt-1 mb-6 text-sm" style={{ fontFamily: 'Inter' }}>Selecciona tu tipo de cuenta para el demo</p>

          {/* Role selector */}
          <div className="flex flex-col gap-2 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.value}
                onClick={() => handleRoleSelect(r.value as Role)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedRole === r.value ? 'border-[#C8102E] bg-[#FEF2F2]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Montserrat' }}>{r.label}</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>{r.desc}</p>
                </div>
                {selectedRole === r.value && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs">✓</div>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={validateAndSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>Correo institucional</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 ${emailError ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#C8102E]/20 focus:border-[#C8102E]'}`}
                style={{ fontFamily: 'Inter' }}
                placeholder={ROLE_EMAILS[selectedRole]}
              />
              {emailError && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 pr-12 ${passwordError ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#C8102E]/20 focus:border-[#C8102E]'}`}
                  style={{ fontFamily: 'Inter' }}
                  placeholder="Usa: 1234 para el demo"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{passwordError}</p>}
              <p className="text-xs text-gray-400 mt-1.5" style={{ fontFamily: 'Inter' }}>
                Demo: Usuario <strong>{ROLE_NAMES[selectedRole]}</strong> · Contraseña: <code>1234</code>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" style={{ fontFamily: 'Inter' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary py-3.5 text-base mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar sesión'}
            </button>

            <div className="flex items-center justify-between text-sm" style={{ fontFamily: 'Inter' }}>
              <button type="button" className="text-[#C8102E] hover:underline">¿Olvidaste tu contraseña?</button>
              <button type="button" className="text-[#C8102E] hover:underline">Registrarse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
