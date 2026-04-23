import React from 'react';
import { X } from 'lucide-react';

export default function NewProjectModal({
  showNewProjectModal,
  setShowNewProjectModal,
  newProjectForm,
  setNewProjectForm,
  handleCreateProject
}) {
  if (!showNewProjectModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md mx-4 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Project</h2>
          <button
            onClick={() => setShowNewProjectModal(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleCreateProject}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
              <input
                type="text"
                value={newProjectForm.title}
                onChange={(e) => setNewProjectForm({...newProjectForm, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                placeholder="Enter project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Niche</label>
              <input
                type="text"
                value={newProjectForm.niche}
                onChange={(e) => setNewProjectForm({...newProjectForm, niche: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., AI Tools, Productivity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={newProjectForm.type}
                onChange={(e) => setNewProjectForm({...newProjectForm, type: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="sprint">Sprint Project</option>
                <option value="anchor">Anchor Project</option>
                <option value="vault">Vault (Archive)</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowNewProjectModal(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}