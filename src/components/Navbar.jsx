import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Receipt, FileText, PlusCircle, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <Receipt className="navbar-logo-icon" size={24} />
          <span>TechnoPixar Billing</span>
        </NavLink>
        <div className="navbar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <FileText size={18} />
            <span>Invoices & Quotations</span>
          </NavLink>
          <NavLink 
            to="/new" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={18} />
            <span>Create New</span>
          </NavLink>
          
          <button 
            type="button" 
            className="btn btn-secondary btn-icon-only" 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
            style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
