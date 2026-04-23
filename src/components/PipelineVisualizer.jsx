import React, { useState } from 'react';
import { Play, Plus, Youtube, FileText, Users, Zap } from 'lucide-react';

export default function PipelineVisualizer({
  sources,
  saveSources,
  isSavingSources,
  mondayDrop,
  generateMondayDrop,
  isGeneratingDrop,
  ingestLogs,
  deployAgentPipeline,
  agentStatus,
  terminalLogs,
  terminalEndRef
}) {
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
      alert(data.message || 'Dump ingested successfully!');
      setNewDumpName(""); setNewDumpContent("");
    } catch(err) {
      console.error(err);
      alert('Failed to ingest dump.');
    }
    setIsIngesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Phase Selector */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActivePhase(1)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activePhase === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Phase 1: Data Ingestion
        </button>
        <button
          onClick={() => setActivePhase(2)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activePhase === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Phase 2: AI Generation
        </button>
        <button
          onClick={() => setActivePhase(3)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activePhase === 3 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Phase 3: Agent Deployment
        </button>
      </div>

      {/* Phase 1: Data Ingestion */}
      {activePhase === 1 && (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">Data Ingestion Pipeline</h3>

          {/* Personas Horizontal Scroll */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-slate-300 mb-4">Active Personas</h4>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {personas.map(persona => (
                <div key={persona.id} className="flex-shrink-0 bg-slate-800 rounded-lg p-4 text-center min-w-[120px]">
                  <div className={`${persona.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-white font-bold">{persona.initials}</span>
                  </div>
                  <p className="text-slate-300 text-sm font-medium">{persona.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ingestion Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Youtube className="w-5 h-5 mr-2" />
                YouTube Source
              </h4>
              <input
                type="text"
                value={newYtUrl}
                onChange={(e) => setNewYtUrl(e.target.value)}
                placeholder="YouTube URL"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 mb-3"
              />
              <input
                type="text"
                value={newYtName}
                onChange={(e) => setNewYtName(e.target.value)}
                placeholder="Persona Name"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 mb-3"
              />
              <button
                onClick={handleIngestYoutube}
                disabled={isIngesting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium disabled:opacity-50"
              >
                {isIngesting ? 'Ingesting...' : 'Ingest YouTube'}
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Raw Data Dump
              </h4>
              <input
                type="text"
                value={newDumpName}
                onChange={(e) => setNewDumpName(e.target.value)}
                placeholder="Dump Name"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 mb-3"
              />
              <textarea
                value={newDumpContent}
                onChange={(e) => setNewDumpContent(e.target.value)}
                placeholder="Paste raw data..."
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-300 mb-3"
              />
              <button
                onClick={handleIngestDump}
                disabled={isIngesting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium disabled:opacity-50"
              >
                {isIngesting ? 'Ingesting...' : 'Ingest Dump'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: AI Generation */}
      {activePhase === 2 && (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">AI Oracle Generation</h3>
          {mondayDrop ? (
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-6">
              <h4 className="text-xl font-bold text-indigo-400 mb-4">{mondayDrop.ideaName}</h4>
              <p className="text-slate-300 mb-4">{mondayDrop.description}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>Niche: {mondayDrop.niche}</span>
                <span>Conviction: {mondayDrop.conviction}/10</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={generateMondayDrop}
                disabled={isGeneratingDrop}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center mx-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                {isGeneratingDrop ? 'Generating...' : 'Generate Monday Drop'}
              </button>
            </div>
          )}
          {isGeneratingDrop && (
            <div className="mt-6 bg-slate-800 rounded-lg p-4 font-mono text-sm">
              <div className="text-slate-400 mb-2">Ingestion Logs:</div>
              {ingestLogs.map((log, i) => (
                <div key={i} className="text-slate-300">{log}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Phase 3: Agent Deployment */}
      {activePhase === 3 && (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">Agent Deployment</h3>
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300">Multi-Agent Pipeline Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                agentStatus === 'idle' ? 'bg-slate-500/20 text-slate-400' :
                agentStatus === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {agentStatus === 'idle' ? 'Idle' : agentStatus === 'building' ? 'Building...' : 'Deployed'}
              </span>
            </div>
            <button
              onClick={deployAgentPipeline}
              disabled={agentStatus !== 'idle'}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50 flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Deploy Agent Pipeline
            </button>
          </div>
          {terminalLogs.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
              <div className="text-slate-400 mb-2">Terminal Output:</div>
              {terminalLogs.map((log, i) => (
                <div key={i} className="text-slate-300">{log}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}