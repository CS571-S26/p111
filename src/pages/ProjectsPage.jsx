import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Archive, Target, Rocket } from 'lucide-react';

export default function ProjectsPage() {
  // This would normally come from props or context, but for now static
  const projects = [
    { id: 1, title: 'AI Agent Builder', type: 'sprint', status: 'Active', niche: 'AI Tools' },
    { id: 2, title: 'Productivity Dashboard', type: 'anchor', status: 'Planning', niche: 'Productivity' },
    { id: 3, title: 'Market Research Tool', type: 'vault', status: 'Archived', niche: 'Research' }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'sprint': return <Rocket className="w-5 h-5" />;
      case 'anchor': return <Target className="w-5 h-5" />;
      case 'vault': return <Archive className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">All Projects</h1>
        <p className="text-lg leading-relaxed text-slate-400 mb-8">
          Overview of all your projects across sprints, anchors, and vaulted ideas.
        </p>
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-500/20 p-2 rounded-lg mr-3">
                  {getIcon(project.type)}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{project.title}</h3>
                  <p className="text-slate-400 text-sm">{project.niche}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Planning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {project.status}
                </span>
                <span className="text-slate-400 text-sm capitalize">{project.type}</span>
              </div>
            </div>
          ))}
        </div>
        <Link to="/" className="inline-flex items-center mt-10 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}