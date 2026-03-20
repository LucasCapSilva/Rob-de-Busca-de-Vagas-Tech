import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Briefcase, ArrowRight, Brain, Database, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { extractTextFromPDF } from '../utils/pdfParser';
import { analyzeResumeText } from '../utils/resumeAnalyzer';
import { calculateMatch } from '../utils/jobMatcher';
import jobsData from '../data/jobs.json';
import type { Job } from '../types';

const highlights = [
  {
    icon: Brain,
    title: 'Análise semântica de currículo',
    description: 'Extração automática de competências técnicas, senioridade e experiência relevante para ranking de vagas.',
  },
  {
    icon: Database,
    title: 'Base de vagas estruturada',
    description: 'Classificação por stack, modalidade e requisitos para gerar recomendações alinhadas ao perfil candidato.',
  },
  {
    icon: ShieldCheck,
    title: 'Fluxo confiável de processamento',
    description: 'Pipeline validado para upload de PDF, leitura robusta e cálculo de aderência com feedback em tempo real.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { setCandidate, setMatchedJobs, whiteLabelConfig } = useStore();
  const [isDragging, setIsDragging] = useState(false);
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

    setStatus('uploading');

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStatus('analyzing');
      const text = await extractTextFromPDF(selectedFile);
      const candidateData = analyzeResumeText(text);
      setCandidate(candidateData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('matching');
      const matches = calculateMatch(candidateData, jobsData as Job[]);
      setMatchedJobs(matches);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error: unknown) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Falha ao processar o arquivo PDF.';
      setErrorMsg(`Erro: ${message}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 py-6 md:space-y-12">
      <section className="grid grid-cols-1 gap-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40 md:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)] dark:bg-blue-900/20">
            Plataforma demonstrativa
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Match inteligente entre currículo e oportunidades de tecnologia
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 md:text-lg">
            O {whiteLabelConfig.platformName} demonstra um fluxo completo de recrutamento orientado por dados: parsing de PDF, análise automática de perfil e recomendação de vagas com score de aderência.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Conhecer arquitetura
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              Ver dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/60">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tecnologias demonstradas</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="rounded-lg bg-white px-3 py-2 dark:bg-gray-800">React + TypeScript no frontend</li>
            <li className="rounded-lg bg-white px-3 py-2 dark:bg-gray-800">Pipeline de análise com Python e Flask</li>
            <li className="rounded-lg bg-white px-3 py-2 dark:bg-gray-800">Automação de cenários com Selenium</li>
            <li className="rounded-lg bg-white px-3 py-2 dark:bg-gray-800">Persistência de dados analíticos em MySQL</li>
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
            <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-2 text-[var(--color-primary)] dark:bg-blue-900/20">
              <item.icon size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Teste o fluxo com seu currículo em PDF
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Envie um currículo e acompanhe o processamento até a geração das vagas recomendadas.
          </p>
        </div>

        <motion.div
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 md:p-12 ${
            isDragging
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-gray-600'
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
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleFileInput}
            disabled={status !== 'idle' && status !== 'error'}
          />

          <div className="pointer-events-none flex flex-col items-center justify-center space-y-4">
            {status === 'idle' && (
              <>
                <div className="rounded-full bg-blue-50 p-4 text-[var(--color-primary)] dark:bg-blue-900/20">
                  <UploadCloud size={48} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    Arraste seu currículo ou clique para selecionar
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Apenas arquivos PDF (máx. 5MB)</p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="rounded-full bg-red-50 p-4 text-red-500 dark:bg-red-900/20">
                  <AlertCircle size={48} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-red-500">{errorMsg}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Clique para tentar novamente</p>
                </div>
              </>
            )}

            {(status === 'uploading' || status === 'analyzing' || status === 'matching') && (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="mb-4 animate-spin text-[var(--color-primary)]" size={48} />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {status === 'uploading' && 'Enviando currículo...'}
                  {status === 'analyzing' && 'Analisando habilidades e experiência...'}
                  {status === 'matching' && 'Buscando as melhores vagas...'}
                </p>
              </div>
            )}

            {status === 'success' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-8">
                <CheckCircle2 className="mb-4 text-green-500" size={56} />
                <p className="text-xl font-semibold text-gray-900 dark:text-white">Análise concluída!</p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Redirecionando para seus resultados...</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <FileText className="text-gray-600 dark:text-gray-300" size={24} />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Análise Inteligente</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Extração automática de skills, senioridade e contexto profissional.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CheckCircle2 className="text-gray-600 dark:text-gray-300" size={24} />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Matching Preciso</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ranking de vagas por aderência técnica para acelerar sua tomada de decisão.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Briefcase className="text-gray-600 dark:text-gray-300" size={24} />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Aplicação Rápida</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Da análise do currículo à ação em poucos cliques no mesmo fluxo.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
