import React, { useRef, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { Search, Bell, MessageSquare, Settings } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = inputRef.current?.value;

    if (!query) {
      navigate('/admin/products');
      return;
    }

    navigate(`/admin/products?query=${query}`);
  };

  return (
    <header className="bg-white border-bottom py-3 px-4" style={{ height: '4.5rem' }}>
      <div className="d-flex justify-content-between align-items-center">
        {/* Search */}
        <div className="flex-grow-1 me-3" style={{ maxWidth: '20rem' }}>
          <div className="position-relative">
            <Search
              size={20}
              className="position-absolute top-50 start-0 translate-middle-y text-muted ms-2"
            />
            <input
              ref={inputRef}
              onKeyDown={handleSearch}
              type="text"
              placeholder="Search..."
              className="form-control ps-5 pe-3 py-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light position-relative p-2 rounded-circle">
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>

          <button className="btn btn-light p-2 rounded-circle">
            <MessageSquare size={20} />
          </button>

          <button className="btn btn-light p-2 rounded-circle">
            <Settings size={20} />
          </button>

          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '2rem',
              height: '2rem',
              background: 'linear-gradient(135deg, #0d6efd, #6f42c1)',
              cursor: 'pointer',
            }}
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
