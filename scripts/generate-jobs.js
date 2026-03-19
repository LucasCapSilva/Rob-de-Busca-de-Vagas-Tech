import fs from 'fs';
import path from 'path';

const titles = ['Desenvolvedor Frontend', 'Desenvolvedor Backend', 'Desenvolvedor Full Stack', 'Engenheiro de Software', 'Arquiteto de Software', 'Analista de Dados', 'Engenheiro de Dados', 'DevOps Engineer', 'Site Reliability Engineer', 'Desenvolvedor Mobile', 'Especialista em Segurança'];
const companies = ['Tech Corp', 'Innova Solutions', 'Global Systems', 'NextGen Apps', 'Future Data', 'Cloud Networks', 'Smart Code', 'Agile Devs', 'Cyber Tech', 'Quantum Computing', 'Data Insights'];
const locations = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, RJ', 'Curitiba, MG', 'Florianópolis, PR', 'Porto Alegre, SC', 'Recife, RS', 'Brasília, PE', 'Salvador, PE', 'Fortaleza, BA'];
const types = ['Remoto', 'Presencial', 'Híbrido'];
const stacksList = [
  ['React', 'TypeScript', 'Tailwind'],
  ['Node.js', 'Express', 'MongoDB'],
  ['Java', 'Spring Boot', 'PostgreSQL'],
  ['C#', '.NET', 'SQL Server'],
  ['Python', 'Django', 'React'],
  ['Vue.js', 'Node.js', 'MySQL'],
  ['Angular', 'TypeScript', 'RxJS'],
  ['React Native', 'Firebase'],
  ['AWS', 'Docker', 'Kubernetes'],
  ['Python', 'Pandas', 'Machine Learning']
];
const levels = ['Júnior', 'Pleno', 'Sênior', 'Especialista'];

const generateJobs = (num) => {
  const jobs = [];
  for (let i = 1; i <= num; i++) {
    const title = titles[Math.floor(Math.random() * titles.length)];
    const stack = stacksList[Math.floor(Math.random() * stacksList.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    jobs.push({
      id: `job-${i}`,
      title: `${title} ${stack[0]} - ${level}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      type: types[Math.floor(Math.random() * types.length)],
      stack: stack,
      level: level,
      description: `Estamos buscando um ${title} nível ${level} para se juntar à nossa equipe. O candidato ideal terá forte experiência com ${stack.join(', ')}.`,
      requirements: [
        `Experiência comprovada com ${stack[0]}`,
        `Conhecimento sólido em ${stack[1]}`,
        `Familiaridade com ${stack[2] || 'metodologias ágeis'}`,
        'Boa comunicação e trabalho em equipe'
      ]
    });
  }
  return jobs;
};

const jobs = generateJobs(2000);
fs.writeFileSync(path.join(process.cwd(), 'src/data/jobs.json'), JSON.stringify(jobs, null, 2));
console.log('2000 jobs generated successfully!');
