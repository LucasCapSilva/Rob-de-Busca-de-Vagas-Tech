export interface CandidateData {
  name: string;
  skills: string[];
  experienceLevel: string; // 'Júnior', 'Pleno', 'Sênior', 'Especialista'
  yearsOfExperience: number;
}

const KNOWN_SKILLS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'NestJS', 'TypeScript', 'JavaScript', 
  'Java', 'Spring Boot', 'C#', '.NET', 'Python', 'Django', 'Flask', 'Ruby', 'PHP', 'Go', 
  'Rust', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis', 'Docker', 'Kubernetes', 
  'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'HTML', 'CSS', 'Tailwind', 'SASS', 'GraphQL', 'REST',
  'Machine Learning', 'Pandas', 'Data Science', 'React Native', 'Flutter', 'Swift', 'Kotlin'
];

export const analyzeResumeText = (text: string): CandidateData => {
  if (!text || typeof text !== 'string') {
    return {
      name: 'Candidato Anônimo',
      skills: [],
      experienceLevel: 'Júnior',
      yearsOfExperience: 0
    };
  }

  const normalizedText = text.toLowerCase();
  
  // Extract Skills
  const extractedSkills = KNOWN_SKILLS.filter(skill => {
    // Look for whole word matches to avoid partial matches like "go" in "good"
    const regex = new RegExp(`\\b${skill.toLowerCase().replace('.', '\\.')}\\b`, 'i');
    return regex.test(normalizedText);
  });

  // Extract Years of Experience (very basic heuristic)
  let yearsOfExperience = 0;
  const experienceRegex = /(\d+)\s+(anos|anos de experiência|years|yrs)/g;
  let match;
  
  // Limite de iterações para evitar qualquer possível loop infinito
  let iterations = 0;
  const MAX_ITERATIONS = 100;
  
  while ((match = experienceRegex.exec(normalizedText)) !== null && iterations < MAX_ITERATIONS) {
    iterations++;
    const years = parseInt(match[1], 10);
    if (!isNaN(years) && years > yearsOfExperience && years < 30) {
      yearsOfExperience = years;
    }
  }

  // Determine Level
  let experienceLevel = 'Júnior';
  if (yearsOfExperience >= 6 || normalizedText.includes('senior') || normalizedText.includes('sênior')) {
    experienceLevel = 'Sênior';
  } else if (yearsOfExperience >= 3 || normalizedText.includes('pleno') || normalizedText.includes('mid-level')) {
    experienceLevel = 'Pleno';
  }

  // Very basic name extraction (first 2 words of the document)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const name = words.slice(0, 2).join(' ') || 'Candidato Anônimo';

  return {
    name,
    skills: extractedSkills,
    experienceLevel,
    yearsOfExperience
  };
};
