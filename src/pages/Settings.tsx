import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Save, Palette, Type } from 'lucide-react';

const Settings = () => {
  const { whiteLabelConfig, setWhiteLabelConfig } = useStore();
  const [formData, setFormData] = React.useState(whiteLabelConfig);
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWhiteLabelConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const presetColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações da Plataforma</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Personalize a aparência do sistema (White-label)</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-8"
      >
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Type size={18} />
            Nome da Plataforma
          </label>
          <input 
            type="text" 
            value={formData.platformName}
            onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            placeholder="Ex: TechJobs Bootcamp"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            <Palette size={18} />
            Cor Principal
          </label>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {presetColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, primaryColor: color.value })}
                className={`w-10 h-10 rounded-full cursor-pointer transition-transform ${
                  formData.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.value, '--tw-ring-color': color.value } as React.CSSProperties}
                title={color.name}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Ou cor customizada:</span>
            <input 
              type="color" 
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="h-10 w-20 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded cursor-pointer"
            />
            <span className="text-sm font-mono text-gray-600 dark:text-gray-300 uppercase">
              {formData.primaryColor}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            As alterações são salvas localmente no seu navegador.
          </p>
          <button 
            type="submit"
            className="px-6 py-3 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-[var(--color-primary)]/20"
          >
            <Save size={18} />
            {saved ? 'Salvo!' : 'Salvar Alterações'}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Settings;
