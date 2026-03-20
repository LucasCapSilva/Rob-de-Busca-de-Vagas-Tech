import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, Bot, CheckCircle2, Database, Layers, ServerCog, Target } from 'lucide-react';

const stackGroups = [
  { title: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { title: 'API e Serviços', items: ['Python', 'Flask', 'Integrações REST'] },
  { title: 'Automação', items: ['Selenium para cenários de testes e coleta automatizada'] },
  { title: 'Dados', items: ['MySQL para persistência relacional e histórico operacional'] },
];

const objectives = [
  'Demonstrar como uma aplicação de matching de vagas pode transformar currículos em recomendações acionáveis.',
  'Apresentar um fluxo técnico ponta a ponta, do upload do PDF ao ranking de aderência por vaga.',
  'Servir como referência de arquitetura modular para soluções de recrutamento orientadas por dados.',
];

const demoFeatures = [
  'Upload de currículo em PDF com parsing de texto e tratamento de erros.',
  'Análise automática de competências, senioridade e tempo de experiência.',
  'Score de aderência por vaga considerando stack, experiência e contexto profissional.',
  'Dashboard com filtros, visão de perfil e detalhamento completo das oportunidades.',
  'Configuração white-label de nome da plataforma e identidade visual.',
];

const architectureLayers = [
  {
    icon: Layers,
    title: 'Camada de Interface',
    description: 'SPA React com roteamento client-side, animações e componentes orientados a experiência.',
  },
  {
    icon: ServerCog,
    title: 'Camada de Processamento',
    description: 'Serviços em Python/Flask podem orquestrar parsing avançado, normalização e scoring de candidatos.',
  },
  {
    icon: Database,
    title: 'Camada de Dados',
    description: 'MySQL armazena histórico de análises, vagas processadas, auditoria e métricas de conversão.',
  },
  {
    icon: Bot,
    title: 'Camada de Automação',
    description: 'Selenium permite validar fluxos críticos, regressões e jornadas de uso em ambiente demonstrativo.',
  },
];

const useCases = [
  {
    title: 'Triagem inteligente em volume alto',
    description: 'Times de RH aceleram screening inicial de currículos com ranking técnico automatizado.',
  },
  {
    title: 'Recomendação personalizada por perfil',
    description: 'Profissionais recebem oportunidades mais aderentes ao seu conjunto de habilidades.',
  },
  {
    title: 'Apresentação para stakeholders',
    description: 'Produto ideal para demos comerciais e validação de conceito com líderes de tecnologia e recrutamento.',
  },
];

const About = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40 md:p-8">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)] dark:bg-blue-900/20">
          Sobre a solução
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Plataforma demonstrativa de matching de vagas com arquitetura orientada a produto
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Esta aplicação foi desenvolvida como uma vitrine técnica para demonstrar as capacidades essenciais de uma solução moderna de recrutamento: análise automatizada de currículo, classificação de oportunidades e experiência integrada para tomada de decisão.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Voltar para Home
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
          >
            Explorar dashboard
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.article initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <div className="mb-4 flex items-center gap-2">
            <Blocks className="text-[var(--color-primary)]" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tecnologias utilizadas</h2>
          </div>
          <div className="space-y-3">
            {stackGroups.map((group) => (
              <article key={group.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
                <p className="font-semibold text-gray-900 dark:text-white">{group.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{group.items.join(' · ')}</p>
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <div className="mb-4 flex items-center gap-2">
            <Target className="text-[var(--color-primary)]" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Objetivos principais</h2>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {objectives.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 text-[var(--color-primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.article>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Funcionalidades demonstrativas</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {demoFeatures.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 text-[var(--color-primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Casos práticos de aplicação</h2>
          <div className="space-y-3">
            {useCases.map((item) => (
              <article key={item.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
                <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </article>
            ))}
          </div>
        </motion.article>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/40">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Arquitetura do sistema</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {architectureLayers.map((layer) => (
            <article key={layer.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/60">
              <p className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <layer.icon size={16} className="text-[var(--color-primary)]" />
                {layer.title}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{layer.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
