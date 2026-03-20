export interface CandidateData {
  name: string;
  skills: string[];
  experienceLevel: string; // 'Júnior', 'Pleno', 'Sênior', 'Especialista'
  yearsOfExperience: number;
}

export const KNOWN_SKILLS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'NestJS', 'TypeScript', 'JavaScript', 
  'Java', 'Spring Boot', 'C#', '.NET', 'Python', 'Django', 'Flask', 'Ruby', 'PHP', 'Go', 
  'Rust', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'NoSQL', 'Redis', 'Docker', 'Kubernetes', 
  'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'HTML', 'CSS', 'Tailwind', 'SASS', 'GraphQL', 'REST', 'Next.js',
  'Machine Learning', 'Pandas', 'Data Science', 'React Native', 'Flutter', 'Swift', 'Kotlin'
];

const SKILL_ALIASES: Record<string, string[]> = {
  'Node.js': ['node', 'nodejs', 'node.js'],
  'TypeScript': ['typescript', 'ts'],
  'JavaScript': ['javascript', 'js', 'ecmascript'],
  'Next.js': ['next.js', 'nextjs', 'next'],
  'C#': ['c#', 'csharp'],
  '.NET': ['.net', 'dotnet', 'asp.net'],
  'React Native': ['react native', 'rn'],
  'CI/CD': ['ci/cd', 'ci cd', 'continuous integration', 'continuous delivery'],
  'Machine Learning': ['machine learning', 'ml'],
  'Data Science': ['data science', 'ciência de dados'],
};

const fallbackCandidate = (): CandidateData => ({
  name: 'Candidato Anônimo',
  skills: [],
  experienceLevel: 'Júnior',
  yearsOfExperience: 0,
});

const sanitizeText = (text: string) => text.split('\0').join(' ').replace(/\s+/g, ' ').trim();

const extractName = (originalText: string): string => {
  const lines = originalText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const explicitNameLine = lines.find((line) => /^(nome|name)\s*:/i.test(line));
  if (explicitNameLine) {
    const explicitName = explicitNameLine.split(':').slice(1).join(':').trim();
    if (explicitName.length >= 3) {
      return explicitName;
    }
  }

  const probableName = lines.find((line) => /^[A-ZÀ-Ý][A-Za-zÀ-ÿ'-]+(?:\s+[A-ZÀ-Ý][A-Za-zÀ-ÿ'-]+){1,3}$/.test(line));
  if (probableName) {
    return probableName;
  }

  const firstWords = sanitizeText(originalText).split(' ').filter(Boolean).slice(0, 4).join(' ');
  return firstWords.length >= 3 ? firstWords : 'Candidato Anônimo';
};

const extractYearsOfExperience = (normalizedText: string): number => {
  const patterns = [
    /(\d{1,2})\+?\s*(?:anos?|years?|yrs?)(?:\s+de)?\s*(?:experi[eê]ncia|experience)?/gi,
    /(?:experi[eê]ncia|experience)\s*(?:de|:)?\s*(\d{1,2})\+?\s*(?:anos?|years?|yrs?)/gi,
  ];

  let maxYears = 0;

  patterns.forEach((pattern) => {
    let match: RegExpExecArray | null;
    let iterations = 0;
    while ((match = pattern.exec(normalizedText)) !== null && iterations < 200) {
      iterations += 1;
      const years = Number.parseInt(match[1], 10);
      if (Number.isFinite(years) && years >= 0 && years <= 40 && years > maxYears) {
        maxYears = years;
      }
    }
  });

  const sinceMatch = normalizedText.match(/(?:desde|since)\s+(20\d{2})/i);
  if (sinceMatch) {
    const startYear = Number.parseInt(sinceMatch[1], 10);
    const derivedYears = new Date().getFullYear() - startYear;
    if (derivedYears >= 0 && derivedYears <= 40) {
      maxYears = Math.max(maxYears, derivedYears);
    }
  }

  return maxYears;
};

export const inferExperienceLevel = (yearsOfExperience: number, normalizedText: string): string => {
  if (/(especialista|staff|principal|arquiteto)/i.test(normalizedText)) {
    return 'Especialista';
  }
  if (yearsOfExperience >= 6 || /(senior|sênior)/i.test(normalizedText)) {
    return 'Sênior';
  }
  if (yearsOfExperience >= 4 || /(pleno|mid-level|mid level|intermedi[aá]rio)/i.test(normalizedText)) {
    return 'Pleno';
  }
  return 'Júnior';
};

export const analyzeResumeText = (text: string): CandidateData => {
  if (!text || typeof text !== 'string') {
    return fallbackCandidate();
  }

  const normalizedText = sanitizeText(text).toLowerCase();

  const extractedSkills = KNOWN_SKILLS.filter((skill) => {
    const aliases = SKILL_ALIASES[skill] ?? [skill];
    return aliases.some((alias) => {
      const escapedAlias = alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-z0-9+#.])${escapedAlias}([^a-z0-9+#.]|$)`, 'i');
      return regex.test(normalizedText);
    });
  });

  const yearsOfExperience = extractYearsOfExperience(normalizedText);
  const experienceLevel = inferExperienceLevel(yearsOfExperience, normalizedText);
  const name = extractName(text);

  const uniqueSkills = [...new Set(extractedSkills)];

  return {
    name: name || 'Candidato Anônimo',
    skills: uniqueSkills,
    experienceLevel,
    yearsOfExperience,
  };
};
