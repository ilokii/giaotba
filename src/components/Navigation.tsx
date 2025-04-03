import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="nav">
      <Link to="/" className={`nav-link ${isActive('/')}`}>
        主页
      </Link>
      <Link to="/leagues" className={`nav-link ${isActive('/leagues')}`}>
        篮球联赛
      </Link>
      <Link to="/players" className={`nav-link ${isActive('/players')}`}>
        联赛球员
      </Link>
    </nav>
  );
} 