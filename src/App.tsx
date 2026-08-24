import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ProposalsProvider } from './context/ProposalsContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <ProposalsProvider>
        <RouterProvider router={router} />
      </ProposalsProvider>
    </AuthProvider>
  );
}
