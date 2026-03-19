import type { CandidateData } from './resumeAnalyzer';
import type { Job } from '../types';

export interface JobMatch extends Job {
  matchScore: number;
  matchReasons: string[];
  missingSkills: string[];
}

export const calculateMatch = (candidate: CandidateData, jobs: Job[]): JobMatch[] => {
  if (!candidate || !candidate.skills) return [];

  return jobs.map(job => {
    let score = 0;
    const reasons: string[] = [];
    const missingSkills: string[] = [];

    // 1. Skill Matching (60% weight)
    const jobSkills = (job.stack || []).map((s: string) => s.toLowerCase());
    const candidateSkills = (candidate.skills || []).map((s: string) => s.toLowerCase());
    
    let matchedSkillsCount = 0;
    jobSkills.forEach((js: string) => {
      if (candidateSkills.some((cs: string) => js.includes(cs) || cs.includes(js))) {
        matchedSkillsCount++;
        reasons.push(`Skill: ${js}`);
      } else {
        missingSkills.push(js);
      }
    });

    const skillScore = jobSkills.length > 0 ? (matchedSkillsCount / jobSkills.length) * 60 : 60;
    score += skillScore;

    // 2. Level Matching (40% weight)
    const levelMap: Record<string, number> = {
      'Júnior': 1,
      'Pleno': 2,
      'Sênior': 3,
      'Especialista': 4
    };

    const candidateLevelVal = levelMap[candidate.experienceLevel] || 1;
    const jobLevelVal = levelMap[job.level] || 1;

    let levelScore = 0;
    if (candidateLevelVal >= jobLevelVal) {
      levelScore = 40; // Overqualified or exactly qualified
      reasons.push(`Nível de experiência adequado (${candidate.experienceLevel} para vaga ${job.level})`);
    } else if (jobLevelVal - candidateLevelVal === 1) {
      levelScore = 20; // One level below
      reasons.push(`Nível próximo ao desejado`);
    } else {
      levelScore = 0; // Two levels below
    }
    
    score += levelScore;

    return {
      ...job,
      matchScore: Math.round(score),
      matchReasons: reasons,
      missingSkills
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
