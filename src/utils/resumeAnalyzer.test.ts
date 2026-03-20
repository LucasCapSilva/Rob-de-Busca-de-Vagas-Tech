import { describe, expect, it } from 'vitest';
import { analyzeResumeText, inferExperienceLevel } from './resumeAnalyzer';

describe('resumeAnalyzer', () => {
  it('extrai nome, skills e senioridade de currículo em português', () => {
    const text = `
      Nome: Ana Souza
      Engenheira de Software com 7 anos de experiência.
      Atuação com React, TypeScript, Node.js, AWS e Docker.
    `;

    const result = analyzeResumeText(text);

    expect(result.name).toBe('Ana Souza');
    expect(result.yearsOfExperience).toBe(7);
    expect(result.experienceLevel).toBe('Sênior');
    expect(result.skills).toEqual(
      expect.arrayContaining(['React', 'TypeScript', 'Node.js', 'AWS']),
    );
  });

  it('detecta perfil especialista por palavras-chave', () => {
    const text = `
      Name: Bruno Lima
      Principal Engineer with 12 years of experience.
      Stack: Java, Spring Boot, Kubernetes, CI/CD.
    `;

    const result = analyzeResumeText(text);

    expect(result.name).toBe('Bruno Lima');
    expect(result.experienceLevel).toBe('Especialista');
    expect(result.skills).toEqual(
      expect.arrayContaining(['Java', 'Spring Boot', 'Kubernetes']),
    );
  });

  it('retorna fallback seguro para texto inválido', () => {
    const result = analyzeResumeText('');
    expect(result.name).toBe('Candidato Anônimo');
    expect(result.skills).toEqual([]);
    expect(result.experienceLevel).toBe('Júnior');
    expect(result.yearsOfExperience).toBe(0);
  });

  it('infere pleno por anos quando não há palavra-chave explícita', () => {
    const level = inferExperienceLevel(5, 'desenvolvedor backend com foco em api e cloud');
    expect(level).toBe('Pleno');
  });
});
