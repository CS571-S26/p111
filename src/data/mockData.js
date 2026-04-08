export const STAGES = [
  { key: 'backlog', label: 'Idea / Backlog', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { key: 'active', label: 'Doing Today', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'review', label: 'Formatting / Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'launched', label: 'Launched / Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

export const INITIAL_PROJECTS = [
  {
    id: 1,
    type: 'anchor', 
    title: 'Productivity Planner Bundle',
    niche: 'KDP Childrens',
    status: 'In Progress',
    dueDate: '2026-06-19', 
    tasks: {
      backlog: [{ id: 101, text: 'Finalize cover art with Ishan' }, { id: 104, text: 'Amazon Keyword Research' }],
      active: [{ id: 102, text: 'Format grid layouts for drawing steps' }],
      review: [],
      launched: [{ id: 103, text: 'Farm Animals Section Generated' }]
    }
  },
  {
    id: 2,
    type: 'sprint', 
    title: 'Nexus AI Dashboard Kit',
    niche: 'Etsy Templates',
    status: 'Active Sprint',
    dueDate: '2026-04-01',
    tasks: {
      backlog: [{ id: 201, text: 'Generate Canva templates' }],
      active: [{ id: 202, text: 'Competitor keyword research' }],
      review: [],
      launched: []
    }
  }
];
