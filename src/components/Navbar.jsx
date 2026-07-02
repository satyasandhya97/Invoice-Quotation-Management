import React from 'react';
import { NavLink } from 'react-router-dom';
import { Receipt, FileText, PlusCircle } from 'lucide-react';

const Navbar = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
