import { useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import type { MenuItem } from "../../interfaces/menu";
import { AdminHeader } from "../components/AdminHeader";

interface AdminLayoutProps {
  childrenMenu: MenuItem[];
  onBack: () => void;
}

const AdminLayout = ({ childrenMenu, onBack }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar dinámico */}
      <AdminSidebar
        isCollapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        menuItems={childrenMenu}
      />

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <AdminHeader />
        <div className="d-flex justify-content-between align-items-center bg-white shadow-sm p-3">
          <h5 className="mb-0">Panel de Administración</h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left me-1"></i> Volver al menú
          </button>
        </div>

        {/* Main */}
        <main className="flex-grow-1 p-4 bg-light">
          <div className="container-fluid">
            {/* Aquí se renderizan las páginas hijas */}
            <p>Selecciona un item del sidebar para ver su contenido.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
