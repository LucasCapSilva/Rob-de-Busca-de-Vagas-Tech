import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractTextFromPDF } from '../utils/pdfParser';
import { analyzeResumeText } from '../utils/resumeAnalyzer';
import { calculateMatch } from '../utils/jobMatcher';
import jobsData from '../data/jobs.json';
import type { Job } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const { setCandidate, setMatchedJobs, whiteLabelConfig } = useStore();
  const [isDragging, setIsDragging] = useState(false);
  const [_, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'matching' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setStatus('error');
      setErrorMsg('Por favor, envie um arquivo PDF válido.');
      return;
    }

    setFile(selectedFile);
    setStatus('uploading');

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatus('analyzing');
      const text = await extractTextFromPDF(selectedFile);
      const candidateData = analyzeResumeText(text);
      setCandidate(candidateData);

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('matching');
      const matches = calculateMatch(candidateData, jobsData as Job[]);
      setMatchedJobs(matches);

      // Simulate matching delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);

    } catch (error: any) {
      console.error('Erro detalhado no processamento:', error);
      setStatus('error');
      setErrorMsg(`Erro: ${error?.message || 'Falha ao processar o arquivo PDF.'}`);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
          Acelere sua <span style={{ color: 'var(--color-primary)' }}>recolocação</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Faça o upload do seu currículo em PDF e nossa IA do {whiteLabelConfig.platformName} encontrará as melhores vagas para o seu perfil em segundos.
        </p>
      </div>

      <motion.div 
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input 
          type="file" 
          accept=".pdf" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={status !== 'idle' && status !== 'error'}
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          {status === 'idle' && (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[var(--color-primary)]">
                <UploadCloud size={48} />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Arraste seu currículo ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Apenas arquivos PDF (máx 5MB)
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
                <AlertCircle size={48} />
              </div>
              <div>
                <p className="text-xl font-semibold text-red-500">
                  {errorMsg}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Clique para tentar novamente
                </p>
              </div>
            </>
          )}

          {(status === 'uploading' || status === 'analyzing' || status === 'matching') && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {status === 'uploading' && 'Enviando currículo...'}
                {status === 'analyzing' && 'Analisando habilidades e experiência...'}
                {status === 'matching' && 'Buscando as melhores vagas...'}
              </p>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8"
            >
              <CheckCircle2 className="text-green-500 mb-4" size={56} />
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Análise concluída!
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Redirecionando para seus resultados...
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <FileText className="text-gray-600 dark:text-gray-300" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Análise Inteligente</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Extraímos suas principais skills e nível de senioridade automaticamente.</p>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <CheckCircle2 className="text-gray-600 dark:text-gray-300" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Matching Preciso</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cruzamos seu perfil com milhares de vagas ativas no mercado.</p>
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <Briefcase className="text-gray-600 dark:text-gray-300" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Aplicação Rápida</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Encontre as vagas que mais dão match e aplique em um clique.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
