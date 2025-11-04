// src/router.tsx
import { lazy, Suspense } from 'react';
import { createHashRouter, Navigate } from 'react-router';

// Layouts lazy
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const AppGridLayout = lazy(() => import('./admin/layouts/AppGridLayout'));

// Páginas del admin (pueden ser lazy también)
import { FrameworksPage } from './admin/pages/frameworks/FrameworksPage';
import { MigrationPage } from './admin/pages/migration/MigrationPage';
import { ChecklistPage } from './admin/pages/checklist/ChecklistPage';
import { AIPage } from './admin/pages/ai/AIPage';
import { APIPage } from './admin/pages/api/APIPage';
import { BuildPage } from './admin/pages/build/BuildPage';
import { ProjectsPage } from './admin/pages/projects/ProjectsPage';
import { SettingsGeneralPage } from './admin/pages/settings/SettingsGeneralPage';

export const appRouter = createHashRouter([
  {
    path: '/', // ruta raíz
    element: (
      <Suspense fallback={<div>Cargando AppGridLayout...</div>}>
        <AppGridLayout/>
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<div>Cargando AdminLayout...</div>}>
        <AdminLayout childrenMenu={[]} onBack={() => {}} />
      </Suspense>
    ),
    children: [
      { path: 'frameworks', element: <FrameworksPage /> },
      { path: 'migration', element: <MigrationPage /> },
      { path: 'checklist', element: <ChecklistPage /> },
      { path: 'ai', element: <AIPage /> },
      { path: 'api', element: <APIPage /> },
      { path: 'build', element: <BuildPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'settings/general', element: <SettingsGeneralPage /> },
    ],
  },
  {
    path: '*', // ruta catch-all
    element: <Navigate to="/admin/dashboard" replace />,
  },
]);
