import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0A0D15] py-5 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">© 2026 Focus OS. All rights reserved.</p>
        <p className="text-slate-500 text-sm">Built with React + Tailwind CSS</p>
      </div>
    </footer>
  );
}
