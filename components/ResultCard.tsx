
import React from 'react';
import { GeneratedResult } from '../types';

interface Props {
  result: GeneratedResult;
}

const ResultCard: React.FC<Props> = ({ result }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-8 resume-card">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center print:bg-white print:border-b print:border-slate-300">
        <div>
          <h3 className="text-white font-bold text-lg print:text-slate-900">{result.role}</h3>
          <p className="text-slate-400 text-sm print:text-slate-600">{result.company}</p>
        </div>
        <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider border border-blue-500/30 no-print">
          AI Context Grounded
        </span>
      </div>

      <div className="p-6">
        <div className="mb-6 print:mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center print:text-slate-500">
            <i className="fas fa-map mr-2 no-print"></i> Company Context
          </h4>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic print:bg-white print:border-none print:p-0">
            "{result.roadmapContext}"
          </p>
        </div>

        <div className="mb-6 print:mb-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center print:text-slate-500">
            <i className="fas fa-list-ul mr-2 no-print"></i> Achievements
          </h4>
          <ul className="space-y-4 print:space-y-2">
            {result.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex group">
                <span className="text-blue-500 mr-3 mt-1.5">•</span>
                <div className="flex-1 text-slate-800 leading-relaxed print:text-black">
                  {point}
                  <button 
                    onClick={() => copyToClipboard(point)}
                    className="ml-2 text-slate-300 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 no-print"
                  >
                    <i className="far fa-copy"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {result.contextSources.length > 0 && (
          <div className="pt-6 border-t border-slate-100 grounding-sources">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Grounding Sources</h4>
            <div className="flex flex-wrap gap-2">
              {result.contextSources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200/50"
                >
                  <i className="fas fa-external-link-alt mr-1.5 text-[10px]"></i>
                  {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
