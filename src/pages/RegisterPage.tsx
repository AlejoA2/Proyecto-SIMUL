import { useState } from 'react';
import { useNavigate } from 'react-router';
import logoUnilibre from '../assets/logo-unilibre.png';

const ACCOUNT_TYPES = [
  { value: 'student', label: 'Estudiante / Egresado', icon: '🎓', desc: 'Explora, comenta y propone contenido' },
  { value: 'teacher', label: 'Docente', icon: '👨‍🏫', desc: 'Registra y gestiona contenido institucional' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'student' | 'teacher'>('student');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-200 focus:ring-[#C8102E]/20 focus:border-[#C8102E]'
    }`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = 'El nombre completo es obligatorio';
    else if (fullName.trim().length < 5) nextErrors.fullName = 'Ingresa tu nombre completo';

    if (!code.trim()) nextErrors.code = 'El código institucional es obligatorio';
    else if (!/^[0-9]{5,12}$/.test(code.trim())) nextErrors.code = 'Debe contener entre 5 y 12 dígitos';

    if (!email) nextErrors.email = 'El correo es obligatorio';
    else if (!email.includes('@')) nextErrors.email = 'Ingresa un correo válido';
    else if (!email.endsWith('@unilibre.edu.co')) nextErrors.email = 'Debe ser un correo @unilibre.edu.co';

    if (!password) nextErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) nextErrors.password = 'Debe tener al menos 6 caracteres';

    if (!confirmPassword) nextErrors.confirmPassword = 'Confirma tu contraseña';
    else if (confirmPassword !== password) nextErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (!acceptedTerms) nextErrors.terms = 'Debes aceptar los términos y condiciones';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
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
            Únete a la<br />
            <span style={{ color: '#E2C06A' }}>comunidad</span>
          </h2>
          <p className="mt-4 text-red-100 leading-relaxed" style={{ fontFamily: 'Inter' }}>
            Crea tu cuenta para formar parte del museo digital de ingeniería: guarda favoritos, comenta historias y compite en el ranking.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              'Perfil personalizado con insignias',
              'Guarda contenido en favoritos',
              'Comenta y reacciona a publicaciones',
              'Acumula puntos y sube de nivel',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-red-100" style={{ fontFamily: 'Inter', fontSize: 14 }}>
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-red-200 text-sm" style={{ fontFamily: 'Inter' }}>Universidad Libre</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="lg:hidden mb-8 text-center">
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2">
              <img src={logoUnilibre} alt="Logo Universidad Libre" className="h-10 w-auto object-contain" />
              <span style={{ color: '#C8102E', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 22 }}>Simul</span>
            </button>
          </div>

          {success ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">✓</div>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>¡Cuenta creada!</h1>
              <p className="text-gray-500 mt-2 text-sm" style={{ fontFamily: 'Inter' }}>
                Tu cuenta se registró exitosamente. Te llevamos a iniciar sesión...
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#1A1A1A' }}>Crear cuenta</h1>
              <p className="text-gray-500 mt-1 mb-6 text-sm" style={{ fontFamily: 'Inter' }}>
                Regístrate con tu correo institucional de la Universidad Libre
              </p>

              {/* Account type */}
              <div className="flex flex-col gap-2 mb-6">
                {ACCOUNT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setAccountType(t.value as 'student' | 'teacher')}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      accountType === t.value ? 'border-[#C8102E] bg-[#FEF2F2]' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Montserrat' }}>{t.label}</p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter' }}>{t.desc}</p>
                    </div>
                    {accountType === t.value && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-xs">✓</div>
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName'); }}
                    className={inputClass('fullName')}
                    style={{ fontFamily: 'Inter' }}
                    placeholder={accountType === 'student' ? 'Ej: Juan Pérez Gómez' : 'Ej: Dra. María Rodríguez'}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>
                    {accountType === 'student' ? 'Código estudiantil' : 'Código de docente'}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.replace(/[^0-9]/g, '')); clearFieldError('code'); }}
                    className={inputClass('code')}
                    style={{ fontFamily: 'Inter' }}
                    placeholder="Solo números"
                  />
                  {errors.code && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>
                    Correo institucional
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                    className={inputClass('email')}
                    style={{ fontFamily: 'Inter' }}
                    placeholder={`nombre@unilibre.edu.co`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                        className={`${inputClass('password')} pr-12`}
                        style={{ fontFamily: 'Inter' }}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Montserrat' }}>Confirmar contraseña</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
                      className={inputClass('confirmPassword')}
                      style={{ fontFamily: 'Inter' }}
                      placeholder="Repite la contraseña"
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => { setAcceptedTerms(e.target.checked); clearFieldError('terms'); }}
                      className="mt-0.5 w-4 h-4 accent-[#C8102E]"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter' }}>
                      Acepto los términos y condiciones y la política de tratamiento de datos personales de la Universidad Libre.
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 mt-1" style={{ fontFamily: 'Inter' }}>{errors.terms}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary py-3.5 text-base mt-1">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creando cuenta...
                    </span>
                  ) : 'Crear cuenta'}
                </button>

                <p className="text-center text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
                  ¿Ya tienes una cuenta?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="text-[#C8102E] hover:underline font-semibold">
                    Inicia sesión
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
