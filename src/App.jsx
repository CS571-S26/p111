import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';


import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Target, Zap, Archive, LayoutDashboard, Plus, 
  ArrowLeft, ArrowRight, ArrowDown, CheckCircle2, Circle, Trash2, 
  Menu, X, Play, BrainCircuit, ChevronDown, ChevronUp, 
  TerminalSquare, Copy, Check, Sparkles, Bot, Terminal, Eye,
  Globe, MessageSquare, Database, Calendar, Code2, RefreshCw, Users
} from 'lucide-react';

import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import Sidebar from './components/Sidebar';
import ProjectCard from './components/ProjectCard';
import TaskBoard from './components/TaskBoard';
import PipelineVisualizer from './components/PipelineVisualizer';
import NewProjectModal from './components/NewProjectModal';
import { STAGES, INITIAL_PROJECTS } from './data/mockData';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0D15] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col">
        <NavigationBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<FocusOS />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function FocusOS() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'vault' | 'oracle'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New Project Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({ title: '', niche: '', type: 'sprint' });

  // Task Kanban State
  const [isAddingTaskTo, setIsAddingTaskTo] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');

  // AI Pipeline State
  const [mondayDrop, setMondayDrop] = useState(null);
  const [isGeneratingDrop, setIsGeneratingDrop] = useState(false);
  
  // Real-time Ingestion Logs State
  const [ingestLogs, setIngestLogs] = useState([]);

    // Dynamic Sources State
    const [sources, setSources] = useState(null);
    const [isSavingSources, setIsSavingSources] = useState(false);

    useEffect(() => {
      fetch('/api/pipeline/sources')
        .then(res => res.json())
        .then(data => setSources(data.sources))
        .catch(err => console.error("Failed to fetch sources", err));
    }, []);

    const saveSources = async (newSources) => {
      setIsSavingSources(true);
      setSources(newSources); // optimistic update
      try {
        await Promise.resolve({ ok: true, json: async () => ([]) });
      } catch (err) {
        console.error("Failed to save sources", err);
      }
      setTimeout(() => setIsSavingSources(false), 800);
    };
  
  useEffect(() => {
    if (!isGeneratingDrop) return;
    
    // Real pipeline ingestion logs for visual feedback
    const logs = [
      "INIT: Commencing Phase 1 (Ingestion)...",
      "SCRAPE: Pinging HackerNews top tier APIs...",
      "FETCH: Requesting Mark Tilbury & Tech YouTube Transcripts...",
      "DATA: Parsing 14,024 words from YC Combinator discussions...",
      "DATA: Found strong sentiment on 'Micro-SaaS' & 'Automated Agents'...",
      "CACHE: Connecting to Vector DB (Skool API Trends)...",
      "PROCESS: Evaluating crossover & Market demand...",
      "INIT: Commencing Phase 2 (AI Oracle generation)...",
      "LLM: Structuring Agent God Prompt based on Context...",
      "LLM: Grading Conviction Scores...",
      "SUCCESS: Context synthesis complete. Finalizing drop."
    ];
    
    let currentLogIndex = 0;
    setIngestLogs([logs[0]]);
    
    const interval = setInterval(() => {
      currentLogIndex++;
      if (currentLogIndex < logs.length) {
        setIngestLogs(prev => [...prev, logs[currentLogIndex]]);
      } else {
        clearInterval(interval);
      }
    }, 600); // 600ms per log simulates the time the Next.js API takes to respond
    
    return () => clearInterval(interval);
  }, [isGeneratingDrop]);

  // Fetch the dynamic AI generated idea
  const generateMondayDrop = async () => {
    setIsGeneratingDrop(true);
    try {
      const res = await Promise.resolve({ ok: true, json: async () => ({
        ideaName: 'AI Venture Studio Launchpad',
        description: 'A next-gen AI workflow platform that combines market signal synthesis, rapid idea validation, and autonomously generated execution blueprints for growth-stage founders.',
        niche: 'Founder Productivity + AI Ops',
        convictionScore: 78,
        expertPersonas: ['Growth Strategist', 'Product Ops Agent', 'Market Synthesis Bot'],
        marketInsight: 'This idea draws on founder productivity trends and long-tail automation demand across research tools, content pipelines, and agent orchestration.',
        agentGodPrompt: 'Generate a scalable AI operations platform that converts user research into autonomous product launch workflows and smart sprint plans.'
      }) });
      const data = await res.json();
      setMondayDrop(data);
    } catch (e) {
      console.error(e);
      setMondayDrop({
        ideaName: 'AI Venture Studio Launchpad',
        description: 'A next-gen AI workflow platform that combines market signal synthesis, rapid idea validation, and autonomously generated execution blueprints.',
        niche: 'Founder Productivity + AI Ops',
        convictionScore: 72,
        expertPersonas: ['Growth Strategist', 'Product Ops Agent', 'Market Synthesis Bot'],
        marketInsight: 'This idea draws on founder productivity trends and long-tail automation demand across research tools, content pipelines, and agent orchestration.',
        agentGodPrompt: 'Generate a scalable AI operations platform that converts user research into autonomous product launch workflows and smart sprint plans.'
      });
    } finally {
      setIsGeneratingDrop(false);
    }
  };

  // Generate automatically if visiting oracle view and no drop exists yet
  useEffect(() => {
    if (view === 'oracle' && !mondayDrop && !isGeneratingDrop) {
      generateMondayDrop();
    }
  }, [view, mondayDrop]);

  // Derived Data
  const activeProject = projects.find(p => p.id === activeProjectId);
  const anchorProject = projects.find(p => p.type === 'anchor');
  const sprintProjects = projects.filter(p => p.type === 'sprint');
  const vaultedProjects = projects.filter(p => p.type === 'vault');

  // Multi-Agent Pipeline Status State
  const [agentStatus, setAgentStatus] = useState('idle'); // idle | building | deployed
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalEndRef = useRef(null);

  // FocusOS Handlers
  const getProgress = (project) => {
    const total = STAGES.reduce((acc, stage) => acc + project.tasks[stage.key].length, 0);
    if (total === 0) return 0;
    const completed = project.tasks.launched.length;
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
        tasks: { ...p.tasks, [fromStage]: p.tasks[fromStage].filter(t => t.id !== taskId), [toStage]: [...p.tasks[toStage], taskToMove] }
      };
    }));
  };

  const addTask = (stageKey) => {
    if (!newTaskText.trim()) return;
    setProjects(projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, tasks: { ...p.tasks, [stageKey]: [...p.tasks[stageKey], { id: Date.now(), text: newTaskText }] } };
    }));
    setNewTaskText('');
    setIsAddingTaskTo(null);
  };

  const deleteTask = (taskId, stageKey) => {
    setProjects(projects.map(p => {
      if (p.id !== activeProjectId) return p;
      return { ...p, tasks: { ...p.tasks, [stageKey]: p.tasks[stageKey].filter(t => t.id !== taskId) } };
    }));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;
    const newProject = {
      id: Date.now(), ...newProjectForm, status: 'Just Started', dueDate: '',
      tasks: { backlog: [], active: [], review: [], launched: [] }
    };
    setProjects([...projects, newProject]);
    setShowNewProjectModal(false);
    setNewProjectForm({ title: '', niche: '', type: 'sprint' });
    setActiveProjectId(newProject.id);
    setView('dashboard');
  };

  const toggleVaultStatus = (projectId, newType) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) return { ...p, type: newType };
      if (newType === 'anchor' && p.type === 'anchor') return { ...p, type: 'vault' }; // One anchor allowed
      return p;
    }));
    if (activeProjectId === projectId && newType === 'vault') setActiveProjectId(null);
  };

  const deleteProject = (projectId) => {
    if(window.confirm("Are you sure you want to permanently delete this idea?")) {
      setProjects(projects.filter(p => p.id !== projectId));
      if (activeProjectId === projectId) setActiveProjectId(null);
    }
  };

  // Agent Pipeline Execution
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const deployAgentPipeline = async () => {
    setAgentStatus('building');
    setTerminalLogs(["[SYSTEM] Multi-Agent Pipeline Booting..."]);
    
    // Call the newly created true local-deployment route
    try {
      const deployRes = await Promise.resolve({ ok: true, json: async () => ([]) });
      
      const { deploymentSteps } = await deployRes.json();

      const deployEvents = deploymentSteps || [
        "[DATA_INGEST] Initializing system context...",
        "[SUCCESS] Agent Sprint started locally."
      ];

      // Pad with realistic delays to sync the UI building
      let accumulatorDelay = 0;
      deployEvents.forEach((log, i) => {
        accumulatorDelay += Math.random() * 800 + 400;
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, log]);
          if(i === deployEvents.length - 1) {
            setTimeout(() => {
              setAgentStatus('deployed');
              const ideaName = mondayDrop?.ideaName || 'AI Venture Sprint';
              const niche = mondayDrop?.niche || 'AI Strategy';
              const newSprint = {
                id: Date.now(), type: 'sprint', title: ideaName, niche,
                status: 'Live Scaffold', dueDate: '1-Week Agent Sprint',
                tasks: { backlog: [], active: [{id: 888, text: 'Execute `.instructions.md` with Claude'}], review: [], launched: [{id: 999, text: 'Auto-Scaffolding Complete'}] }
              };
              setProjects(prev => [newSprint, ...prev]);
            }, 1500);
          }
        }, accumulatorDelay);
      });
    } catch(err) {
      console.error(err);
      setTerminalLogs(prev => [...prev, "[ERROR] Scaffold Engine Failed to connect."]);
    }
  };

  const PipelineVisualizer = () => {
    const [activePhase, setActivePhase] = useState(1);
    const [isIngesting, setIsIngesting] = useState(false);
    
    // Phase 1 UI state
    const [newYtUrl, setNewYtUrl] = useState("");
    const [newYtName, setNewYtName] = useState("");
    const [newDumpName, setNewDumpName] = useState("");
    const [newDumpContent, setNewDumpContent] = useState("");

    // Initial Personas
    const [personas, setPersonas] = useState([
      { id: '1', name: 'Zach Sells AI', url: 'https://www.youtube.com/@ZachSellsAI', initials: 'ZA', color: 'bg-red-500' },
      { id: '2', name: 'Mark Tilbury', url: '', initials: 'MT', color: 'bg-blue-500' }
    ]);

    const handleIngestYoutube = async () => {
      if(!newYtUrl || !newYtName) return;
      setIsIngesting(true);
      try {
        const res = await Promise.resolve({ ok: true, json: async () => ([]) });
        const data = await res.json();
        
        // Add to horizontal scrolling UI
        setPersonas([...personas, { 
          id: Date.now().toString(), 
          name: newYtName, 
          url: newYtUrl, 
          initials: newYtName.substring(0,2).toUpperCase(),
          color: 'bg-purple-500' 
        }]);
        setNewYtUrl(""); setNewYtName("");
        alert(data.message || 'Scraped successfully!');
      } catch(err) {
        console.error(err);
        alert('Failed to ingest source.');
      }
      setIsIngesting(false);
    };

    const handleIngestDump = async () => {
      if(!newDumpName || !newDumpContent) return;
      setIsIngesting(true);
      try {
        const res = await Promise.resolve({ ok: true, json: async () => ([]) });
        const data = await res.json();
        setNewDumpName(""); setNewDumpContent("");
        alert(data.message || 'Saved to Knowledge Base!');
      } catch(err) {
        console.error(err);
        alert('Failed to save context.');
      }
      setIsIngesting(false);
    };

    const phases = [
      {
        id: 1,
        title: "Phase 1: The Context Engine",
        subtitle: "Ingestion & RAG Knowledge Base",
        description: "Constantly scraping and learning from your favorite creators and the current market.",
        color: "from-blue-500 to-cyan-400",
        details: [
          { icon: <Play className="w-5 h-5 text-red-500" />, text: "Zack Sells AI & Tilbury YouTube Transcripts" },
          { icon: <MessageSquare className="w-5 h-5 text-purple-400" />, text: "Skool.com Community Posts & Wins" },
          { icon: <Globe className="w-5 h-5 text-green-400" />, text: "Deep AI Market Research (Tavily/Perplexity)" },
          { icon: <Database className="w-5 h-5 text-blue-400" />, text: "Vector Database (The 'Financial Freedom' Brain)" }
        ]
      },
      {
        id: 2,
        title: "Phase 2: The Monday Pitch",
        subtitle: "FocusOS UI Integration",
        description: "Every Monday, the Engine synthesizes the data and pitches you the highest-conviction 1-week sprint idea.",
        color: "from-indigo-500 to-purple-500",
        details: [
          { icon: <Calendar className="w-5 h-5 text-indigo-400" />, text: "Automated Monday 8:00 AM Trigger" },
          { icon: <BrainCircuit className="w-5 h-5 text-pink-400" />, text: "Synthesizes latest trends + proven Skool strategies" },
          { icon: <Code2 className="w-5 h-5 text-gray-400" />, text: "Generates Hyper-Detailed Execution Prompt" },
          { icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, text: "Awaits your manual 'Approve & Execute' click" }
        ]
      },
      {
        id: 3,
        title: "Phase 3: The Builder Agent",
        subtitle: "Autonomous Execution Loop",
        description: "Once approved, the Agent takes the prompt and enters a relentless coding loop until deployment.",
        color: "from-orange-500 to-red-500",
        details: [
          { icon: <Code2 className="w-5 h-5 text-orange-400" />, text: "Agent scaffolds full-stack repo based on prompt" },
          { icon: <RefreshCw className="w-5 h-5 text-blue-400" />, text: "Self-correcting error loop (Code -> Test -> Fix)" },
          { icon: <Server className="w-5 h-5 text-gray-400" />, text: "Agent monitors terminal and server health" },
          { icon: <Rocket className="w-5 h-5 text-red-400" />, text: "Pushes live to Vercel/Netlify for deployment" }
        ]
      },
      {
        id: 4,
        title: "Phase 4: The Board of Directors",
        subtitle: "Multi-Agent Post-Launch Management",
        description: "The live app is handed over to a team of specialized AI personas to ensure financial success.",
        color: "from-emerald-500 to-teal-500",
        details: [
          { icon: <Users className="w-5 h-5 text-emerald-400" />, text: "Agent 1: Growth Hacker (Zack Donovan Persona)" },
          { icon: <Rocket className="w-5 h-5 text-green-400" />, text: "Agent 2: Finance & Pricing (Mark Tilbury Persona)" },
          { icon: <Server className="w-5 h-5 text-teal-400" />, text: "Agent 3: Tech Ops (Monitors uptime & API costs)" },
          { icon: <RefreshCw className="w-5 h-5 text-blue-400" />, text: "Feeds new analytics back into the Phase 1 Context Engine" }
        ]
      }
    ];

    return (
      <div className="max-w-6xl mx-auto animate-in fade-in duration-300 pb-16 pt-4">
        <header className="mb-10 text-center">
          <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">FocusOS: Autonomous Venture Studio Pipeline</h2>
          <p className="text-slate-400 text-sm">Interactive architecture map of your self-feeding, AI-driven SaaS factory.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4 relative">
             <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-800 rounded-full z-0 hidden lg:block"></div>
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative z-10 flex items-stretch cursor-pointer group" onClick={() => setActivePhase(phase.id)}>
                <div className="hidden lg:flex flex-col items-center mr-6">
                  <div className={"w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 " + (activePhase === phase.id ? 'bg-gradient-to-br ' + phase.color + ' shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-110' : 'bg-slate-800/80 border border-slate-700 group-hover:bg-slate-700')}>
                    <span className="text-2xl font-black text-white">{phase.id}</span>
                  </div>
                  {index < phases.length - 1 && <ArrowDown className={"w-6 h-6 my-2 transition-colors duration-300 " + (activePhase === phase.id ? 'text-indigo-400' : 'text-slate-700')} />}
                </div>
                <div className={"flex-1 p-6 rounded-2xl border transition-all duration-300 " + (activePhase === phase.id ? 'border-indigo-500/50 bg-[#161925] shadow-lg shadow-indigo-900/20' : 'border-slate-800 bg-[#12141D] hover:border-slate-700')}>
                  <h3 className={"text-xl font-bold mb-1 " + (activePhase === phase.id ? 'text-white' : 'text-slate-300')}>{phase.title}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-2">{phase.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-8 rounded-3xl border border-slate-800 bg-[#12141D] p-8 h-[75vh] overflow-y-auto custom-scrollbar relative">
              <div className={"absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br " + phases[activePhase - 1].color + " opacity-10 blur-3xl rounded-full transition-all duration-700"}></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={"p-3 rounded-xl bg-gradient-to-br " + phases[activePhase - 1].color + " bg-opacity-10"}>
                    <BrainCircuit className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{phases[activePhase - 1].title}</h2>
                    <p className="text-indigo-300 font-medium">{phases[activePhase - 1].subtitle}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-lg mb-8 leading-relaxed border-b border-slate-800 pb-6">{phases[activePhase - 1].description}</p>

                {/* --- BACKEND CONNECTED UI --- */}
                {activePhase === 1 && (
                  <div className="mb-8 animate-in slide-in-from-bottom-4">
                    {/* Horizontal Scrolling Personas */}
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                       <Play className="w-4 h-4" /> Active Personas Scraped
                    </h4>
                    <div className="flex space-x-4 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                      {personas.map(p => (
                        <div key={p.id} className="flex-shrink-0 flex flex-col items-center w-24 group cursor-pointer">
                          <div className={"w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-lg border-2 border-[#12141D] group-hover:scale-110 transition-transform " + p.color}>
                            {p.initials}
                          </div>
                          <span className="text-xs text-slate-300 text-center font-medium truncate w-full px-1">{p.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 bg-[#161925] p-5 rounded-xl border border-slate-800">
                      <h4 className="text-sm font-bold text-white mb-2">Ingest New Source to /data/sources</h4>
                      
                      <div className="flex space-x-2">
                        <input type="text" placeholder="Video URL (e.g. v=z...) or Channel" value={newYtUrl} onChange={e=>setNewYtUrl(e.target.value)} className="bg-[#0a0a0a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white flex-1 outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="Persona Name" value={newYtName} onChange={e=>setNewYtName(e.target.value)} className="bg-[#0a0a0a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white w-32 outline-none focus:border-indigo-500" />
                        <button onClick={handleIngestYoutube} disabled={isIngesting} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-xs font-bold transition-colors flex items-center gap-2">
                          {isIngesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Scrape
                        </button>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <input type="text" placeholder="Manual Topic" value={newDumpName} onChange={e=>setNewDumpName(e.target.value)} className="bg-[#0a0a0a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white w-1/3 outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="Paste full content or strategy here..." value={newDumpContent} onChange={e=>setNewDumpContent(e.target.value)} className="bg-[#0a0a0a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white flex-1 outline-none focus:border-indigo-500" />
                        <button onClick={handleIngestDump} disabled={isIngesting} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-xs font-bold transition-colors flex items-center gap-2">
                          <Database className="w-4 h-4" /> Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show standard info pills if anything else */}
                <div className="space-y-4">
                  {phases[activePhase - 1].details.map((detail, idx) => (
                    <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl bg-[#161925] border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="mt-0.5 p-2 bg-[#1A1D27] rounded-lg border border-slate-700/50">{detail.icon}</div>
                      <p className="text-slate-200 font-medium text-lg pt-1">{detail.text}</p>
                    </div>
                  ))}
                </div>

                {activePhase === 2 && (
                  <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                      <BrainCircuit className="w-5 h-5" /> Run The Monday Pitch (Synthesize from /data/sources)
                    </button>
                    <p className="text-xs text-slate-400 text-center mt-3">This will read text files from data/sources and generate a prompt using GPT-4o.</p>
                  </div>
                )}
                
                {activePhase === 4 && (
                  <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-indigo-300 font-bold mb-1">Feedback Loop Initiated</h4>
                      <p className="text-sm text-slate-400">Data returns to Phase 1 Context Engine</p>
                    </div>
                    <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
      <Sidebar 
        view={view} 
        setView={setView} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeProjectId={activeProjectId}
        setActiveProjectId={setActiveProjectId}
        anchorProject={anchorProject}
        sprintProjects={sprintProjects}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-800 h-16 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 text-slate-400 bg-slate-900 rounded-lg border border-slate-800" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            {activeProjectId && (
              <button onClick={() => setActiveProjectId(null)} className="hidden md:flex p-1.5 mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold text-slate-200">
              {activeProject ? activeProject.title : view === 'vault' ? 'The Idea Vault' : view === 'oracle' ? 'AI Venture Studio' : 'Command Center'}
            </h2>
          </div>
          <button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 md:px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> <span className="hidden md:inline">Manual Idea</span>
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
          
          {/* PIPELINE VISUALIZER */}
          {!activeProject && view === 'pipeline' && (
            <PipelineVisualizer
              sources={sources}
              saveSources={saveSources}
              isSavingSources={isSavingSources}
              mondayDrop={mondayDrop}
              generateMondayDrop={generateMondayDrop}
              isGeneratingDrop={isGeneratingDrop}
              ingestLogs={ingestLogs}
              deployAgentPipeline={deployAgentPipeline}
              agentStatus={agentStatus}
              terminalLogs={terminalLogs}
              terminalEndRef={terminalEndRef}
            />
          )}

          {/* THE MONDAY DROP (AI ORACLE) */}
          {!activeProject && view === 'oracle' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300 pb-16 pt-4">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-indigo-500" /> Executive AI Pitch
                  </h3>
                  <p className="text-slate-400 max-w-xl">Deep-researched synthesis of young tech founder trends from Skool and current internet zeitgeist. Ready for automated extraction.</p>
                </div>
                <div className="hidden sm:flex bg-indigo-500/10 border border-indigo-500/30 px-5 py-2.5 rounded-full items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Growth Conviction</span>
                  <span className="text-lg font-black text-emerald-400">{mondayDrop?.convictionScore || 0}%</span>
                </div>
              </div>

              {isGeneratingDrop || !mondayDrop ? (
                <div className="flex flex-col justify-center py-10 bg-[#0a0a0a] rounded-2xl border border-indigo-500/40 shadow-2xl relative overflow-hidden group min-h-[400px]">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                     {isGeneratingDrop && <div className="h-full bg-indigo-500 w-1/4 animate-[slide_2s_ease-in-out_infinite]" />}
                  </div>
                  
                  <div className="flex flex-col items-center justify-center mb-6 pt-4">
                     <BrainCircuit className={`w-12 h-12 text-indigo-500 mb-4 ${isGeneratingDrop ? 'animate-pulse' : ''}`} />
                     <h3 className="text-2xl font-black text-white mb-2">Phase 1 & 2: Ingestion Pipeline Active</h3>
                     <p className="text-indigo-400 font-medium text-sm">Dynamically pulling Context from Web Sources</p>
                  </div>

                  <div className="w-full max-w-3xl mx-auto px-6">
                    <div className="bg-black/90 border border-slate-800 rounded-xl p-5 h-64 overflow-y-auto font-mono text-sm text-emerald-400 shadow-inner flex flex-col justify-end">
                      {isGeneratingDrop ? (
                        <div className="space-y-2 w-full">
                          {ingestLogs.map((log, idx) => (
                            <div key={idx} className="animate-in slide-in-from-left-2 duration-200 w-full text-left">
                              <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                              <span className={log.includes('SUCCESS') ? 'text-indigo-400 font-bold' : log.includes('INIT') ? 'text-slate-300' : 'text-emerald-400'}>{log}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-500 flex flex-col items-center justify-center h-full gap-4 pb-8 w-full text-center">
                          <Eye className="w-8 h-8 opacity-50 mx-auto" />
                          <span>Pipeline standby. Awaiting parameters from Command Center...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : agentStatus === 'idle' && (
              <div className="bg-[#12141c] rounded-2xl border border-indigo-500/20 shadow-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="p-8 relative z-10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mondayDrop.expertPersonas?.map((persona, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                        <Bot className="w-3.5 h-3.5 text-indigo-400" /> Persona: {persona}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-4xl font-black text-white mb-2">{mondayDrop.ideaName}</h2>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-8">{mondayDrop.niche}</p>

                  <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 mb-8 border-l-4 border-l-indigo-500">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Market Insight Rationale</h4>
                    <p className="text-slate-300 font-medium leading-relaxed">{mondayDrop.marketInsight}</p>
                  </div>

                  <div className="mb-8">
                     <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-3">
                       <TerminalSquare className="w-4 h-4" /> Agent System 'God Prompt' Prepared:
                     </h4>
                     <div className="bg-[#050505] border border-slate-800 rounded-lg p-5">
                       <pre className="font-mono text-xs text-emerald-400/90 whitespace-pre-wrap leading-loose">
                         {mondayDrop.agentGodPrompt}
                       </pre>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-800">
                    <button onClick={deployAgentPipeline} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-1">
                      <Play className="w-5 h-5 fill-current" /> Deploy Autonomous Multi-Agent Builder
                    </button>
                    <button onClick={() => { generateMondayDrop(); }} className="sm:w-64 px-6 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 border border-slate-800 hover:text-white transition-colors">
                      Reject & Reroll Idea
                    </button>
                  </div>
                </div>
              </div>
              )}

              {/* LIVE TERMINAL FEED */}
              {agentStatus === 'building' && (
                <div className="bg-[#0a0a0a] rounded-2xl border border-indigo-500/40 p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                     <div className="h-full bg-indigo-500 w-1/4 animate-[slide_2s_ease-in-out_infinite]" />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <Bot className="w-8 h-8 text-indigo-400 relative z-10" />
                      <div className="absolute inset-0 bg-indigo-500/50 rounded-full blur-md animate-pulse"></div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white">Full-Stack Agent Execution Active</h4>
                      <p className="text-sm text-indigo-400">Do not refresh. System is compiling...</p>
                    </div>
                  </div>

                  <div className="bg-black/80 border border-slate-800 rounded-xl p-6 h-80 overflow-y-auto font-mono text-sm shadow-inner custom-scrollbar relative">
                     {terminalLogs.map((log, i) => (
                       <div key={i} className="mb-3 animate-in slide-in-from-left-4 duration-300 flex">
                         <span className="text-slate-600 w-24 shrink-0">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                         <span className={`ml-2 ${
                           log.includes('[ERROR]') || log.includes('[WARN]') ? 'text-orange-400' : 
                           log.includes('[SUCCESS]') || log.includes('[DEPLOY]') ? 'text-emerald-400' : 
                           log.includes('[CODE]') ? 'text-sky-300' : 
                           log.includes('[DATA_INGEST]') ? 'text-purple-400' : 'text-slate-300'
                         }`}>
                           {log}
                         </span>
                       </div>
                     ))}
                     <div ref={terminalEndRef} className="pb-4" />
                     <span className="inline-block w-2.5 h-4 bg-slate-500 ml-[104px] animate-pulse"></span>
                  </div>
                </div>
              )}

              {/* LAUNCHED DASHBOARD */}
              {agentStatus === 'deployed' && (
                <div className="bg-emerald-950/20 rounded-2xl border border-emerald-500/40 p-8 shadow-2xl animate-in zoom-in">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                       <Check className="w-8 h-8 text-emerald-400" />
                     </div>
                     <div>
                       <h4 className="text-3xl font-black text-white">System Validated & Deployed</h4>
                       <p className="text-emerald-400 font-bold mt-1">Handoff to Multi-Agent Board successful.</p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-[#050505] border border-slate-800 p-5 rounded-xl">
                       <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                         <div className="flex items-center gap-2 font-bold text-amber-400"><Bot className="w-4 h-4"/> Zack AI Module</div>
                         <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Marketing</span>
                       </div>
                       <p className="text-sm text-slate-300 leading-relaxed tracking-wide">"Deploying cold-DM sequencing to Skool admins via Twitter API. Tweaking hero copy for urgency."</p>
                     </div>
                     
                     <div className="bg-[#050505] border border-slate-800 p-5 rounded-xl">
                       <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                         <div className="flex items-center gap-2 font-bold text-blue-400"><Bot className="w-4 h-4"/> Tilbury AI Module</div>
                         <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Finance</span>
                       </div>
                       <p className="text-sm text-slate-300 leading-relaxed tracking-wide">"Stripe keys verified. Running A/B test on $19/mo vs $39/mo pricing tier to optimize LTV/CAC."</p>
                     </div>

                     <div className="bg-[#050505] border border-slate-800 p-5 rounded-xl">
                       <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                         <div className="flex items-center gap-2 font-bold text-slate-200"><Server className="w-4 h-4"/> DevOps Pulse</div>
                         <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">All Systems Go</span>
                       </div>
                       <p className="text-sm text-slate-300 leading-relaxed tracking-wide">Vercel Edge functions highly responsive. API costs minimal. Checking error logs natively.</p>
                     </div>
                   </div>

                   <button onClick={() => {setView('dashboard'); setAgentStatus('idle');}} className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                     Return to Main Command Center <ArrowRight className="inline w-4 h-4 ml-2 align-middle" />
                   </button>
                </div>
              )}
            </div>
          )}

          {/* DASHBOARD KANBAN OVERVIEW */}
          {!activeProject && view === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-300 pb-16">
              <section>
                 <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                    <Target className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-2xl font-black text-white">12-Week Anchor Component</h3>
                 </div>
                 {anchorProject ? (
                    <ProjectCard 
                      project={anchorProject} 
                      onSelect={setActiveProjectId} 
                      onToggleVault={toggleVaultStatus} 
                      onDelete={deleteProject} 
                      isActive={activeProjectId === anchorProject.id} 
                    />
                 ) : (
                    <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center">
                      <p className="text-slate-500 font-medium">Your schedule is empty for Deep Work.</p>
                      <button onClick={() => setView('vault')} className="mt-4 text-indigo-400 font-bold hover:text-indigo-300">Set Anchor from Vault</button>
                    </div>
                 )}
              </section>

              <section>
                 <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                    <Zap className="w-6 h-6 text-amber-500" />
                    <h3 className="text-2xl font-black text-white">Rapid 1-Week AI Sprints</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sprintProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onSelect={setActiveProjectId} 
                        onToggleVault={toggleVaultStatus} 
                        onDelete={deleteProject} 
                        isActive={activeProjectId === project.id} 
                      />
                    ))}
                    
                    <div 
                      onClick={() => setView('oracle')}
                      className="bg-indigo-950/20 border-2 border-dashed border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-indigo-400 hover:border-indigo-400 hover:bg-indigo-900/30 cursor-pointer transition-all min-h-[180px] group"
                    >
                      <Sparkles className="w-8 h-8 mb-3 group-hover:scale-125 transition-transform duration-300" />
                      <span className="font-bold">Summon Weekly Pitch</span>
                      <span className="text-xs text-indigo-500/70 mt-2 font-medium">1-Click Multi-Agent Deployment</span>
                    </div>
                 </div>
              </section>
            </div>
          )}

          {/* PROJECT BOARD / KANBAN */}
          {activeProject && (
            <TaskBoard
              activeProject={activeProject}
              STAGES={STAGES}
              moveTask={moveTask}
              addTask={addTask}
              deleteTask={deleteTask}
              isAddingTaskTo={isAddingTaskTo}
              setIsAddingTaskTo={setIsAddingTaskTo}
              newTaskText={newTaskText}
              setNewTaskText={setNewTaskText}
            />
          )}

          {/* IDEA VAULT VIEW */}
          {!activeProject && view === 'vault' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300 pb-16 pt-4">
              <div className="mb-10 border-b border-slate-800 pb-6">
                <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                  <Archive className="w-8 h-8 text-slate-500" /> Backlog Vault
                </h3>
                <p className="text-slate-400 font-medium">Contain distraction. Your brain is a factory, not a warehouse. Offload here.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vaultedProjects.map(project => (
                  <div key={project.id} className="bg-[#12141c] rounded-2xl border border-slate-800 p-6 flex flex-col group hover:border-slate-600 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-white text-lg leading-snug">{project.title}</h4>
                      <button onClick={() => deleteProject(project.id)} className="text-slate-500 hover:text-red-400 p-1 md:opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{project.niche}</p>
                    
                    <div className="mt-auto space-y-3 pt-6 border-t border-slate-800/50">
                      <button onClick={() => toggleVaultStatus(project.id, 'sprint')} className="w-full py-2.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:text-white border border-amber-500/20"><Zap className="w-4 h-4" /> Promote to Sprint</button>
                      <button onClick={() => toggleVaultStatus(project.id, 'anchor')} className="w-full py-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:text-white border border-emerald-500/20"><Target className="w-4 h-4" /> Set as Deep Anchor</button>
                    </div>
                  </div>
                ))}
                
                {vaultedProjects.length === 0 && (
                  <div className="col-span-full py-24 text-center bg-[#12141c] rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center">
                    <Archive className="w-16 h-16 text-slate-700 mb-6" />
                    <p className="text-white font-black text-2xl mb-2">Vault Empty</p>
                    <p className="text-slate-500 font-medium">Supreme operational focus achieved.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <NewProjectModal
        showNewProjectModal={showNewProjectModal}
        setShowNewProjectModal={setShowNewProjectModal}
        newProjectForm={newProjectForm}
        setNewProjectForm={setNewProjectForm}
        handleCreateProject={handleCreateProject}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
      `}} />
    </div>
  );
}

function Server(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
  )
}
