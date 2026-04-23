import React from 'react';
import { LayoutDashboard, Archive, BrainCircuit, Bot, Sparkles, Target, Zap, Rocket } from 'lucide-react';

export default function Sidebar({ 
  view, 
  setView, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  activeProjectId, 
  setActiveProjectId,
  anchorProject,
  sprintProjects
}) {
  const menuItems = [
    { key: 'pipeline', label: 'Pipeline Graph', icon: Bot, special: true },
    { key: 'oracle', label: 'The Monday Drop', icon: Sparkles, special: true },
    { key: 'dashboard', label: 'Active Dashboard', icon: LayoutDashboard },
    { key: 'vault', label: 'Idea Vault', icon: Archive }
  ];

  const handleItemClick = (itemKey) => {
    setActiveProjectId(null);
    setView(itemKey);
    setIsMobileMenuOpen(false);
  };

  const handleProjectClick = (projectId) => {
    setActiveProjectId(projectId);
    setView('dashboard');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-500" /> FocusOS 
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">V3</span>
            </h2>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="mb-8 space-y-2">
              {menuItems.filter(item => item.special).map(item => (
                <button
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                    !activeProjectId && view === item.key
                      ? item.key === 'pipeline' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mb-6 space-y-1">
              {menuItems.filter(item => !item.special).map(item => (
                <button
                  key={item.key}
                  onClick={() => handleItemClick(item.key)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                    !activeProjectId && view === item.key
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">12-Week Anchor</div>
            {anchorProject ? (
              <button
                onClick={() => handleProjectClick(anchorProject.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                  activeProjectId === anchorProject.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'hover:bg-slate-800 text-emerald-500/80 hover:text-white'
                }`}
              >
                <Target className="w-5 h-5 mr-3" />
                {anchorProject.title}
              </button>
            ) : (
              <div className="px-4 py-2 text-xs text-slate-600 italic">No anchor set. Stay focused.</div>
            )}

            <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Sprints</div>
            {sprintProjects.map(p => (
              <button
                key={p.id}
                onClick={() => handleProjectClick(p.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                  activeProjectId === p.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'hover:bg-slate-800 text-amber-500/80 hover:text-white'
                }`}
              >
                <Zap className="w-5 h-5 mr-3" />
                {p.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}