import { createBrowserRouter, Outlet } from 'react-router';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import ContentDetailPage from './pages/ContentDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ProposeContentPage from './pages/ProposeContentPage';
import MyContributionsPage from './pages/MyContributionsPage';
import FavoritesPage from './pages/FavoritesPage';
import RankingPage from './pages/RankingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import RegisterContentPage from './pages/RegisterContentPage';
import AttachEvidencePage from './pages/AttachEvidencePage';
import AdminDashboard from './pages/AdminDashboard';
import ManageContentPage from './pages/ManageContentPage';
import ValidationQueuePage from './pages/ValidationQueuePage';
import PublicationPage from './pages/PublicationPage';
import ManageUsersPage from './pages/ManageUsersPage';

function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function LoginRoot() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginRoot,
    children: [
      { index: true, Component: LoginPage },
    ],
  },
  {
    path: '/registro',
    Component: LoginRoot,
    children: [
      { index: true, Component: RegisterPage },
    ],
  },
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'explorar', Component: ExplorePage },
      { path: 'buscar', Component: SearchPage },
      { path: 'contenido/:id', Component: ContentDetailPage },
      // Student routes
      { path: 'dashboard/estudiante', Component: StudentDashboard },
      { path: 'proponer-contenido', Component: ProposeContentPage },
      { path: 'mis-aportes', Component: MyContributionsPage },
      { path: 'favoritos', Component: FavoritesPage },
      { path: 'ranking', Component: RankingPage },
      // Teacher routes
      { path: 'dashboard/docente', Component: TeacherDashboard },
      { path: 'registrar-contenido', Component: RegisterContentPage },
      { path: 'adjuntar-evidencias', Component: AttachEvidencePage },
      // Admin routes
      { path: 'dashboard/admin', Component: AdminDashboard },
      { path: 'admin/contenido', Component: ManageContentPage },
      { path: 'admin/validacion', Component: ValidationQueuePage },
      { path: 'admin/publicacion', Component: PublicationPage },
      { path: 'admin/usuarios', Component: ManageUsersPage },
    ],
  },
]);
