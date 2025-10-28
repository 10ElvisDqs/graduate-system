import { useState, useMemo } from 'react';
import { Outlet, useParams } from 'react-router';
import { useQuery } from '@apollo/client/react';
import { GET_CHILD_MENU_ITEMS } from '../../apollo/queries/menu';
import { AdminSidebar } from '../components/AdminSidebar';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { id } = useParams();

  // 🧠 Convertimos el id en número solo si existe y es válido
  const numericId = useMemo(() => {
    const parsed = Number(id);
    return !isNaN(parsed) && parsed > 0 ? parsed : null;
  }, [id]);

  // 🚫 Ejecutamos la query solo si hay un id válido
  const { data, loading, error } = useQuery(GET_CHILD_MENU_ITEMS, {
    skip: !numericId, // 👈 evita ejecutar la query con id inválido
    variables: { id: numericId ?? 0 },
  });

  // 🧩 Debug limpio
  if (numericId && data) {
    console.log('🔹 Consultando menú para ID:', numericId);
    console.log('📦 Datos obtenidos:', data.menuItem);
  }

  // 🎯 Estado de carga y errores
  if (loading) {
    return <p className="text-center mt-5">Cargando menú...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-5 text-danger">
        Error al cargar menú: {error.message}
      </p>
    );
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* 🔹 Sidebar dinámico */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        menuItems={data?.menuItem.children || []} // ✅ CORRECTO
      />

      {/* 🔹 Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column">
        <main className="flex-grow-1 p-3">
          <Outlet context={{ id: numericId }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
