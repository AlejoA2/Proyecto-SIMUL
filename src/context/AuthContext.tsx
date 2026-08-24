import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'visitor' | 'student' | 'teacher' | 'admin';

export interface User {
  name: string;
  email: string;
  role: Role;
  avatar: string;
  points: number;
  level: number;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const ROLE_DATA: Record<Role, User> = {
  visitor: { name: '', email: '', role: 'visitor', avatar: '', points: 0, level: 0, badges: [] },
  student: {
    name: 'Valentina Moreno',
    email: 'v.moreno@unilibre.edu.co',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    points: 1240,
    level: 4,
    badges: ['Explorador', 'Primer Aporte', 'Top 10'],
  },
  teacher: {
    name: 'Dr. Carlos Patiño',
    email: 'c.patino@unilibre.edu.co',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    points: 3800,
    level: 8,
    badges: ['Docente Activo', 'Investigador', 'Mentor'],
  },
  admin: {
    name: 'Ing. Laura Jiménez',
    email: 'l.jimenez@unilibre.edu.co',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    points: 9999,
    level: 10,
    badges: ['Administrador', 'Fundador', 'Leyenda'],
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    if (role === 'visitor') { setUser(null); return; }
    setUser(ROLE_DATA[role]);
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
