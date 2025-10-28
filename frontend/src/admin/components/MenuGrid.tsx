import type { MenuItem } from "../../interfaces/menu";
import './MenuGrid.css'; // Puedes mantener estilos personalizados si quieres

interface MenuGridProps {
  rootMenuItems: MenuItem[];
  onSelect: (id: string) => void;
}

export const MenuGrid = ({ rootMenuItems, onSelect }: MenuGridProps) => {
  return (
    <div className="container mt-5">
      <div className="row g-4 justify-content-center">
        {rootMenuItems.map(item => (
          <div
            key={item.id}
            className="col-6 col-sm-4 col-md-3 col-lg-2"
          >
            <button
              onClick={() => onSelect(String(item.id))}
              className="card menu-item-card text-center text-decoration-none shadow-sm p-3 border-0 bg-white w-100 h-100 d-flex flex-column align-items-center justify-content-center transition-hover"
            >
              <div className="menu-item-icon mb-2">
                <i className={`bi ${item.icon} fs-2 text-primary`}></i>
              </div>
              <span className="menu-item-title fw-semibold">{item.title}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
