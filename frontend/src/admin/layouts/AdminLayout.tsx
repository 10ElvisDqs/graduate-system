import { useState } from 'react';
import { Outlet } from 'react-router';
import { AdminHeader } from '../components/AdminHeader';
import { useQuery } from '@apollo/client/react';
import { MENU_QUERY } from '../../apollo/queries/menu';
import { AdminSidebar } from '../components/AdminSidebar';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 🚀 Ejecutamos la consulta GraphQL para obtener el menú
  const { data, loading, error } = useQuery(MENU_QUERY);
  console.log(data)

  if (loading) {
    return <p className="text-center mt-5">Cargando menú...</p>;
  }

  if (error) {
    return <p className="text-center mt-5 text-danger">Error al cargar menú: {error.message}</p>;
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        menuItems={data?.rootMenuItems || []} // <-- Pasamos la data
      />

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        <AdminHeader />
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
