
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Experience, GeneratedResult, AppStatus } from './types';
import { generateResumeContent } from './services/geminiService';
import ExperienceInput from './components/ExperienceInput';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: uuidv4(), company: '', role: '', startDate: '', endDate: '', description: '', generationInstructions: '' }
  ]);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const addExperience = () => {
    setExperiences([...experiences, { 
      id: uuidv4(), company: '', role: '', startDate: '', endDate: '', description: '', generationInstructions: ''
    }]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const generate = async () => {
    const validExps = experiences.filter(e => e.company && e.role && e.startDate);
    if (validExps.length === 0) {
      alert("Please enter at least a company, role, and dates.");
      return;
    }

    setStatus(AppStatus.RESEARCHING);
    setError(null);
    setResults([]);

    try {
      const allResults: GeneratedResult[] = [];
      for (const exp of validExps) {
        const res = await generateResumeContent(exp);
        allResults.push(res);
      }
      setResults(allResults);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setResults([]);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-file-invoice text-xl"></i>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">ContextResume AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-500">
            <span>Powered by Gemini 3 Flash</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>Auto-Research Technology</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12 print:pt-0">
        {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Build your resume from <span className="text-blue-600">Company History</span>.
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                Just enter your company and role. Our AI researches what happened at that company while you were there and drafts high-impact achievements for you.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-700">
                <i className="fas fa-exclamation-circle mt-1"></i>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Your Career Timeline</h2>
                <button 
                  onClick={addExperience}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i> Add Position
                </button>
              </div>

              {experiences.map((exp) => (
                <ExperienceInput 
                  key={exp.id} 
                  experience={exp} 
                  onUpdate={updateExperience} 
                  onRemove={removeExperience}
                />
              ))}
            </div>

            <div className="pt-8 no-print">
              <button 
                onClick={generate}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center space-x-3"
              >
                <span>Generate Content from Scratch</span>
                <i className="fas fa-search-location"></i>
              </button>
              <p className="text-center text-slate-400 text-xs mt-4">
                The AI will use Google Search to find specific projects from those dates.
              </p>
            </div>
          </div>
        ) : status === AppStatus.RESEARCHING || status === AppStatus.GENERATING ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-pulse no-print">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-globe-americas text-blue-600 text-2xl"></i>
              </div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Searching Public Roadmaps...</h2>
              <p className="text-slate-500 max-w-xs font-medium">
                We're investigating what the company was building during your tenure to align your resume with real history.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-center justify-between mb-4 no-print">
              <h2 className="text-2xl font-bold text-slate-900">Research Results</h2>
              <button 
                onClick={reset}
                className="text-slate-500 hover:text-slate-700 font-semibold text-sm transition-colors"
              >
                <i className="fas fa-redo mr-2"></i> Edit Timeline
              </button>
            </div>

            <div id="resume-content">
              {results.map((res, idx) => (
                <ResultCard key={idx} result={res} />
              ))}
            </div>

            <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 no-print">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold">Researched & Verified</h3>
                <p className="text-blue-100 font-medium">These achievements are grounded in actual company milestones.</p>
              </div>
              <button 
                onClick={handlePrint}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center space-x-2"
              >
                <i className="fas fa-file-pdf"></i>
                <span>Export PDF Resume</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-12 no-print">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
          <p>© 2024 ContextResume AI. Grounded in reality.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
