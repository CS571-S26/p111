import React, { useState } from 'react';
import { 
  FolderKanban, LayoutDashboard, Plus, Search, ChevronRight, 
  MoreVertical, Clock, CheckCircle2, Circle, ArrowLeft, ArrowRight, BookOpen, PenTool
} from 'lucide-react';

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'Productivity Planner Bundle',
    niche: 'Digital Templates',
    status: 'In Progress',
    dueDate: '2026-03-15',
    tasks: {
      drafting: [{ id: 101, text: 'List 50 Ocean Animals' }, { id: 102, text: 'Write Intro Copy' }],
      generating: [{ id: 103, text: 'Generate Kawaii Foods' }, { id: 104, text: 'Generate Vehicles' }],
      formatting: [{ id: 105, text: 'Canva Grid Layouts' }],
      published: [{ id: 106, text: 'Farm Animals Section' }]
    }
  },
  {
    id: 2,
    title: 'Nexus AI Dashboard Kit',
    niche: 'ThemeForest SaaS',
    status: 'Planning',
    dueDate: '2026-04-01',
    tasks: {
      drafting: [{ id: 201, text: 'Figma Wireframes' }],
      generating: [],
      formatting: [],
      published: []
    }
  }
];

const STAGES = [
  { key: 'drafting', label: 'Drafting / Ideas', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { key: 'generating', label: 'Asset Generation', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'formatting', label: 'Formatting / Polish', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'published', label: 'Published / Ready', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTaskTo, setIsAddingTaskTo] = useState(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const getProgress = (project) => {
    const total = STAGES.reduce((acc, stage) => acc + project.tasks[stage.key].length, 0);
    if (total === 0) return 0;
    const completed = project.tasks.published.length;
    return Math.round((completed / total) * 100);
  };

  const moveTask = (taskId, fromStage, direction) => {
    const stageIndex = STAGES.findIndex(s => s.key === fromStage);
    const newStageIndex = stageIndex + direction;
    
    if (newStageIndex < 0 || newStageIndex >= STAGES.length) return;
    const toStage = STAGES[newStageIndex].key;

    setProjects(projects.map(p => {
      if (p.id !== activeProjectId) return p;
      
      const taskToMove = p.tasks[fromStage].find(t => t.id === taskId);
      return {
        ...p,
        tasks: {
          ...p.tasks,
          [fromStage]: p.tasks[fromStage].filter(t => t.id !== taskId),
          [toStage]: [...p.tasks[toStage], taskToMove]
        }
      };
    }));
  };

  const addTask = (stageKey) => {
    if (!newTaskText.trim()) return;
    
    setProjects(projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return {
        ...p,
        tasks: {
          ...p.tasks,
          [stageKey]: [...p.tasks[stageKey], { id: Date.now(), text: newTaskText }]
        }
      };
    }));
    setNewTaskText('');
    setIsAddingTaskTo(null);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            <FolderKanban className="w-6 h-6 text-indigo-400" /> Launchpad
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveProjectId(null)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${!activeProjectId ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> All Projects
          </button>
          
          <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Workspace</div>
          {projects.map(p => (
            <button 
              key={p.id}
              onClick={() => setActiveProjectId(p.id)}
              className={`w-full text-left truncate flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeProjectId === p.id ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <BookOpen className="w-4 h-4 shrink-0" /> {p.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {activeProjectId && (
              <button onClick={() => setActiveProjectId(null)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-slate-800">
              {activeProject ? activeProject.title : 'Dashboard Overview'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-64 transition-all"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {!activeProject ? (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Welcome back, Creator.</h3>
                <p className="text-slate-500">Here is the status of your current digital product pipeline.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(project => {
                  const progress = getProgress(project);
                  return (
                    <div 
                      key={project.id} 
                      onClick={() => setActiveProjectId(project.id)}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md uppercase tracking-wide">
                          {project.niche}
                        </span>
                        <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                        <Clock className="w-4 h-4" /> Due: {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                          <span>Completion</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">{activeProject.niche}</div>
                  <h3 className="text-3xl font-black text-slate-900">{activeProject.title}</h3>
                </div>
                <div className="text-slate-500 font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                  {getProgress(activeProject)}% Completed
                </div>
              </div>

              <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {STAGES.map((stage, stageIdx) => (
                  <div key={stage.key} className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200/60 p-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h4 className="font-bold text-slate-700 flex items-center gap-2">
                        <Circle className={`w-3 h-3 ${stageIdx === 3 ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-300 text-slate-300'}`} /> 
                        {stage.label}
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2 py-1 rounded-full">
                        {activeProject.tasks[stage.key].length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-2">
                      {activeProject.tasks[stage.key].map(task => (
                        <div key={task.id} className={`bg-white p-4 rounded-xl border shadow-sm group hover:shadow transition-shadow ${stage.color.split(' ')[2]}`}>
                          <p className="text-sm font-medium text-slate-800 mb-4">{task.text}</p>
                          <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              disabled={stageIdx === 0}
                              onClick={() => moveTask(task.id, stage.key, -1)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-0"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button 
                              disabled={stageIdx === STAGES.length - 1}
                              onClick={() => moveTask(task.id, stage.key, 1)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-0"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {isAddingTaskTo === stage.key ? (
                        <div className="bg-white p-3 rounded-xl border border-indigo-300 shadow-sm">
                          <textarea 
                            autoFocus
                            className="w-full text-sm resize-none outline-none font-medium text-slate-700"
                            rows="2"
                            placeholder="What needs to be done?"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addTask(stage.key);
                              }
                            }}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => setIsAddingTaskTo(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1">Cancel</button>
                            <button onClick={() => addTask(stage.key)} className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">Add</button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsAddingTaskTo(stage.key)}
                          className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-100 rounded-xl transition-all"
                        >
                          <Plus className="w-4 h-4" /> Add Asset
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}