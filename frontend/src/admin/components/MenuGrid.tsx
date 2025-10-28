import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router';
import {
  GET_CHILD_MENU_ITEMS,
  GET_ROOT_MENU_ITEMS,
  type ChildQueryData,
  type ChildQueryVars,
  type RootQueryData,
} from '../../apollo/queries/menu';
import type { MenuItem } from '../../interfaces/menu';
import './MenuGrid.css';
import { useQuery } from '@apollo/client/react';

interface MenuItemCardProps {
  item: MenuItem;
  onCategoryClick: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onCategoryClick }) => {
  const isLink = !!item.url;

  return (
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      {isLink ? (
        <a href={item.url!} className="menu-item-card text-decoration-none text-dark shadow-sm d-flex flex-column align-items-center justify-content-center">
          <div className="menu-item-icon">
            <i className={`bi ${item.icon} fs-2`}></i>
          </div>
          <span className="menu-item-title mt-2">{item.title}</span>
        </a>
      ) : (
        <div
          className="menu-item-card text-decoration-none text-dark shadow-sm d-flex flex-column align-items-center justify-content-center"
          role="button"
          onClick={() => onCategoryClick(item)}
        >
          <div className="menu-item-icon">
            <i className={`bi ${item.icon} fs-2`}></i>
          </div>
          <span className="menu-item-title mt-2">{item.title}</span>
        </div>
      )}
    </div>
  );
};

export const MenuGrid: React.FC = () => {
  const { id: routeId } = useParams();
  const outletContext = useOutletContext<{ parentId?: string }>();
  const parentId = outletContext?.parentId || routeId;

  const ROOT_TITLE = 'UAGRM';
  const [childNodes, setChildNodes] = useState<MenuItem[]>([]);
  const [currentTitle, setCurrentTitle] = useState(ROOT_TITLE);

  const { loading: rootLoading, data: rootData } = useQuery<RootQueryData>(
    GET_ROOT_MENU_ITEMS,
    { skip: !!parentId }
  );

  const { loading: childLoading, data: childData } = useQuery<
    ChildQueryData,
    ChildQueryVars
  >(GET_CHILD_MENU_ITEMS, {
    variables: { parentId: parentId ?? '' },
    skip: !parentId,
  });

  useEffect(() => {
    if (childData) {
      setChildNodes(childData.childMenuItems);
      setCurrentTitle(`Submenú (${parentId})`);
    }
  }, [childData]);

  const itemsToDisplay = parentId
    ? childNodes
    : rootData?.rootMenuItems || [];

  const handleCategoryClick = (item: MenuItem) => {
    // Redirigimos al layout con el nuevo id
    window.location.href = `#/admin/${item.id}`;
  };

  if (rootLoading || childLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 justify-content-center position-relative">
        {parentId && (
          <button
            className="btn btn-outline-secondary position-absolute"
            style={{ left: 0 }}
            onClick={() => (window.location.href = '/admin')}
          >
            <i className="bi bi-arrow-left me-1"></i> Volver
          </button>
        )}
        <h2 className="mb-0">{currentTitle}</h2>
      </div>

      <div className="row g-3 align-items-center justify-content-center">
        {itemsToDisplay.map((item) => (
          <MenuItemCard key={item.id} item={item} onCategoryClick={handleCategoryClick} />
        ))}
      </div>
    </div>
  );
};
