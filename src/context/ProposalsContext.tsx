import { createContext, useContext, useState, ReactNode } from 'react';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
}

export interface Proposal {
  id: string;
  name: string;
  year: string;
  category: string;
  members: string;
  description: string;
  technologies: string[];
  results: string;
  teacherId: string;
  teacherName: string;
  studentName: string;
  studentEmail: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  createdAt: Date;
}

interface ProposalsContextType {
  proposals: Proposal[];
  teachers: Teacher[];
  addProposal: (proposal: Omit<Proposal, 'id' | 'status' | 'createdAt'>) => void;
  getProposalsByTeacher: (teacherId: string) => Proposal[];
  updateProposalStatus: (id: string, status: 'aprobado' | 'rechazado') => void;
}

const AVAILABLE_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Carlos Patiño',
    email: 'c.patino@unilibre.edu.co',
    department: 'Ingeniería de Sistemas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 't2',
    name: 'Mg. Sandra Ruiz',
    email: 's.ruiz@unilibre.edu.co',
    department: 'Ingeniería de Sistemas',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 't3',
    name: 'Ing. Mariana Torres',
    email: 'm.torres@unilibre.edu.co',
    department: 'Ingeniería de Sistemas',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format',
  },
  {
    id: 't4',
    name: 'Dr. Ricardo Montoya',
    email: 'r.montoya@unilibre.edu.co',
    department: 'Ingeniería de Sistemas',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format',
  },
];

const ProposalsContext = createContext<ProposalsContextType>({
  proposals: [],
  teachers: [],
  addProposal: () => {},
  getProposalsByTeacher: () => [],
  updateProposalStatus: () => {},
});

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const addProposal = (proposal: Omit<Proposal, 'id' | 'status' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      status: 'pendiente',
      createdAt: new Date(),
    };
    setProposals((prev) => [...prev, newProposal]);
  };

  const getProposalsByTeacher = (teacherId: string) => {
    return proposals.filter((p) => p.teacherId === teacherId);
  };

  const updateProposalStatus = (id: string, status: 'aprobado' | 'rechazado') => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return (
    <ProposalsContext.Provider
      value={{
        proposals,
        teachers: AVAILABLE_TEACHERS,
        addProposal,
        getProposalsByTeacher,
        updateProposalStatus,
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
}

export const useProposals = () => useContext(ProposalsContext);
