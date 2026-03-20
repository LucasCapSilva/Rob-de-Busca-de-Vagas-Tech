import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Settings, LayoutDashboard, Moon, Sun, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme, whiteLabelConfig } = useStore();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Briefcase size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              {whiteLabelConfig.platformName}
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              to="/about"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === '/about' ? 'text-[var(--color-primary)]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Info size={18} />
              <span className="hidden sm:inline">Sobre</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === '/dashboard' ? 'text-[var(--color-primary)]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link 
              to="/settings" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === '/settings' ? 'text-[var(--color-primary)]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Configurações</span>
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} {whiteLabelConfig.platformName}. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Layout;
