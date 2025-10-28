import { lazy } from 'react';
import { createHashRouter, Navigate } from 'react-router';

// Páginas del admin
import { DashboardPage } from './admin/pages/dashboard/DashboardPage';
import { FrameworksPage } from './admin/pages/frameworks/FrameworksPage';
import { MigrationPage } from './admin/pages/migration/MigrationPage';
import { ChecklistPage } from './admin/pages/checklist/ChecklistPage';
import { AIPage } from './admin/pages/ai/AIPage';
import { APIPage } from './admin/pages/api/APIPage';
import { BuildPage } from './admin/pages/build/BuildPage';
import { ProjectsPage } from './admin/pages/projects/ProjectsPage';
import { SettingsGeneralPage } from './admin/pages/settings/SettingsGeneralPage';

const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));
const AppGridLayout = lazy(() => import('./admin/layouts/AppGridLayout'));

export const appRouter = createHashRouter([
  {
    path: '',
    element: <AppGridLayout />,
  },
  {

    path: '/admin/:id?',
      element: <AdminLayout />,
    children: [
      // {
      //   index: true,
      //   element: <Navigate to="/admin/dashboard" replace />,
      // },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Getting Started
      {
        path: 'frameworks',
        element: <FrameworksPage />,
      },
      {
        path: 'migration',
        element: <MigrationPage />,
      },
      {
        path: 'checklist',
        element: <ChecklistPage />,
      },
      // Access
      {
        path: 'ai',
        element: <AIPage />,
      },
      {
        path: 'api',
        element: <APIPage />,
      },
      {
        path: 'build',
        element: <BuildPage />,
      },
      // Projects
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      // Settings
      {
        path: 'settings/general',
        element: <SettingsGeneralPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/admin/dashboard" replace />,
  },
]);
