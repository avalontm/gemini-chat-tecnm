import { useTheme } from '@context';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('ThemeToggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}

export default ThemeToggle;