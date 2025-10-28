import React, { useState, useCallback, useMemo } from 'react';
import type { JSX } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { CustomLogo } from '../../components/custom/CustomLogo';
import type { User } from '../../interfaces/user.interface';
import type { MenuItem } from '../../interfaces/menu';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
  user?: User;
  onLogout?: () => void;
}

const defaultUser: User = {
  id: '1',
  email: 'dquinteors630@gmail.com',
  fullName: 'elvis david quinteros siles',
  isActive: true,
  roles: ['admin', 'general']
};

export const AdminSidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  menuItems,
  user = defaultUser,
  onLogout
}) => {
  console.log('Menu Items in Sidebar:', menuItems);
  const { pathname } = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // Determina si una ruta está activa
  const isActiveRoute = useCallback((url: string | null | undefined): boolean => {
    if (!url) return false;
    
    // Manejo especial para rutas con parámetros dinámicos
    if (pathname.startsWith(url) && url !== '/') return true;
    
    return pathname === url;
  }, [pathname]);

  // Verifica si algún hijo está activo (para resaltar el padre)
  const hasActiveChild = useCallback((item: MenuItem): boolean => {
    if (isActiveRoute(item.url)) return true;
    
    if (item.hasChildren && item.children) {
      return item.children.some(child => hasActiveChild(child));
    }
    
    return false;
  }, [isActiveRoute]);

  // Toggle para expandir/colapsar submenús
  const toggleSubmenu = useCallback((menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  }, []);

  // Obtener iniciales del usuario
  const userInitials = useMemo(() => {
    return user.fullName
      .split(' ')
      .slice(0, 2)
      .map(name => name.charAt(0).toUpperCase())
      .join('');
  }, [user.fullName]);

  // Renderizar un item del menú de forma recursiva
  const renderMenuItem = useCallback((item: MenuItem, level: number = 0): JSX.Element => {
    const isActive = isActiveRoute(item.url);
    const hasChildActive = hasActiveChild(item);
    const isExpanded = expandedMenus.has(item.id.toString());
    const hasUrl = item.url !== null;
    const hasValidChildren = item.hasChildren && item.children && item.children.length > 0;
    
    // Calcular padding left basado en el nivel
    const paddingLeft = level === 0 ? '0.75rem' : `${0.75 + (level * 1)}rem`;
    
    // Estilos para el indicador de nivel
    const levelIndicatorStyle = level > 0 ? {
      borderLeft: '2px solid #e9ecef',
      marginLeft: `${(level - 1) * 1}rem`
    } : {};

    // Componente del contenido del item
    const ItemContent = () => (
      <>
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: 0 }}>
          <i 
            className={`bi ${item.icon}`} 
            style={{ 
              fontSize: level === 0 ? '1.1rem' : '0.95rem', 
              minWidth: '1.5rem',
              opacity: level > 0 ? 0.8 : 1
            }}
          />
          {!isCollapsed && (
            <span 
              className="text-truncate" 
              style={{ 
                fontSize: level === 0 ? '0.9rem' : '0.85rem',
                fontWeight: level === 0 ? 500 : 400
              }}
            >
              {item.title}
            </span>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
            {(item.notificationCount ?? 0) > 0 && (
              <span 
                className="badge bg-danger rounded-pill" 
                style={{ 
                  fontSize: '0.65rem', 
                  minWidth: '1.5rem',
                  padding: '0.2rem 0.4rem'
                }}
              >
                {(item.notificationCount ?? 0) > 99 ? '99+' : item.notificationCount}
              </span>
            )}
            {hasValidChildren && (
              isExpanded ? (
                <ChevronUp size={14} className="text-muted" />
              ) : (
                <ChevronDown size={14} className="text-muted" />
              )
            )}
          </div>
        )}
      </>
    );

    return (
      <li key={item.id} className="nav-item" style={levelIndicatorStyle}>
        {hasUrl ? (
          // Item con enlace
          <Link
            to={item.url!}
            className={`nav-link d-flex align-items-center gap-2 rounded ${
              isActive
                ? 'active bg-danger text-white'
                : hasChildActive && !isActive
                ? 'text-danger'
                : 'text-dark hover-bg-light'
            }`}
            style={{
              paddingLeft,
              paddingRight: '0.75rem',
              paddingTop: level === 0 ? '0.5rem' : '0.4rem',
              paddingBottom: level === 0 ? '0.5rem' : '0.4rem',
              fontSize: level === 0 ? '0.9rem' : '0.85rem',
              transition: 'all 0.2s ease'
            }}
            title={isCollapsed ? item.title : undefined}
            onClick={() => {
              // Si tiene hijos válidos, también expandir/colapsar
              if (hasValidChildren && !isCollapsed) {
                toggleSubmenu(item.id.toString());
              }
            }}
          >
            <ItemContent />
          </Link>
        ) : (
          // Item sin enlace (solo para expandir)
          <button
            onClick={() => toggleSubmenu(item.id.toString())}
            className={`nav-link d-flex align-items-center gap-2 rounded w-100 border-0 bg-transparent text-start ${
              hasChildActive ? 'text-danger fw-medium' : 'text-dark hover-bg-light'
            }`}
            style={{
              paddingLeft,
              paddingRight: '0.75rem',
              paddingTop: level === 0 ? '0.5rem' : '0.4rem',
              paddingBottom: level === 0 ? '0.5rem' : '0.4rem',
              fontSize: level === 0 ? '0.9rem' : '0.85rem',
              transition: 'all 0.2s ease'
            }}
            title={isCollapsed ? item.title : undefined}
            aria-expanded={isExpanded}
          >
            <ItemContent />
          </button>
        )}

        {/* Renderizar hijos de forma recursiva si existen y está expandido */}
        {hasValidChildren && isExpanded && !isCollapsed && (
          <ul className="nav flex-column" style={{ marginTop: '0.25rem' }}>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  }, [isCollapsed, pathname, expandedMenus, isActiveRoute, hasActiveChild, toggleSubmenu]);

  return (
    <div
      className="bg-white border-end d-flex flex-column position-relative"
      style={{
        width: isCollapsed ? '4.5rem' : '16rem',
        transition: 'width 0.3s ease-in-out',
        minHeight: '100vh'
      }}
    >
      {/* Header con Logo */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom"
        style={{ height: '4.5rem', minHeight: '4.5rem' }}
      >
        {!isCollapsed && (
          <div className="flex-grow-1 overflow-hidden">
            <CustomLogo />
          </div>
        )}
        <button
          onClick={onToggle}
          className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '2rem', height: '2rem', minWidth: '2rem' }}
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav 
        className="flex-grow-1 overflow-y-auto p-2" 
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e0 transparent'
        }}
      >
        <ul className="nav flex-column gap-1">
          {menuItems.map(item => renderMenuItem(item, 0))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="border-top">
        <div className={`p-3 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            // Vista colapsada - solo avatar
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mx-auto cursor-pointer"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #0d85fdff, #c14242ff)',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              title={user.fullName}
            >
              {userInitials}
            </div>
          ) : (
            // Vista expandida - información completa
            <div>
              <div className="d-flex align-items-center gap-2 p-2 rounded hover-bg-light">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    minWidth: '2.5rem',
                    background: 'linear-gradient(135deg, #0d85fdff, #c14242ff)',
                    fontSize: '0.85rem'
                  }}
                >
                  {userInitials}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.9rem' }}>
                    {user.fullName}
                  </p>
                  <p className="mb-0 text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                    {user.email}
                  </p>
                </div>
              </div>
              
              {/* Logout button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="btn btn-outline-danger btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Cerrar sesión</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};