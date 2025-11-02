// src/components/Chat/TypingIndicator.jsx

import { Sparkles } from 'lucide-react';

function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-fadeIn">
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-5 py-3 rounded-2xl shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
