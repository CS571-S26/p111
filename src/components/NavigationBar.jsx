import React from 'react';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
  return (
    <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-lg tracking-tight flex items-center">
              <img src="/p111/favicon.svg" alt="Focus OS logo" className="w-7 h-7 mr-2 rounded" />
              Focus OS
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Dashboard</Link>
            <Link to="/projects" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">Projects</Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">About</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
