import { describe, expect, it } from 'vitest';
import { calculateMatch } from './jobMatcher';
import type { CandidateData } from './resumeAnalyzer';
import type { Job } from '../types';

const jobs: Job[] = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend React',
    company: 'Tech A',
    location: 'São Paulo, SP',
    type: 'Remoto',
    stack: ['React', 'TypeScript', 'Tailwind'],
    level: 'Pleno',
    description: 'Construção de aplicações React de alta performance.',
    requirements: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: '2',
    title: 'Engenheiro Backend Java',
    company: 'Tech B',
    location: 'Curitiba, PR',
    type: 'Híbrido',
    stack: ['Java', 'Spring Boot', 'PostgreSQL'],
    level: 'Sênior',
    description: 'APIs Java com observabilidade e microsserviços.',
    requirements: ['Java', 'Spring Boot'],
  },
];

describe('jobMatcher', () => {
  it('ordena vagas por maior compatibilidade com skills e nível', () => {
    const candidate: CandidateData = {
      name: 'Ana Souza',
      skills: ['React', 'TypeScript', 'Node.js'],
      experienceLevel: 'Pleno',
      yearsOfExperience: 5,
    };

    const result = calculateMatch(candidate, jobs);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[0].matchScore).toBeGreaterThan(result[1].matchScore);
    expect(result[0].missingSkills).toContain('tailwind');
  });

  it('retorna razões de match e gaps de skills', () => {
    const candidate: CandidateData = {
      name: 'Bruno Lima',
      skills: ['Java'],
      experienceLevel: 'Júnior',
      yearsOfExperience: 1,
    };

    const result = calculateMatch(candidate, jobs);
    const javaJob = result.find((job) => job.id === '2');

    expect(javaJob).toBeDefined();
    expect(javaJob?.matchReasons.length).toBeGreaterThan(0);
    expect(javaJob?.missingSkills).toEqual(expect.arrayContaining(['spring boot', 'postgresql']));
  });
});
