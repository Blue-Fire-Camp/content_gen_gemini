
import React from 'react';
import { Experience } from '../types';

interface Props {
  experience: Experience;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}

const ExperienceInput: React.FC<Props> = ({ experience, onUpdate, onRemove }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md mb-4 relative group">
      <button 
        onClick={() => onRemove(experience.id)}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors no-print"
      >
        <i className="fas fa-trash-alt"></i>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Company Name</label>
          <input
            type="text"
            placeholder="e.g. Netflix, OpenAI, Tesla"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium"
            value={experience.company}
            onChange={(e) => onUpdate(experience.id, { company: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Job Role</label>
          <input
            type="text"
            placeholder="e.g. Product Designer"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium"
            value={experience.role}
            onChange={(e) => onUpdate(experience.id, { role: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</label>
          <input
            type="month"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            value={experience.startDate}
            onChange={(e) => onUpdate(experience.id, { startDate: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">End Date</label>
          <input
            type="month"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            value={experience.endDate}
            onChange={(e) => onUpdate(experience.id, { endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Basic Description (Optional)</label>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">AI will research if empty</span>
        </div>
        <textarea
          placeholder="Leave blank to let AI research the company's roadmap and generate achievements from scratch based on your role."
          rows={3}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium"
          value={experience.description}
          onChange={(e) => onUpdate(experience.id, { description: e.target.value })}
        />
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Advanced Instructions (Optional)</label>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Control tone, bullet count, tech, etc.</span>
        </div>
        <textarea
          placeholder="e.g. Generate 6 concise bullets, energetic but professional tone, must mention React, TypeScript, and GraphQL, focus on leadership impact."
          rows={3}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400 font-medium"
          value={experience.generationInstructions}
          onChange={(e) =>
            onUpdate(experience.id, { generationInstructions: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default ExperienceInput;
