import type { CandidateData } from './resumeAnalyzer';
import type { Job } from '../types';
import Fuse from 'fuse.js';

export interface JobMatch extends Job {
  matchScore: number;
  matchReasons: string[];
  missingSkills: string[];
}

const levelMap: Record<string, number> = {
  'Júnior': 1,
  'Pleno': 2,
  'Sênior': 3,
  'Especialista': 4,
};

const getLevelScore = (candidateLevel: string, jobLevel: string): number => {
  const candidateLevelVal = levelMap[candidateLevel] || 1;
  const jobLevelVal = levelMap[jobLevel] || 1;

  if (candidateLevelVal >= jobLevelVal) {
    return 20;
  }
  if (jobLevelVal - candidateLevelVal === 1) {
    return 10;
  }
  return 0;
};

export const calculateMatch = (candidate: CandidateData, jobs: Job[]): JobMatch[] => {
  if (!candidate || !candidate.skills) return [];

  const searchQuery = `${candidate.skills.join(' ')} ${candidate.experienceLevel}`.trim();
  const fuse = new Fuse(jobs, {
    keys: ['title', 'description', 'stack', 'requirements'],
    threshold: 0.45,
    includeScore: true,
    ignoreLocation: true,
  });

  const fuzzyById = new Map<string, number>();
  if (searchQuery.length > 0) {
    fuse.search(searchQuery, { limit: Math.min(jobs.length, 300) }).forEach((result) => {
      const similarity = 1 - (result.score ?? 1);
      fuzzyById.set(result.item.id, Math.max(0, Math.min(1, similarity)));
    });
  }

  return jobs.map((job) => {
    let score = 0;
    const reasons: string[] = [];
    const missingSkills: string[] = [];

    const jobSkills = (job.stack || []).map((s: string) => s.toLowerCase());
    const candidateSkills = (candidate.skills || []).map((s: string) => s.toLowerCase());
    
    let matchedSkillsCount = 0;
    jobSkills.forEach((js) => {
      if (candidateSkills.some((cs: string) => js.includes(cs) || cs.includes(js))) {
        matchedSkillsCount++;
        reasons.push(`Skill alinhada: ${js}`);
      } else {
        missingSkills.push(js);
      }
    });

    const skillCoverage = jobSkills.length > 0 ? (matchedSkillsCount / jobSkills.length) : 0;
    const skillScore = skillCoverage * 55;
    score += skillScore;

    if (skillCoverage > 0) {
      reasons.push(`Cobertura de skills: ${Math.round(skillCoverage * 100)}%`);
    }

    const levelScore = getLevelScore(candidate.experienceLevel, job.level);
    score += levelScore;

    if (levelScore >= 20) {
      reasons.push(`Nível de experiência adequado (${candidate.experienceLevel} para vaga ${job.level})`);
    } else if (levelScore > 0) {
      reasons.push(`Nível próximo ao desejado`);
    }

    const normalizedYears = Math.max(0, Math.min(candidate.yearsOfExperience ?? 0, 10));
    const yearsScore = (normalizedYears / 10) * 10;
    score += yearsScore;
    if (normalizedYears > 0) {
      reasons.push(`Experiência acumulada: ${candidate.yearsOfExperience} anos`);
    }

    const fuzzyScore = (fuzzyById.get(job.id) ?? 0) * 15;
    score += fuzzyScore;
    if (fuzzyScore >= 7) {
      reasons.push('Alta relevância semântica com o currículo');
    }

    return {
      ...job,
      matchScore: Math.round(Math.max(0, Math.min(100, score))),
      matchReasons: reasons,
      missingSkills,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
