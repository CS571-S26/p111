import React from 'react';
import { Target, Rocket, Archive, MoreVertical, Trash2, Eye } from 'lucide-react';

export default function ProjectCard({ project, onSelect, onToggleVault, onDelete, isActive }) {
  const getIcon = (type) => {
    switch(type) {
      case 'sprint': return <Rocket className="w-5 h-5" />;
      case 'anchor': return <Target className="w-5 h-5" />;
      case 'vault': return <Archive className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getProgress = (project) => {
    const total = 4; // stages
    const completed = project.tasks?.launched?.length || 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div
      className={`bg-slate-800/50 border rounded-xl p-6 cursor-pointer transition-all hover:bg-slate-800/70 ${
        isActive ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700'
      }`}
      onClick={() => onSelect(project.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-500/20 p-2 rounded-lg mr-3">
            {getIcon(project.type)}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{project.title}</h3>
            <p className="text-slate-400 text-sm">{project.niche}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVault(project.id, project.type === 'vault' ? 'sprint' : 'vault');
            }}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={project.type === 'vault' ? 'Unvault' : 'Vault'}
          >
            {project.type === 'vault' ? <Eye className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>Progress</span>
            <span>{getProgress(project)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${getProgress(project)}%` }}
            />
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'Just Started' ? 'bg-blue-500/20 text-blue-400' :
          project.status === 'Active' ? 'bg-green-500/20 text-green-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {project.status}
        </span>
      </div>
    </div>
  );
}