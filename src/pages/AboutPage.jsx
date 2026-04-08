import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-black text-white mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">About Focus OS</h1>
        <p className="text-lg leading-relaxed text-slate-400 mb-8">
          Welcome to Focus OS! This dashboard helps you seamlessly manage the <strong>Productivity Planner Bundle</strong> and <strong>Nexus AI Dashboard Kit</strong>. Tailored for absolute focus and rapid project tracking.
        </p>
        <div className="bg-indigo-950/30 border border-indigo-500/20 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-indigo-400 mb-4">Features</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /><span>Vite SPA Routing via HashRouter</span></li>
            <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /><span>Tailwind CSS Implementation</span></li>
            <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /><span>Local State Management</span></li>
            <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3" /><span>Multiple Components Used</span></li>
          </ul>
        </div>
        <Link to="/" className="inline-flex items-center mt-10 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
