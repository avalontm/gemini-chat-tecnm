// src/components/common/AssistantToggleButton/AssistantToggleButton.jsx

import { HelpCircle } from 'lucide-react';
import { useAssistantContext } from '@context/AssistantContext';

const AssistantToggleButton = () => {
  const assistant = useAssistantContext();

  const handleClick = () => {
    if (assistant.isVisible) {
      assistant.hide();
    } else {
      assistant.showHelp();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-35 w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="Asistente"
      title="Ayuda del Asistente"
    >
      <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
    </button>
  );
};

export default AssistantToggleButton;