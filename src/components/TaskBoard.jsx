import React from 'react';
import { Plus, ArrowLeft, ArrowRight, Trash2, Circle } from 'lucide-react';

export default function TaskBoard({
  activeProject,
  STAGES,
  moveTask,
  addTask,
  deleteTask,
  isAddingTaskTo,
  setIsAddingTaskTo,
  newTaskText,
  setNewTaskText
}) {
  if (!activeProject) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Select a project to view its task board</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-6">{activeProject.title} - Task Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAGES.map(stage => (
          <div key={stage.key} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Circle className="w-4 h-4 text-slate-400" />
                <span>{stage.label}</span>
              </h3>
              <button
                onClick={() => setIsAddingTaskTo(stage.key)}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {activeProject.tasks[stage.key].map(task => (
                <div key={task.id} className="bg-slate-700/50 rounded p-3 flex items-center justify-between group">
                  <span className="text-slate-300 text-sm flex-1">{task.text}</span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {stage.key !== 'backlog' && (
                      <button
                        onClick={() => moveTask(task.id, stage.key, -1)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                    {stage.key !== 'launched' && (
                      <button
                        onClick={() => moveTask(task.id, stage.key, 1)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id, stage.key)}
                      className="text-slate-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {isAddingTaskTo === stage.key && (
                <div className="bg-slate-700/50 rounded p-3">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') addTask(stage.key);
                    }}
                    placeholder="New task..."
                    className="w-full bg-transparent text-slate-300 placeholder-slate-500 outline-none"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}