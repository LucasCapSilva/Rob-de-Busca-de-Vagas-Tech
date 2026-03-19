import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, Briefcase, Award, ChevronRight, Filter, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';
import type { JobMatch } from '../utils/jobMatcher';

const Dashboard = () => {
  const { candidate, matchedJobs } = useStore();
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  if (!candidate) {
    return <Navigate to="/" replace />;
  }

  const topJobs = matchedJobs.slice(0, 10);
  
  const filteredJobs = topJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Candidate Insights & Filters */}
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Seu Perfil</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
              <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Senioridade Estimada</p>
              <div className="flex items-center gap-2 mt-1">
                <Award size={16} className="text-[var(--color-primary)]" />
                <span className="font-medium text-gray-900 dark:text-white">{candidate.experienceLevel}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Skills Detectadas</p>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length === 0 && (
                  <span className="text-sm text-gray-500 italic">Nenhuma skill detectada.</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Filtros</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar vaga ou empresa..." 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Modalidade</p>
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Remoto', 'Híbrido', 'Presencial'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterType === type 
                        ? 'bg-[var(--color-primary)] text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Job List & Details */}
      <div className="lg:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Vagas Recomendadas <span className="text-[var(--color-primary)]">({filteredJobs.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedJob(job)}
                className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 ${
                  selectedJob?.id === job.id 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                    : 'border-transparent bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[var(--color-primary)]">
                    <Award size={12} />
                    {job.matchScore}% Match
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                    {job.type}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2" title={job.title}>
                  {job.title}
                </h3>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Building2 size={14} />
                  <span className="truncate">{job.company}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {job.stack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-medium">
                      {tech}
                    </span>
                  ))}
                  {job.stack.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-medium">
                      +{job.stack.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {job.location}
                  </div>
                  <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredJobs.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhuma vaga encontrada</h3>
              <p className="text-gray-500 dark:text-gray-400">Tente ajustar seus filtros ou termos de busca.</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal/Sidebar */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-200 dark:border-gray-800"
            >
              <div className="p-6">
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="mb-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex lg:hidden"
                >
                  <ChevronRight size={20} />
                </button>
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedJob.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Building2 size={16} /> {selectedJob.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {selectedJob.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-[var(--color-primary)]">{selectedJob.matchScore}%</div>
                    <span className="text-xs text-gray-500">Match Score</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Briefcase size={14} /> {selectedJob.level}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
                    {selectedJob.type}
                  </span>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Por que deu match?</h3>
                    <ul className="space-y-2">
                      {selectedJob.matchReasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {selectedJob.missingSkills.length > 0 && (
                      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-medium mb-2 text-sm">
                          <AlertCircle size={16} />
                          Gaps identificados
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-500 mb-2">Para aumentar suas chances, considere estudar:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedJob.missingSkills.map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/50 dark:bg-black/20 rounded text-xs font-medium text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/50">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Sobre a vaga</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedJob.description}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requisitos</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300 pl-4">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 pb-10">
                  <button className="w-full py-3 px-4 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity shadow-lg shadow-[var(--color-primary)]/30">
                    Candidatar-se agora <ExternalLink size={18} />
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Você será redirecionado para a página da empresa.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedJob(null)}
                className="hidden lg:flex absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
