import { useState } from 'react';
import { MenuGrid } from '../components/MenuGrid';
import AdminLayout from './AdminLayout';
import { MENU_QUERY } from '../../apollo/queries/menu';
import { useQuery } from '@apollo/client/react';

// interface AppGridLayoutProps {
//   rootMenuItems: MenuItem[];
// }

const AppGridLayout = () => {
  
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(MENU_QUERY);
  
  if (loading) {
    return <p className="text-center mt-5">Cargando menú...</p>;
  }

  if (error) {
    return <p className="text-center mt-5 text-danger">Error al cargar menú: {error.message}</p>;
  }
  // Buscar los children del root seleccionado
  const selectedChildren =
    data?.rootMenuItems.find(item => String(item.id) === selectedMenuId)?.children || [];

  // Si no hay selección, mostrar solo MenuGrid
  if (!selectedMenuId) {
    return <MenuGrid rootMenuItems={data?.rootMenuItems ?? []} onSelect={setSelectedMenuId} />;
  }

  // Si hay selección, mostrar solo AdminLayout con los children
  return <AdminLayout childrenMenu={selectedChildren} onBack={() => setSelectedMenuId(null)}/>;
};


export default AppGridLayout;
