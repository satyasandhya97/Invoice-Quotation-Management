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
    <nav className="bg-bg-secondary border-b border-border-color sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-colors duration-250">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold text-text-primary flex items-center gap-2 hover:opacity-90">
          <Receipt className="text-accent" size={24} />
          <span>TechnoPixar Billing</span>
        </NavLink>
        <div className="flex gap-6 items-center">
          <NavLink 
            to="/" 
            className={({ isActive }) => `font-medium flex items-center gap-1.5 transition-colors duration-150 ${isActive ? 'text-accent' : 'text-text-secondary hover:text-accent'}`}
            end
          >
            <FileText size={18} />
            <span className="hidden sm:inline">Invoices & Quotations</span>
          </NavLink>
          <NavLink 
            to="/new" 
            className={({ isActive }) => `font-medium flex items-center gap-1.5 transition-colors duration-150 ${isActive ? 'text-accent' : 'text-text-secondary hover:text-accent'}`}
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Create New</span>
          </NavLink>
          
          <button 
            type="button" 
            className="p-2 rounded-full border border-border-color bg-bg-tertiary hover:bg-border-color text-text-primary transition-colors duration-150 flex items-center justify-center cursor-pointer"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
